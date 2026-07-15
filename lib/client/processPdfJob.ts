import type { ProcessorId } from "@/config/tools";

type ProcessPdfJobInput = {
  tool: ProcessorId;
  files: File[];
  options: Record<string, string>;
};

type ProcessPdfJobResult = {
  blob: Blob;
  fileName: string;
};

export async function processPdfJobInBrowser({ tool, files, options }: ProcessPdfJobInput): Promise<ProcessPdfJobResult> {
  const { PDFDocument, degrees } = await import("pdf-lib");

  if (tool === "merge") {
    const output = await PDFDocument.create();
    for (const file of files) {
      const source = await PDFDocument.load(await file.arrayBuffer());
      const pages = await output.copyPages(source, source.getPageIndices());
      pages.forEach((page) => output.addPage(page));
    }
    return pdfResult(await output.save(), "merged.pdf");
  }

  if (tool === "split") {
    const source = await PDFDocument.load(await files[0].arrayBuffer());
    const pageCount = source.getPageCount();
    const mode = options.splitMode ?? "every";
    if (mode === "extract") {
      const selected = parsePageSelection(options.pageRange ?? "", pageCount);
      if (selected.length === 0) throw new Error("추출할 페이지를 입력해 주세요.");
      const output = await PDFDocument.create();
      const pages = await output.copyPages(source, selected.map((page) => page - 1));
      pages.forEach((page) => output.addPage(page));
      return pdfResult(await output.save(), "extracted-pages.pdf");
    }

    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();
    const groups = mode === "ranges" ? parsePageGroups(options.pageRange ?? "", pageCount) : source.getPageIndices().map((index) => [index + 1]);
    if (groups.length === 0) throw new Error("분리할 페이지 범위를 입력해 주세요.");
    for (const [index, group] of groups.entries()) {
      const output = await PDFDocument.create();
      const pages = await output.copyPages(source, group.map((page) => page - 1));
      pages.forEach((page) => output.addPage(page));
      zip.file(mode === "every" ? `page-${group[0]}.pdf` : `range-${index + 1}.pdf`, await output.save());
    }
    return { blob: await zip.generateAsync({ type: "blob" }), fileName: "split-pages.zip" };
  }

  if (tool === "compress") {
    const source = await PDFDocument.load(await files[0].arrayBuffer(), { updateMetadata: false });
    return pdfResult(await source.save({ useObjectStreams: true, addDefaultPage: false }), "resaved.pdf");
  }

  if (tool === "reorder-pages") {
    const source = await PDFDocument.load(await files[0].arrayBuffer());
    const plan = JSON.parse(options.pagePlan ?? "[]") as Array<{ pageNumber: number; rotation: number; deleted: boolean }>;
    const activePages = plan.filter((page) => !page.deleted);
    if (activePages.length === 0) throw new Error("최소 한 페이지를 남겨 주세요.");
    const output = await PDFDocument.create();
    for (const item of activePages) {
      assertPageNumber(item.pageNumber, source.getPageCount());
      const [page] = await output.copyPages(source, [item.pageNumber - 1]);
      page.setRotation(degrees((page.getRotation().angle + item.rotation) % 360));
      output.addPage(page);
    }
    return pdfResult(await output.save(), "organized.pdf");
  }

  if (tool === "image-to-pdf") {
    const output = await PDFDocument.create();
    const pageSize = options.pageSize ?? "auto";
    const orientation = options.orientation ?? "portrait";
    const margin = Math.max(0, Number(options.margin ?? 24));
    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const image = file.type === "image/png" || file.name.toLowerCase().endsWith(".png") ? await output.embedPng(bytes) : await output.embedJpg(bytes);
      const dimensions = getPageDimensions(pageSize, orientation, image.width, image.height);
      const page = output.addPage(dimensions);
      const scale = Math.min(Math.max(1, dimensions[0] - margin * 2) / image.width, Math.max(1, dimensions[1] - margin * 2) / image.height);
      const width = image.width * scale;
      const height = image.height * scale;
      page.drawImage(image, { x: (dimensions[0] - width) / 2, y: (dimensions[1] - height) / 2, width, height });
    }
    return pdfResult(await output.save(), "images.pdf");
  }

  if (tool === "pdf-to-image") {
    const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
    pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/legacy/build/pdf.worker.min.mjs", import.meta.url).toString();
    const document = await pdfjs.getDocument({ data: new Uint8Array(await files[0].arrayBuffer()) }).promise;
    const format = options.imageFormat === "jpg" ? "jpg" : "png";
    const quality = Math.min(100, Math.max(1, Number(options.imageQuality ?? 90)));
    const scale = quality >= 100 ? 2.5 : quality >= 90 ? 2 : 1.5;
    const selectedPages = options.pageRange?.trim() ? parsePageSelection(options.pageRange, document.numPages) : Array.from({ length: document.numPages }, (_, index) => index + 1);
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();
    try {
      for (const pageNumber of selectedPages) {
        const page = await document.getPage(pageNumber);
        const viewport = page.getViewport({ scale });
        const canvas = window.document.createElement("canvas");
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        const context = canvas.getContext("2d");
        if (!context) throw new Error("이미지 변환을 위한 브라우저 기능을 사용할 수 없습니다.");
        if (format === "jpg") { context.fillStyle = "#ffffff"; context.fillRect(0, 0, canvas.width, canvas.height); }
        await page.render({ canvas, canvasContext: context, viewport }).promise;
        const blob = await canvasToBlob(canvas, format === "jpg" ? "image/jpeg" : "image/png", quality / 100);
        zip.file(`page-${pageNumber}.${format}`, blob);
        page.cleanup();
      }
      return { blob: await zip.generateAsync({ type: "blob" }), fileName: "pdf-images.zip" };
    } finally {
      await document.destroy();
    }
  }

  throw new Error("지원하지 않는 작업입니다.");
}

function pdfResult(bytes: Uint8Array, fileName: string) { return { blob: new Blob([bytes as BlobPart], { type: "application/pdf" }), fileName }; }

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number) { return new Promise<Blob>((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("이미지를 만들 수 없습니다.")), type, quality)); }

function parsePageSelection(value: string, pageCount: number) { return Array.from(new Set(parsePageGroups(value, pageCount).flat())); }

function parsePageGroups(value: string, pageCount: number) {
  if (!value.trim()) return [];
  return value.split(",").map((token) => {
    const trimmed = token.trim();
    if (/^\d+$/.test(trimmed)) { const page = Number(trimmed); assertPageNumber(page, pageCount); return [page]; }
    const match = trimmed.match(/^(\d+)\s*-\s*(\d+)$/);
    if (!match) throw new Error("페이지 범위를 '1-3, 5, 8-10' 형식으로 입력해 주세요.");
    const start = Number(match[1]); const end = Number(match[2]);
    assertPageNumber(start, pageCount); assertPageNumber(end, pageCount);
    if (start > end) throw new Error("페이지 범위의 시작 번호가 끝 번호보다 클 수 없습니다.");
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  });
}

function assertPageNumber(page: number, pageCount: number) { if (!Number.isInteger(page) || page < 1 || page > pageCount) throw new Error(`페이지 번호는 1부터 ${pageCount} 사이여야 합니다.`); }

function getPageDimensions(pageSize: string, orientation: string, imageWidth: number, imageHeight: number): [number, number] {
  const size: [number, number] = pageSize === "a4" ? [595.28, 841.89] : pageSize === "letter" ? [612, 792] : [imageWidth, imageHeight];
  if (orientation === "landscape" && size[1] > size[0]) return [size[1], size[0]];
  if (orientation === "portrait" && size[0] > size[1]) return [size[1], size[0]];
  return size;
}

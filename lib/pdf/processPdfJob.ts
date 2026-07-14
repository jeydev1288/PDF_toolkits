import { spawn } from "node:child_process";
import { access, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { homedir, tmpdir } from "node:os";
import { join } from "node:path";
import JSZip from "jszip";
import { PDFDocument, degrees } from "pdf-lib";
import type { ProcessorId } from "@/config/tools";

type UploadedFile = {
  name: string;
  type: string;
  buffer: Buffer;
};

type ProcessPdfJobInput = {
  tool: ProcessorId;
  files: UploadedFile[];
  options: Record<string, FormDataEntryValue>;
};

type ProcessPdfJobResult = {
  buffer: Buffer;
  fileName: string;
  contentType: string;
};

export async function processPdfJob({
  tool,
  files,
  options
}: ProcessPdfJobInput): Promise<ProcessPdfJobResult> {
  switch (tool) {
    case "merge":
      return {
        buffer: await mergePdfFiles(files),
        fileName: "merged.pdf",
        contentType: "application/pdf"
      };
    case "split":
      return splitPdfFile(files[0], options);
    case "compress":
      return {
        buffer: await resavePdfFile(files[0]),
        fileName: "resaved.pdf",
        contentType: "application/pdf"
      };
    case "image-to-pdf":
      return {
        buffer: await imageFilesToPdf(files, options),
        fileName: "images.pdf",
        contentType: "application/pdf"
      };
    case "pdf-to-image":
      return pdfFileToImages(files[0], options);
    case "reorder-pages":
      return {
        buffer: await organizePdfFile(files[0], options),
        fileName: "organized.pdf",
        contentType: "application/pdf"
      };
    default:
      throw new Error("지원하지 않는 작업입니다.");
  }
}

async function mergePdfFiles(files: UploadedFile[]) {
  assertPdfFiles(files);
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const sourcePdf = await PDFDocument.load(file.buffer);
    const pages = await mergedPdf.copyPages(sourcePdf, sourcePdf.getPageIndices());
    pages.forEach((page) => mergedPdf.addPage(page));
  }

  return Buffer.from(await mergedPdf.save());
}

async function splitPdfFile(
  file: UploadedFile,
  options: Record<string, FormDataEntryValue>
): Promise<ProcessPdfJobResult> {
  assertPdfFiles([file]);
  const sourcePdf = await PDFDocument.load(file.buffer);
  const pageCount = sourcePdf.getPageCount();
  const mode = String(options.splitMode ?? "every");
  const pageRange = String(options.pageRange ?? "").trim();

  if (mode === "extract") {
    const pageNumbers = parsePageSelection(pageRange, pageCount);
    if (pageNumbers.length === 0) throw new Error("추출할 페이지를 입력해 주세요.");

    const outputPdf = await PDFDocument.create();
    const pages = await outputPdf.copyPages(
      sourcePdf,
      pageNumbers.map((page) => page - 1)
    );
    pages.forEach((page) => outputPdf.addPage(page));
    return {
      buffer: Buffer.from(await outputPdf.save()),
      fileName: "extracted-pages.pdf",
      contentType: "application/pdf"
    };
  }

  const groups =
    mode === "ranges"
      ? parsePageGroups(pageRange, pageCount)
      : sourcePdf.getPageIndices().map((index) => [index + 1]);

  if (groups.length === 0) throw new Error("분리할 페이지 범위를 입력해 주세요.");

  const zip = new JSZip();
  for (const [groupIndex, group] of groups.entries()) {
    const pagePdf = await PDFDocument.create();
    const pages = await pagePdf.copyPages(
      sourcePdf,
      group.map((page) => page - 1)
    );
    pages.forEach((page) => pagePdf.addPage(page));
    zip.file(
      mode === "every" ? `page-${group[0]}.pdf` : `range-${groupIndex + 1}.pdf`,
      await pagePdf.save()
    );
  }

  return {
    buffer: Buffer.from(await zip.generateAsync({ type: "nodebuffer" })),
    fileName: "split-pages.zip",
    contentType: "application/zip"
  };
}

async function resavePdfFile(file: UploadedFile) {
  assertPdfFiles([file]);
  const pdf = await PDFDocument.load(file.buffer, { updateMetadata: false });
  return Buffer.from(await pdf.save({ useObjectStreams: true, addDefaultPage: false }));
}

async function organizePdfFile(
  file: UploadedFile,
  options: Record<string, FormDataEntryValue>
) {
  assertPdfFiles([file]);
  const sourcePdf = await PDFDocument.load(file.buffer);
  const pageCount = sourcePdf.getPageCount();
  const rawPlan = String(options.pagePlan ?? "");
  const defaultPlan = Array.from({ length: pageCount }, (_, index) => ({
    pageNumber: index + 1,
    rotation: 0,
    deleted: false
  }));
  const plan = rawPlan ? parsePagePlan(rawPlan, pageCount) : defaultPlan;
  const activePages = plan.filter((page) => !page.deleted);

  if (activePages.length === 0) throw new Error("최소 한 페이지는 남겨 주세요.");

  const outputPdf = await PDFDocument.create();
  for (const item of activePages) {
    const [page] = await outputPdf.copyPages(sourcePdf, [item.pageNumber - 1]);
    const currentRotation = page.getRotation().angle;
    page.setRotation(degrees((currentRotation + item.rotation) % 360));
    outputPdf.addPage(page);
  }

  return Buffer.from(await outputPdf.save());
}

async function imageFilesToPdf(
  files: UploadedFile[],
  options: Record<string, FormDataEntryValue>
) {
  if (files.length === 0) throw new Error("PDF로 변환할 이미지를 업로드해 주세요.");

  const pdf = await PDFDocument.create();
  const pageSize = String(options.pageSize ?? "auto");
  const orientation = String(options.orientation ?? "portrait");
  const margin = Math.max(0, Number(options.margin ?? 24));

  for (const file of files) {
    const image = await embedImage(pdf, file);
    const dimensions = getPageDimensions(pageSize, orientation, image.width, image.height);
    const page = pdf.addPage(dimensions);
    const availableWidth = Math.max(1, dimensions[0] - margin * 2);
    const availableHeight = Math.max(1, dimensions[1] - margin * 2);
    const scale = Math.min(availableWidth / image.width, availableHeight / image.height);
    const width = image.width * scale;
    const height = image.height * scale;

    page.drawImage(image, {
      x: (dimensions[0] - width) / 2,
      y: (dimensions[1] - height) / 2,
      width,
      height
    });
  }

  return Buffer.from(await pdf.save());
}

async function pdfFileToImages(
  file: UploadedFile,
  options: Record<string, FormDataEntryValue>
): Promise<ProcessPdfJobResult> {
  assertPdfFiles([file]);
  const sourcePdf = await PDFDocument.load(file.buffer);
  const pages = parsePageSelection(
    String(options.pageRange ?? ""),
    sourcePdf.getPageCount(),
    true
  );
  const format = String(options.imageFormat ?? "png") === "jpg" ? "jpg" : "png";
  const quality = Math.min(100, Math.max(1, Number(options.imageQuality ?? 90)));
  const workDirectory = await mkdtemp(join(tmpdir(), "pdf-toolkit-"));
  const inputPath = join(workDirectory, "input.pdf");
  const zip = new JSZip();

  try {
    await writeFile(inputPath, file.buffer);

    for (const pageNumber of pages) {
      const outputPrefix = join(workDirectory, `page-${pageNumber}`);
      const args = [
        "-f",
        String(pageNumber),
        "-l",
        String(pageNumber),
        "-singlefile",
        format === "jpg" ? "-jpeg" : "-png"
      ];
      if (format === "jpg") args.push("-jpegopt", `quality=${quality}`);
      args.push(inputPath, outputPrefix);

      await runPdfToPpm(args);
      const outputPath = `${outputPrefix}.${format === "jpg" ? "jpg" : "png"}`;
      zip.file(`page-${pageNumber}.${format}`, await readFile(outputPath));
    }

    return {
      buffer: Buffer.from(await zip.generateAsync({ type: "nodebuffer" })),
      fileName: "pdf-images.zip",
      contentType: "application/zip"
    };
  } finally {
    await rm(workDirectory, { recursive: true, force: true });
  }
}

async function runPdfToPpm(args: string[]) {
  const command = await resolvePdfToPpmCommand();

  await new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, {
      shell: false,
      windowsHide: true,
      stdio: ["ignore", "ignore", "pipe"]
    });
    let stderr = "";
    child.stderr.on("data", (chunk) => {
      stderr += String(chunk);
    });
    child.on("error", () => reject(new Error("PDF 이미지 변환 엔진을 실행할 수 없습니다.")));
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(stderr.trim() || "PDF 페이지를 이미지로 변환하지 못했습니다."));
    });
  });
}

async function resolvePdfToPpmCommand() {
  if (process.env.PDFTOPPM_PATH) return process.env.PDFTOPPM_PATH;
  if (process.platform !== "win32") return "pdftoppm";

  const bundledRuntimePath = join(
    homedir(),
    ".cache",
    "codex-runtimes",
    "codex-primary-runtime",
    "dependencies",
    "native",
    "poppler",
    "Library",
    "bin",
    "pdftoppm.exe"
  );

  try {
    await access(bundledRuntimePath);
    return bundledRuntimePath;
  } catch {
    throw new Error(
      "PDF 이미지 변환 엔진을 찾을 수 없습니다. PDFTOPPM_PATH 환경 변수를 설정해 주세요."
    );
  }
}

async function embedImage(pdf: PDFDocument, file: UploadedFile) {
  const lowerName = file.name.toLowerCase();
  if (file.type === "image/png" || lowerName.endsWith(".png")) {
    return pdf.embedPng(file.buffer);
  }
  if (
    file.type === "image/jpeg" ||
    lowerName.endsWith(".jpg") ||
    lowerName.endsWith(".jpeg")
  ) {
    return pdf.embedJpg(file.buffer);
  }
  throw new Error("PNG 또는 JPG 이미지만 PDF로 변환할 수 있습니다.");
}

function getPageDimensions(
  pageSize: string,
  orientation: string,
  imageWidth: number,
  imageHeight: number
): [number, number] {
  const size: [number, number] =
    pageSize === "a4"
      ? [595.28, 841.89]
      : pageSize === "letter"
        ? [612, 792]
        : [imageWidth, imageHeight];

  if (orientation === "landscape" && size[1] > size[0]) return [size[1], size[0]];
  if (orientation === "portrait" && size[0] > size[1]) return [size[1], size[0]];
  return size;
}

function parsePageSelection(value: string, pageCount: number, allowEmpty = false) {
  if (!value.trim()) {
    return allowEmpty ? Array.from({ length: pageCount }, (_, index) => index + 1) : [];
  }
  return Array.from(new Set(parsePageGroups(value, pageCount).flat()));
}

function parsePageGroups(value: string, pageCount: number) {
  if (!value.trim()) return [];

  return value.split(",").map((token) => {
    const trimmedToken = token.trim();
    const rangeMatch = trimmedToken.match(/^(\d+)\s*-\s*(\d+)$/);
    const singleMatch = trimmedToken.match(/^\d+$/);

    if (singleMatch) {
      const page = Number(trimmedToken);
      assertPageNumber(page, pageCount);
      return [page];
    }
    if (rangeMatch) {
      const start = Number(rangeMatch[1]);
      const end = Number(rangeMatch[2]);
      assertPageNumber(start, pageCount);
      assertPageNumber(end, pageCount);
      if (start > end) throw new Error("페이지 범위의 시작 번호가 끝 번호보다 클 수 없습니다.");
      return Array.from({ length: end - start + 1 }, (_, index) => start + index);
    }
    throw new Error("페이지 범위를 '1-3, 5, 8-10' 형식으로 입력해 주세요.");
  });
}

function parsePagePlan(value: string, pageCount: number) {
  const parsed = JSON.parse(value) as Array<{
    pageNumber: number;
    rotation: number;
    deleted?: boolean;
  }>;
  if (!Array.isArray(parsed)) throw new Error("페이지 정리 정보가 올바르지 않습니다.");

  return parsed.map((item) => {
    assertPageNumber(item.pageNumber, pageCount);
    const rotation = Number(item.rotation) || 0;
    if (![0, 90, 180, 270].includes(rotation)) {
      throw new Error("페이지 회전 값이 올바르지 않습니다.");
    }
    return { pageNumber: item.pageNumber, rotation, deleted: Boolean(item.deleted) };
  });
}

function assertPageNumber(page: number, pageCount: number) {
  if (!Number.isInteger(page) || page < 1 || page > pageCount) {
    throw new Error(`페이지 번호는 1부터 ${pageCount} 사이여야 합니다.`);
  }
}

function assertPdfFiles(files: UploadedFile[]) {
  for (const file of files) {
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      throw new Error("PDF 파일만 업로드할 수 있습니다.");
    }
  }
}

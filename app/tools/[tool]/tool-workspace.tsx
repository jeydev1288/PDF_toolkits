"use client";

import { useEffect, useMemo, useState } from "react";
import { ErrorState } from "@/components/ErrorState";
import { FileDropzone } from "@/components/FileDropzone";
import { PageOrganizer, type OrganizedPage } from "@/components/PageOrganizer";
import { ProcessingProgress } from "@/components/ProcessingProgress";
import { RelatedTools } from "@/components/RelatedTools";
import { ResultCard } from "@/components/ResultCard";
import { ToolOptionPanel, ToolRunButton } from "@/components/ToolOptionPanel";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { UploadedFileCard } from "@/components/UploadedFileCard";
import type { ToolConfig, ToolId } from "@/config/tools";
import { processPdfJobInBrowser } from "@/lib/client/processPdfJob";

type ClientToolConfig = Omit<ToolConfig, "icon">;
type ResultState = { url: string; fileName: string };

export function ToolWorkspace({ tool }: { tool: ClientToolConfig }) {
  const [files, setFiles] = useState<File[]>([]);
  const [pages, setPages] = useState<OrganizedPage[]>([]);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ResultState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<Record<string, string>>(() =>
    Object.fromEntries((tool.options ?? []).map((option) => [option.id, option.defaultValue]))
  );

  useEffect(() => {
    let cancelled = false;
    const file = files[0];

    if (tool.id !== "organize-pdf" || !file) {
      setPages([]);
      return;
    }

    async function readPages() {
      try {
        const { PDFDocument } = await import("pdf-lib");
        const pdf = await PDFDocument.load(await file.arrayBuffer());
        if (cancelled) return;
        setPages(
          Array.from({ length: pdf.getPageCount() }, (_, index) => ({
            pageNumber: index + 1,
            rotation: 0,
            selected: false,
            deleted: false
          }))
        );
      } catch {
        if (!cancelled) setError("PDF 페이지 정보를 읽을 수 없습니다.");
      }
    }

    void readPages();
    return () => {
      cancelled = true;
    };
  }, [files, tool.id]);

  useEffect(
    () => () => {
      if (result?.url) URL.revokeObjectURL(result.url);
    },
    [result]
  );

  const canSubmit = useMemo(() => {
    if (isProcessing || files.length === 0) return false;
    if (tool.id === "merge-pdf" && files.length < 2) return false;
    if (tool.id === "organize-pdf" && pages.filter((page) => !page.deleted).length === 0) {
      return false;
    }
    if (tool.id === "split-pdf" && options.splitMode !== "every" && !options.pageRange?.trim()) {
      return false;
    }
    return tool.multiple || files.length === 1;
  }, [files.length, isProcessing, options.pageRange, options.splitMode, pages, tool.id, tool.multiple]);

  const actionLabel = getActionLabel(tool, files.length);

  function clearResultState() {
    if (result?.url) URL.revokeObjectURL(result.url);
    setResult(null);
    setError(null);
    setProgress(0);
  }

  function updateFiles(selectedFiles: File[]) {
    setFiles(tool.multiple ? selectedFiles : selectedFiles.slice(0, 1));
    clearResultState();
  }

  function moveFile(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= files.length) return;
    const nextFiles = [...files];
    [nextFiles[index], nextFiles[nextIndex]] = [nextFiles[nextIndex], nextFiles[index]];
    setFiles(nextFiles);
    clearResultState();
  }

  function startOver() {
    clearResultState();
    setFiles([]);
    setPages([]);
    setOptions(
      Object.fromEntries((tool.options ?? []).map((option) => [option.id, option.defaultValue]))
    );
  }

  async function runJob() {
    setIsProcessing(true);
    setError(null);
    setResult(null);
    setProgress(20);

    try {
      const jobOptions = { ...options };
      if (tool.id === "organize-pdf") {
        jobOptions.pagePlan = JSON.stringify(pages.map(({ pageNumber, rotation, deleted }) => ({ pageNumber, rotation, deleted })));
      }

      setProgress(55);
      const processed = await processPdfJobInBrowser({ tool: tool.processorId, files, options: jobOptions });
      setProgress(88);
      const url = URL.createObjectURL(processed.blob);

      setResult({ url, fileName: processed.fileName });
      setProgress(100);
    } catch (jobError) {
      setProgress(0);
      setError(jobError instanceof Error ? jobError.message : "알 수 없는 오류가 발생했습니다.");
    } finally {
      setIsProcessing(false);
    }
  }

  const runButton = (
    <ToolRunButton
      canRun={canSubmit}
      isProcessing={isProcessing}
      actionLabel={actionLabel}
      onRun={runJob}
    />
  );

  return (
    <div className="tool-flow">
      <ToolPageLayout
        title={tool.name}
        description={tool.description}
        optionPanel={
          <ToolOptionPanel
            options={tool.options ?? []}
            values={options}
            fileCount={files.length}
            multiple={tool.multiple}
            canRun={canSubmit}
            isProcessing={isProcessing}
            actionLabel={actionLabel}
            onValueChange={(id, value) => {
              setOptions((current) => ({ ...current, [id]: value }));
              clearResultState();
            }}
            onRun={runJob}
          />
        }
        mobileAction={runButton}
      >
        <FileDropzone
          accept={tool.acceptedFileTypes.join(",")}
          multiple={tool.multiple}
          maxFiles={tool.maxFiles}
          files={files}
          onFilesSelected={updateFiles}
          showFileList={false}
          title={files.length > 0 && tool.multiple ? "파일 더 추가" : undefined}
        />

        {files.length > 0 ? (
          <section className="file-preview" aria-labelledby="file-preview-title">
            <div className="file-preview-heading">
              <div>
                <p className="eyebrow">파일 미리보기</p>
                <h2 id="file-preview-title">선택한 파일</h2>
              </div>
              <span>{files.length}개</span>
            </div>
            <ul className="uploaded-file-list dense-file-list">
              {files.map((file, index) => (
                <UploadedFileCard
                  key={`${file.name}-${file.size}-${file.lastModified}`}
                  file={file}
                  index={index}
                  onMoveUp={tool.multiple && index > 0 ? () => moveFile(index, -1) : undefined}
                  onMoveDown={tool.multiple && index < files.length - 1 ? () => moveFile(index, 1) : undefined}
                  onRemove={() => updateFiles(files.filter((_, fileIndex) => fileIndex !== index))}
                />
              ))}
            </ul>
          </section>
        ) : null}

        {tool.id === "organize-pdf" && pages.length > 0 ? (
          <PageOrganizer
            pages={pages}
            onChange={(nextPages) => {
              setPages(nextPages);
              clearResultState();
            }}
          />
        ) : null}

        {tool.id === "resave-pdf" && files.length > 0 ? (
          <p className="resave-explanation">
            업로드한 PDF의 페이지 내용을 새 PDF 파일로 다시 생성합니다. 모든 손상된 PDF의 복구를 보장하지 않습니다.
          </p>
        ) : null}

        {progress > 0 ? <ProcessingProgress value={progress} /> : null}
        {result ? <ResultCard url={result.url} fileName={result.fileName} onStartOver={startOver} /> : null}
        {error ? <ErrorState message={error} onRetry={canSubmit ? runJob : undefined} /> : null}
      </ToolPageLayout>

      <RelatedTools toolId={tool.id as ToolId} />
    </div>
  );
}

function getActionLabel(tool: ClientToolConfig, fileCount: number) {
  if (tool.id === "merge-pdf" && fileCount > 0) return `PDF ${fileCount}개 합치기`;
  return tool.primaryAction;
}

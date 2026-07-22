"use client";

import { useEffect, useMemo, useState } from "react";
import { ErrorState } from "@/components/ErrorState";
import { AnalyticsEvent } from "@/components/AnalyticsEvent";
import { FileDropzone } from "@/components/FileDropzone";
import { PageOrganizer, type OrganizedPage } from "@/components/PageOrganizer";
import { ProcessingProgress, type ProcessingStage } from "@/components/ProcessingProgress";
import { RelatedTools } from "@/components/RelatedTools";
import { ResultCard } from "@/components/ResultCard";
import { ToolOptionPanel, ToolRunButton } from "@/components/ToolOptionPanel";
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { UploadedFileCard } from "@/components/UploadedFileCard";
import type { ToolConfig, ToolId } from "@/config/tools";
import { processPdfJobInBrowser } from "@/lib/client/processPdfJob";
import { trackEvent } from "@/lib/analytics";

type ClientToolConfig = Omit<ToolConfig, "icon">;
type ResultState = { url: string; fileName: string };

export function ToolWorkspace({ tool }: { tool: ClientToolConfig }) {
  const [files, setFiles] = useState<File[]>([]);
  const [pages, setPages] = useState<OrganizedPage[]>([]);
  const [processingStage, setProcessingStage] = useState<ProcessingStage | null>(null);
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
        if (!cancelled) {
          setError("PDF 페이지 정보를 읽을 수 없습니다. 파일이 손상되었거나 암호화되었는지 확인해 주세요.");
          trackEvent("error_occurred", tool.id);
        }
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
    setProcessingStage(null);
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
    setProcessingStage("uploading");

    try {
      await waitForNextPaint();
      const jobOptions = { ...options };
      if (tool.id === "organize-pdf") {
        jobOptions.pagePlan = JSON.stringify(pages.map(({ pageNumber, rotation, deleted }) => ({ pageNumber, rotation, deleted })));
      }

      setProcessingStage("processing");
      await waitForNextPaint();
      const processed = await processPdfJobInBrowser({ tool: tool.processorId, files, options: jobOptions });
      setProcessingStage("preparing");
      await waitForNextPaint();
      const url = URL.createObjectURL(processed.blob);

      setResult({ url, fileName: processed.fileName });
      setProcessingStage("success");
      trackEvent("processing_succeeded", tool.id);
    } catch (jobError) {
      setProcessingStage(null);
      setError(getFriendlyProcessingError(jobError));
      trackEvent("error_occurred", tool.id);
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
      <AnalyticsEvent event="tool_opened" tool={tool.id} />
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
          onUploadStarted={() => trackEvent("upload_started", tool.id)}
          onUploadCompleted={() => trackEvent("upload_completed", tool.id)}
          onUploadError={() => trackEvent("error_occurred", tool.id)}
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

        {processingStage ? <ProcessingProgress stage={processingStage} /> : null}
        {result ? (
          <ResultCard
            url={result.url}
            fileName={result.fileName}
            onStartOver={startOver}
            onDownload={() => trackEvent("download_clicked", tool.id)}
          />
        ) : null}
        {error ? <ErrorState message={error} onRetry={canSubmit ? runJob : undefined} /> : null}
      </ToolPageLayout>

      {result ? <RelatedTools toolId={tool.id as ToolId} /> : null}
    </div>
  );
}

function waitForNextPaint() {
  return new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
}

function getActionLabel(tool: ClientToolConfig, fileCount: number) {
  if (tool.id === "merge-pdf" && fileCount > 0) return `PDF ${fileCount}개 합치기`;
  return tool.primaryAction;
}

function getFriendlyProcessingError(error: unknown) {
  if (!(error instanceof Error)) {
    return "파일을 처리하지 못했습니다. 원본 파일을 확인한 뒤 다시 시도해 주세요.";
  }

  const normalizedMessage = error.message.toLowerCase();
  if (normalizedMessage.includes("encrypted") || normalizedMessage.includes("password")) {
    return "암호로 보호된 PDF는 처리할 수 없습니다. 암호 보호를 해제한 파일로 다시 시도해 주세요.";
  }
  if (
    normalizedMessage.includes("invalid pdf") ||
    normalizedMessage.includes("failed to parse") ||
    normalizedMessage.includes("no pdf header")
  ) {
    return "유효한 PDF 파일을 읽을 수 없습니다. 파일이 손상되지 않았는지 확인해 주세요.";
  }
  if (normalizedMessage.includes("memory") || normalizedMessage.includes("allocation")) {
    return "기기 메모리가 부족해 작업을 완료하지 못했습니다. 더 작은 파일이나 더 적은 페이지로 다시 시도해 주세요.";
  }

  return error.message || "파일 처리 중 오류가 발생했습니다. 다시 시도해 주세요.";
}

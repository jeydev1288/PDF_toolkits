"use client";

import { FileCheck2, LockKeyhole, UploadCloud } from "lucide-react";
import { useRef, useState } from "react";
import { UploadedFileCard } from "@/components/UploadedFileCard";
import { MAX_FILE_BYTES, MAX_TOTAL_BYTES, formatMegabytes } from "@/config/site";

type FileDropzoneProps = {
  accept: string;
  multiple: boolean;
  files: File[];
  onFilesSelected: (files: File[]) => void;
  variant?: "default" | "compact";
  title?: string;
  description?: string;
  showFileList?: boolean;
  maxFiles: number;
  onUploadStarted?: () => void;
  onUploadCompleted?: () => void;
  onUploadError?: () => void;
};

export function FileDropzone({
  accept,
  multiple,
  files,
  onFilesSelected,
  variant = "default",
  title = "파일을 선택하거나 여기에 끌어다 놓으세요",
  description,
  showFileList = true,
  maxFiles,
  onUploadStarted,
  onUploadCompleted,
  onUploadError
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  function handleFiles(selectedFiles: File[]) {
    if (selectedFiles.length === 0) return;
    onUploadStarted?.();
    const acceptedFiles = selectedFiles.filter((file) => isAcceptedFile(file, accept));
    const nextFiles = multiple
      ? [...files, ...acceptedFiles].filter(
          (file, index, allFiles) =>
            allFiles.findIndex(
              (candidate) =>
                candidate.name === file.name &&
                candidate.size === file.size &&
                candidate.lastModified === file.lastModified
            ) === index
        )
      : acceptedFiles.slice(0, 1);

    const oversizedFile = acceptedFiles.find((file) => file.size > MAX_FILE_BYTES);
    if (oversizedFile) {
      setValidationError(`개별 파일은 ${formatMegabytes(MAX_FILE_BYTES)}까지 선택할 수 있습니다.`);
      onUploadError?.();
      return;
    }
    if (nextFiles.length > maxFiles) {
      setValidationError(`이 도구는 한 번에 최대 ${maxFiles}개 파일까지 처리할 수 있습니다.`);
      onUploadError?.();
      return;
    }
    const totalSize = nextFiles.reduce((total, file) => total + file.size, 0);
    if (totalSize > MAX_TOTAL_BYTES) {
      setValidationError(`한 작업의 전체 파일 크기는 ${formatMegabytes(MAX_TOTAL_BYTES)}까지입니다.`);
      onUploadError?.();
      return;
    }

    if (acceptedFiles.length !== selectedFiles.length) {
      setValidationError("지원하지 않는 형식의 파일은 제외되었습니다.");
      onUploadError?.();
    } else if (!multiple && acceptedFiles.length > 1) {
      setValidationError("이 작업에는 파일 하나만 선택할 수 있습니다.");
    } else {
      setValidationError(null);
    }

    onFilesSelected(nextFiles);
    if (acceptedFiles.length > 0) onUploadCompleted?.();
  }

  function removeFile(index: number) {
    onFilesSelected(files.filter((_, fileIndex) => fileIndex !== index));
  }

  return (
    <div className="file-dropzone-group">
      <div
        className={`dropzone${variant === "compact" ? " compact-dropzone" : ""}`}
        data-dragging={isDragging}
        role="group"
        aria-label="파일 업로드 영역"
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(event) => {
          if (event.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget)) return;
          setIsDragging(false);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          handleFiles(Array.from(event.dataTransfer.files));
        }}
      >
        <input
          ref={inputRef}
          className="sr-only"
          type="file"
          accept={accept}
          multiple={multiple}
          aria-label={title}
          onChange={(event) => {
            handleFiles(Array.from(event.target.files ?? []));
            event.currentTarget.value = "";
          }}
        />
        <span className="dropzone-content">
          <span className="dropzone-icon">
            <UploadCloud size={26} aria-hidden="true" />
          </span>
          <strong>{title}</strong>
          <span>{description ?? "파일을 놓거나 아래 버튼으로 기기에서 선택하세요."}</span>
          <button className="dropzone-button" type="button" onClick={() => inputRef.current?.click()}>
            <UploadCloud size={17} aria-hidden="true" />
            파일 선택하기
          </button>
          <span className="dropzone-meta" aria-label="파일 선택 조건">
            <span><FileCheck2 size={15} aria-hidden="true" />{getAcceptedFileDescription(accept)}</span>
            <span>파일당 {formatMegabytes(MAX_FILE_BYTES)}</span>
            <span>전체 {formatMegabytes(MAX_TOTAL_BYTES)}</span>
          </span>
          <small className="dropzone-privacy"><LockKeyhole size={14} aria-hidden="true" />파일은 서버로 전송되지 않습니다.</small>
        </span>
      </div>

      {validationError ? (
        <p className="dropzone-error" role="alert">
          {validationError}
        </p>
      ) : null}

      {showFileList && files.length > 0 ? (
        <ul className="uploaded-file-list" aria-label="선택한 파일">
          {files.map((file, index) => (
            <UploadedFileCard
              key={`${file.name}-${file.size}-${file.lastModified}`}
              file={file}
              onRemove={() => removeFile(index)}
            />
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function isAcceptedFile(file: File, accept: string) {
  const acceptedTypes = accept.split(",").map((type) => type.trim());

  return acceptedTypes.some((acceptedType) => {
    if (acceptedType.endsWith("/*")) {
      return file.type.startsWith(acceptedType.slice(0, -1));
    }

    if (file.type === acceptedType) return true;
    if (file.type) return false;

    const extension = file.name.toLowerCase().split(".").at(-1);
    return (
      (acceptedType === "application/pdf" && extension === "pdf") ||
      (acceptedType === "image/png" && extension === "png") ||
      (acceptedType === "image/jpeg" && (extension === "jpg" || extension === "jpeg"))
    );
  });
}

function getAcceptedFileDescription(accept: string) {
  const labels = accept.split(",").map((type) => {
    const normalizedType = type.trim();

    if (normalizedType === "application/pdf") return "PDF";
    if (normalizedType === "image/png") return "PNG";
    if (normalizedType === "image/jpeg") return "JPG";
    if (normalizedType.startsWith("image/")) return "이미지";
    return "파일";
  });

  return `${Array.from(new Set(labels)).join(", ")} 형식을 업로드할 수 있습니다.`;
}

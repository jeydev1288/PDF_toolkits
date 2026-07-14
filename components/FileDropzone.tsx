"use client";

import { UploadCloud } from "lucide-react";
import { useState } from "react";
import { UploadedFileCard } from "@/components/UploadedFileCard";

type FileDropzoneProps = {
  accept: string;
  multiple: boolean;
  files: File[];
  onFilesSelected: (files: File[]) => void;
  variant?: "default" | "compact";
  title?: string;
  description?: string;
  showFileList?: boolean;
};

const MAX_TOTAL_FILE_SIZE = 4 * 1024 * 1024;

export function FileDropzone({
  accept,
  multiple,
  files,
  onFilesSelected,
  variant = "default",
  title = "파일을 선택하거나 여기에 끌어다 놓으세요",
  description,
  showFileList = true
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  function handleFiles(selectedFiles: File[]) {
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

    const totalSize = nextFiles.reduce((total, file) => total + file.size, 0);
    if (totalSize > MAX_TOTAL_FILE_SIZE) {
      setValidationError("한 번에 업로드할 수 있는 전체 파일 크기는 4MB까지입니다.");
      return;
    }

    if (acceptedFiles.length !== selectedFiles.length) {
      setValidationError("지원하지 않는 형식의 파일은 제외되었습니다.");
    } else if (!multiple && acceptedFiles.length > 1) {
      setValidationError("이 작업에는 파일 하나만 선택할 수 있습니다.");
    } else {
      setValidationError(null);
    }

    onFilesSelected(nextFiles);
  }

  function removeFile(index: number) {
    onFilesSelected(files.filter((_, fileIndex) => fileIndex !== index));
  }

  return (
    <div className="file-dropzone-group">
      <label
        className={`dropzone${variant === "compact" ? " compact-dropzone" : ""}`}
        data-dragging={isDragging}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          handleFiles(Array.from(event.dataTransfer.files));
        }}
      >
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          aria-label={title}
          onChange={(event) => handleFiles(Array.from(event.target.files ?? []))}
        />
        <span className="dropzone-content">
          <span className="dropzone-icon">
            <UploadCloud size={26} aria-hidden="true" />
          </span>
          <strong>{title}</strong>
          <span>{description ?? `${getAcceptedFileDescription(accept)} · 최대 4MB`}</span>
          <span className="dropzone-button">파일 선택</span>
        </span>
      </label>

      {validationError ? (
        <p className="dropzone-error" role="alert">
          {validationError}
        </p>
      ) : null}

      {showFileList && files.length > 0 ? (
        <ul className="uploaded-file-list" aria-label="선택한 파일">
          {files.map((file, index) => (
            <UploadedFileCard
              key={`${file.name}-${file.size}-${index}`}
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

    return file.type === acceptedType;
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

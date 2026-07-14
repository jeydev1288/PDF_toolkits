import { ArrowDown, ArrowUp, FileText, X } from "lucide-react";

type UploadedFileCardProps = {
  file: File;
  index?: number;
  onRemove?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
};

export function UploadedFileCard({
  file,
  index,
  onRemove,
  onMoveUp,
  onMoveDown
}: UploadedFileCardProps) {
  return (
    <li className="uploaded-file-card">
      <span className="uploaded-file-index">{index !== undefined ? index + 1 : null}</span>
      <span className="uploaded-file-icon">
        <FileText size={19} aria-hidden="true" />
      </span>
      <span className="uploaded-file-copy">
        <strong>{file.name}</strong>
        <small>{formatFileSize(file.size)}</small>
      </span>
      <span className="file-row-actions">
        {onMoveUp ? (
          <button type="button" onClick={onMoveUp} aria-label={`${file.name} 위로 이동`} title="위로 이동">
            <ArrowUp size={17} aria-hidden="true" />
          </button>
        ) : null}
        {onMoveDown ? (
          <button type="button" onClick={onMoveDown} aria-label={`${file.name} 아래로 이동`} title="아래로 이동">
            <ArrowDown size={17} aria-hidden="true" />
          </button>
        ) : null}
        {onRemove ? (
          <button type="button" onClick={onRemove} aria-label={`${file.name} 제거`} title="파일 제거">
            <X size={18} aria-hidden="true" />
          </button>
        ) : null}
      </span>
    </li>
  );
}

function formatFileSize(size: number) {
  if (size < 1024 * 1024) return `${Math.max(1, Math.ceil(size / 1024))} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

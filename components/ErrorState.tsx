import { AlertCircle, RotateCcw } from "lucide-react";

type ErrorStateProps = {
  message: string;
  onRetry?: () => void;
};

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="error-state" role="alert">
      <AlertCircle size={21} aria-hidden="true" />
      <span>
        <strong>작업을 완료하지 못했습니다</strong>
        <small>{message}</small>
      </span>
      {onRetry ? (
        <button type="button" onClick={onRetry}>
          <RotateCcw size={17} aria-hidden="true" />
          다시 시도
        </button>
      ) : null}
    </div>
  );
}

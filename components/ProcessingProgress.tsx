type ProcessingProgressProps = {
  value: number;
  label?: string;
};

export function ProcessingProgress({
  value,
  label = "PDF 처리 중"
}: ProcessingProgressProps) {
  const safeValue = Math.min(100, Math.max(0, value));

  return (
    <div className="processing-progress" role="status" aria-live="polite">
      <div>
        <strong>{safeValue === 100 ? "처리가 완료되었습니다" : label}</strong>
        <span>{safeValue}%</span>
      </div>
      <div
        className="progress-track"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={safeValue}
      >
        <div className="progress-bar" style={{ width: `${safeValue}%` }} />
      </div>
    </div>
  );
}

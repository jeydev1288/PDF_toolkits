import { CheckCircle2, Download, RotateCcw } from "lucide-react";

type ResultCardProps = {
  url: string;
  fileName: string;
  onStartOver?: () => void;
};

export function ResultCard({ url, fileName, onStartOver }: ResultCardProps) {
  return (
    <section className="result-card" aria-labelledby="result-title">
      <span className="result-icon">
        <CheckCircle2 size={22} aria-hidden="true" />
      </span>
      <span className="result-copy">
        <strong id="result-title">결과 파일이 준비되었습니다</strong>
        <small>{fileName}</small>
      </span>
      <span className="result-actions">
        {onStartOver ? (
          <button type="button" className="secondary-button" onClick={onStartOver}>
            <RotateCcw size={17} aria-hidden="true" />
            다시 시작
          </button>
        ) : null}
        <a className="result-download" href={url} download={fileName}>
          <Download size={18} aria-hidden="true" />
          다운로드
        </a>
      </span>
    </section>
  );
}

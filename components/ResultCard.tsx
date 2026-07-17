import { CheckCircle2, Download, RotateCcw } from "lucide-react";

type ResultCardProps = {
  url: string;
  fileName: string;
  onStartOver?: () => void;
  onDownload?: () => void;
};

export function ResultCard({ url, fileName, onStartOver, onDownload }: ResultCardProps) {
  return (
    <section className="result-card" aria-labelledby="result-title">
      <span className="result-icon">
        <CheckCircle2 size={30} aria-hidden="true" />
      </span>
      <span className="result-copy">
        <strong id="result-title">완료! 결과 파일이 준비되었습니다</strong>
        <small>{fileName} · 파일은 서버에 저장되지 않았습니다.</small>
      </span>
      <span className="result-actions">
        {onStartOver ? (
          <button type="button" className="secondary-button" onClick={onStartOver}>
            <RotateCcw size={17} aria-hidden="true" />
            다른 파일 처리
          </button>
        ) : null}
        <a className="result-download" href={url} download={fileName} onClick={onDownload} aria-label={`${fileName} 다운로드`}>
          <Download size={18} aria-hidden="true" />
          다운로드
        </a>
      </span>
    </section>
  );
}

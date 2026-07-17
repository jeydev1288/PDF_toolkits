import { CheckCircle2, Download, FileUp, LoaderCircle } from "lucide-react";

export type ProcessingStage = "uploading" | "processing" | "preparing" | "success";

const stageContent: Record<ProcessingStage, { title: string; description: string; value: number; icon: typeof FileUp }> = {
  uploading: { title: "파일을 불러오는 중", description: "선택한 파일을 브라우저에서 안전하게 읽고 있습니다.", value: 20, icon: FileUp },
  processing: { title: "PDF를 처리하는 중", description: "이 작업은 기기 안에서 실행됩니다. 잠시만 기다려 주세요.", value: 58, icon: LoaderCircle },
  preparing: { title: "다운로드를 준비하는 중", description: "결과 파일을 만들고 다운로드 링크를 준비하고 있습니다.", value: 88, icon: Download },
  success: { title: "작업이 완료되었습니다", description: "결과 파일을 다운로드할 수 있습니다.", value: 100, icon: CheckCircle2 }
};

export function ProcessingProgress({ stage }: { stage: ProcessingStage }) {
  const content = stageContent[stage];
  const Icon = content.icon;

  return (
    <div className="processing-progress" role="status" aria-live="polite" aria-atomic="true">
      <span className={`processing-stage-icon${stage === "processing" ? " is-spinning" : ""}`}><Icon size={20} aria-hidden="true" /></span>
      <div className="processing-stage-copy">
        <strong>{content.title}</strong>
        <small>{content.description}</small>
      </div>
      <span className="processing-percent">{content.value}%</span>
      <div
        className="progress-track"
        role="progressbar"
        aria-label={content.title}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={content.value}
      >
        <div className="progress-bar" style={{ width: `${content.value}%` }} />
      </div>
    </div>
  );
}

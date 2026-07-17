import { Download, FileUp, WandSparkles } from "lucide-react";

const steps = [
  { icon: FileUp, label: "Upload", description: "파일 선택" },
  { icon: WandSparkles, label: "Process", description: "브라우저 처리" },
  { icon: Download, label: "Download", description: "결과 다운로드" }
];

export function WorkflowSteps() {
  return (
    <ol className="workflow-steps" aria-label="PDF 작업 3단계">
      {steps.map(({ icon: Icon, label, description }, index) => (
        <li key={label}>
          <span className="workflow-step-number">{index + 1}</span>
          <span className="workflow-step-icon"><Icon size={20} aria-hidden="true" /></span>
          <span><strong>{label}</strong><small>{description}</small></span>
        </li>
      ))}
    </ol>
  );
}

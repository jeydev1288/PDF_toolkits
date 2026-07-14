import { Play } from "lucide-react";
import type { ToolOption } from "@/config/tools";

type ToolOptionPanelProps = {
  options: ToolOption[];
  values: Record<string, string>;
  fileCount: number;
  multiple: boolean;
  canRun: boolean;
  isProcessing: boolean;
  actionLabel: string;
  onValueChange: (id: string, value: string) => void;
  onRun: () => void;
};

export function ToolOptionPanel({
  options,
  values,
  fileCount,
  multiple,
  canRun,
  isProcessing,
  actionLabel,
  onValueChange,
  onRun
}: ToolOptionPanelProps) {
  return (
    <div className="tool-option-panel">
      <div className="option-panel-heading">
        <p className="eyebrow">작업 설정</p>
        <h2>옵션</h2>
      </div>

      <div className="action-summary">
        <strong>{fileCount > 0 ? `${fileCount}개 파일 선택됨` : "파일 선택 대기 중"}</strong>
        <span>
          {multiple ? "파일 목록의 순서대로 처리합니다." : "PDF 파일 하나를 선택해 주세요."}
        </span>
      </div>

      {options.map((option) => (
        <div className="field" key={option.id}>
          <label htmlFor={option.id}>{option.label}</label>
          {option.type === "select" ? (
            <select
              id={option.id}
              value={values[option.id]}
              onChange={(event) => onValueChange(option.id, event.target.value)}
            >
              {(option.values ?? []).map((value) => (
                <option key={value.value} value={value.value}>
                  {value.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              id={option.id}
              type={option.type}
              value={values[option.id]}
              placeholder={option.id === "pageRange" ? "1-3, 5, 8-10" : undefined}
              onChange={(event) => onValueChange(option.id, event.target.value)}
            />
          )}
          {option.helper ? <small className="field-helper">{option.helper}</small> : null}
        </div>
      ))}

      <ToolRunButton
        canRun={canRun}
        isProcessing={isProcessing}
        actionLabel={actionLabel}
        onRun={onRun}
      />
    </div>
  );
}

export function ToolRunButton({
  canRun,
  isProcessing,
  actionLabel,
  onRun
}: {
  canRun: boolean;
  isProcessing: boolean;
  actionLabel: string;
  onRun: () => void;
}) {
  return (
    <button className="button tool-run-button" disabled={!canRun} onClick={onRun} type="button">
      <Play size={18} aria-hidden="true" />
      {isProcessing ? "처리 중..." : actionLabel}
    </button>
  );
}

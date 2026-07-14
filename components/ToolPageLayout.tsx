import type { ReactNode } from "react";

type ToolPageLayoutProps = {
  title: string;
  description: string;
  children: ReactNode;
  optionPanel: ReactNode;
  mobileAction?: ReactNode;
};

export function ToolPageLayout({
  title,
  description,
  children,
  optionPanel,
  mobileAction
}: ToolPageLayoutProps) {
  return (
    <div className="tool-page-layout">
      <section className="tool-workspace-panel" aria-labelledby="tool-page-title">
        <header className="tool-page-heading">
          <p className="eyebrow">PDF 도구</p>
          <h1 id="tool-page-title">{title}</h1>
          <p>{description}</p>
        </header>
        <div className="tool-workspace-content">{children}</div>
      </section>

      <aside className="tool-options-column" aria-label="작업 옵션">
        {optionPanel}
      </aside>

      {mobileAction ? <div className="mobile-tool-action">{mobileAction}</div> : null}
    </div>
  );
}

import type { ReactNode } from "react";

export function InfoPage({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children: ReactNode }) {
  return <article className="info-page"><header><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{intro}</p><small>최종 업데이트: 2026년 7월 22일</small></header><div className="info-content">{children}</div></article>;
}

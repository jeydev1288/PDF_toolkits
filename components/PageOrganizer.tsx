import {
  ArrowLeft,
  ArrowRight,
  CheckSquare,
  FileText,
  RotateCw,
  Trash2
} from "lucide-react";

export type OrganizedPage = {
  pageNumber: number;
  rotation: number;
  selected: boolean;
  deleted: boolean;
};

type PageOrganizerProps = {
  pages: OrganizedPage[];
  onChange: (pages: OrganizedPage[]) => void;
};

export function PageOrganizer({ pages, onChange }: PageOrganizerProps) {
  const activePages = pages.filter((page) => !page.deleted);
  const selectedCount = activePages.filter((page) => page.selected).length;

  function updatePage(pageNumber: number, update: Partial<OrganizedPage>) {
    onChange(
      pages.map((page) => (page.pageNumber === pageNumber ? { ...page, ...update } : page))
    );
  }

  function movePage(pageNumber: number, direction: -1 | 1) {
    const currentIndex = pages.findIndex((page) => page.pageNumber === pageNumber);
    const nextIndex = currentIndex + direction;
    if (currentIndex < 0 || nextIndex < 0 || nextIndex >= pages.length) return;

    const nextPages = [...pages];
    [nextPages[currentIndex], nextPages[nextIndex]] = [
      nextPages[nextIndex],
      nextPages[currentIndex]
    ];
    onChange(nextPages);
  }

  function updateSelected(action: "rotate" | "delete") {
    onChange(
      pages.map((page) => {
        if (!page.selected || page.deleted) return page;
        if (action === "delete") return { ...page, deleted: true, selected: false };
        return { ...page, rotation: (page.rotation + 90) % 360 };
      })
    );
  }

  return (
    <section className="page-organizer" aria-labelledby="page-organizer-title">
      <div className="file-preview-heading">
        <div>
          <p className="eyebrow">페이지 미리보기</p>
          <h2 id="page-organizer-title">페이지 정리</h2>
        </div>
        <span>{activePages.length}페이지</span>
      </div>

      <div className="organizer-toolbar">
        <button type="button" disabled={selectedCount === 0} onClick={() => updateSelected("rotate")}>
          <RotateCw size={17} aria-hidden="true" /> 선택 회전
        </button>
        <button type="button" disabled={selectedCount === 0} onClick={() => updateSelected("delete")}>
          <Trash2 size={17} aria-hidden="true" /> 선택 삭제
        </button>
        <span>{selectedCount}개 선택</span>
      </div>

      <div className="page-thumbnail-grid">
        {pages.map((page, index) =>
          page.deleted ? null : (
            <article className={`page-thumbnail${page.selected ? " is-selected" : ""}`} key={page.pageNumber}>
              <button
                type="button"
                className="page-select-button"
                onClick={() => updatePage(page.pageNumber, { selected: !page.selected })}
                aria-pressed={page.selected}
                aria-label={`${page.pageNumber}페이지 선택`}
              >
                <CheckSquare size={17} aria-hidden="true" />
              </button>
              <div className="page-paper" style={{ transform: `rotate(${page.rotation}deg)` }}>
                <FileText size={28} aria-hidden="true" />
                <span>{page.pageNumber}</span>
              </div>
              <strong>{page.pageNumber}페이지</strong>
              <div className="page-actions">
                <button type="button" onClick={() => movePage(page.pageNumber, -1)} disabled={index === 0} title="왼쪽으로 이동">
                  <ArrowLeft size={16} aria-hidden="true" />
                </button>
                <button type="button" onClick={() => movePage(page.pageNumber, 1)} disabled={index === pages.length - 1} title="오른쪽으로 이동">
                  <ArrowRight size={16} aria-hidden="true" />
                </button>
                <button type="button" onClick={() => updatePage(page.pageNumber, { rotation: (page.rotation + 90) % 360 })} title="회전">
                  <RotateCw size={16} aria-hidden="true" />
                </button>
                <button type="button" onClick={() => updatePage(page.pageNumber, { deleted: true, selected: false })} title="삭제">
                  <Trash2 size={16} aria-hidden="true" />
                </button>
              </div>
            </article>
          )
        )}
      </div>
    </section>
  );
}

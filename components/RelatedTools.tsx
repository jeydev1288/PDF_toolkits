import { ToolCard } from "@/components/ToolCard";
import { getRelatedTools, type ToolId } from "@/config/tools";

export function RelatedTools({ toolId }: { toolId: ToolId }) {
  const relatedTools = getRelatedTools(toolId);

  return (
    <section className="related-tools" aria-labelledby="related-tools-title">
      <div className="compact-section-heading">
        <div>
          <p className="eyebrow">다음 작업</p>
          <h2 id="related-tools-title">관련 도구</h2>
        </div>
      </div>
      <div className="tool-grid">
        {relatedTools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </section>
  );
}

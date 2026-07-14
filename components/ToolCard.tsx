import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ToolConfig } from "@/config/tools";

export function ToolCard({ tool }: { tool: ToolConfig }) {
  const Icon = tool.icon;

  return (
    <Link className="tool-card" href={tool.route}>
      <span className="tool-card-topline">
        <span className="tool-icon">
          <Icon size={21} aria-hidden="true" />
        </span>
        <ArrowRight size={18} aria-hidden="true" />
      </span>
      <span>
        <h3>{tool.name}</h3>
        <p>{tool.description}</p>
      </span>
    </Link>
  );
}

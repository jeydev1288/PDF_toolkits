import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { ToolWorkspace } from "./tool-workspace";
import { getToolByRouteSegment, tools } from "@/config/tools";

export function generateStaticParams() {
  return tools.map((tool) => ({ tool: tool.route.split("/").at(-1) }));
}

export async function generateMetadata({ params }: { params: Promise<{ tool: string }> }): Promise<Metadata> {
  const { tool: toolId } = await params;
  const tool = getToolByRouteSegment(toolId);
  if (!tool) return {};
  return {
    title: tool.seoTitle,
    description: tool.seoDescription,
    alternates: { canonical: tool.route },
    openGraph: { title: tool.seoTitle, description: tool.seoDescription, url: tool.route, type: "website" }
  };
}

export default async function ToolPage({
  params
}: {
  params: Promise<{ tool: string }>;
}) {
  const { tool: toolId } = await params;
  const tool = getToolByRouteSegment(toolId);

  if (!tool) {
    notFound();
  }

  const { icon: _icon, ...serializableTool } = tool;

  return (
    <AppShell>
      <ToolWorkspace tool={serializableTool} />
    </AppShell>
  );
}

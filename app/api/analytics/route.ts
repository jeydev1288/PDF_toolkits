import { NextResponse } from "next/server";
import { tools, type ToolId } from "@/config/tools";
import type { AnalyticsEventName } from "@/lib/analytics";

const eventNames = new Set<AnalyticsEventName>([
  "homepage_viewed",
  "tool_opened",
  "upload_started",
  "upload_completed",
  "processing_succeeded",
  "download_clicked",
  "error_occurred"
]);
const toolIds = new Set<ToolId>(tools.map((tool) => tool.id));

export async function POST(request: Request) {
  if (Number(request.headers.get("content-length") ?? 0) > 256) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }
  try {
    const body = (await request.json()) as { event?: string; tool?: string };
    if (!body.event || !eventNames.has(body.event as AnalyticsEventName)) {
      return NextResponse.json({ error: "Invalid event" }, { status: 400 });
    }
    if (body.tool && !toolIds.has(body.tool as ToolId)) {
      return NextResponse.json({ error: "Invalid tool" }, { status: 400 });
    }

    console.info("[product-event]", {
      event: body.event,
      tool: body.tool ?? null,
      occurredAt: new Date().toISOString()
    });
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}

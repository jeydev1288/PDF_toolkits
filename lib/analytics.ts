import type { ToolId } from "@/config/tools";

export type AnalyticsEventName =
  | "homepage_viewed"
  | "tool_opened"
  | "upload_started"
  | "upload_completed"
  | "processing_succeeded"
  | "download_clicked"
  | "error_occurred";

type AnalyticsPayload = {
  event: AnalyticsEventName;
  tool?: ToolId;
};

export function trackEvent(event: AnalyticsEventName, tool?: ToolId) {
  if (typeof window === "undefined") return;

  const payload: AnalyticsPayload = tool ? { event, tool } : { event };
  const body = JSON.stringify(payload);

  window.dispatchEvent(new CustomEvent("pdf-toolkit:analytics", { detail: payload }));

  // The static desktop bundle has no Next.js server runtime. Keep local events
  // available to the UI, but never attempt a request to a non-existent API.
  if ("__TAURI_INTERNALS__" in window) return;

  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/analytics", new Blob([body], { type: "application/json" }));
    return;
  }

  void fetch("/api/analytics", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
    keepalive: true
  }).catch(() => undefined);
}

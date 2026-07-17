"use client";

import { useEffect } from "react";
import type { ToolId } from "@/config/tools";
import { trackEvent, type AnalyticsEventName } from "@/lib/analytics";

export function AnalyticsEvent({ event, tool }: { event: AnalyticsEventName; tool?: ToolId }) {
  useEffect(() => {
    trackEvent(event, tool);
  }, [event, tool]);

  return null;
}

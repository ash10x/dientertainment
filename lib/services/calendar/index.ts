// lib/services/calendar/index.ts
import type { CalendarProvider } from "./types";
import { InternalCalendarProvider } from "./internal.provider";

let _provider: CalendarProvider | null = null;

export function getCalendarProvider(): CalendarProvider {
  if (!_provider) {
    // Future: read site_settings "calendar_provider" key and switch
    // e.g. "google" → new GoogleCalendarProvider()
    // For now: always use internal
    _provider = new InternalCalendarProvider();
  }
  return _provider;
}

export type { CalendarProvider, CalendarEvent } from "./types";

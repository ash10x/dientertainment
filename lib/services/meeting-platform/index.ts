// lib/services/meeting-platform/index.ts
import type { MeetingPlatformProvider } from "./types";
import { CustomMeetingPlatformProvider } from "./custom.provider";

let _provider: MeetingPlatformProvider | null = null;

export function getMeetingPlatformProvider(): MeetingPlatformProvider {
  if (!_provider) {
    // Future: read site_settings "meeting_platform" key and switch
    // e.g. "zoom" → new ZoomMeetingProvider()
    _provider = new CustomMeetingPlatformProvider();
  }
  return _provider;
}

export type { MeetingPlatformProvider, MeetingLink } from "./types";

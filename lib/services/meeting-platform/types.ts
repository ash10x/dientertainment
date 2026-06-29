// lib/services/meeting-platform/types.ts
export interface MeetingLink {
  url: string;
  id: string;
  provider: string;
  accessDetails?: string;
}

export interface MeetingPlatformProvider {
  readonly name: string;
  generateLink(context: {
    title: string;
    start: Date;
    end: Date;
    hostEmail?: string;
  }): Promise<MeetingLink>;
}

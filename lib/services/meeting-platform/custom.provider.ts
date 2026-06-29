// lib/services/meeting-platform/custom.provider.ts
import type { MeetingPlatformProvider, MeetingLink } from "./types";
import { db } from "@/lib/db";
import { siteSettings } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export class CustomMeetingPlatformProvider implements MeetingPlatformProvider {
  readonly name = "custom";

  async generateLink(context: {
    title: string;
    start: Date;
    end: Date;
  }): Promise<MeetingLink> {
    // Read the configured meeting room URL from site_settings
    const [row] = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.key, "default_meeting_url"))
      .limit(1);

    const url = row?.value ?? "";

    return {
      url,
      id: nanoid(10),
      provider: "custom",
    };
  }
}

import { db } from "./db";
import { activityLogs } from "./schema";

export type LogType =
  | "contact"
  | "booking"
  | "meeting"
  | "work"
  | "service"
  | "package"
  | "testimonial"
  | "stat"
  | "hero"
  | "nav"
  | "user"
  | "setting"
  | "submission";

export async function logActivity(
  type: LogType,
  description: string,
  meta?: Record<string, unknown>,
  ip?: string | null
) {
  try {
    await db.insert(activityLogs).values({
      type,
      description,
      meta: meta ? JSON.stringify(meta) : null,
      ip: ip ?? null,
      read: false,
    });
  } catch {
    // Never let logging break the main request
  }
}

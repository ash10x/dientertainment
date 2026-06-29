# Scheduling System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extend the existing booking form with a production-ready post-submission meeting scheduling system — inline step transition (no reload), internal availability engine, admin meetings dashboard, and extended email notifications.

**Architecture:** After a successful booking form submission the API returns a `submissionId` + `bookingRef`; the form transitions through three states — `form → scheduling → confirmed` — all rendered inline without navigation. An internal availability engine reads per-weekday rules from the DB, subtracts existing meetings and blackout dates, and returns available time slots. Calendar/meeting-platform logic lives behind provider interfaces so OAuth integrations (Google, Zoom, etc.) can be plugged in later without touching business logic.

**Tech Stack:** Next.js 16 App Router · React 19 · TypeScript · Tailwind v4 · Drizzle ORM · NeonDB · nodemailer (SMTP) · Zod (new) · date-fns + date-fns-tz (new) · jose (existing)

## Global Constraints

- Keep every file under 500 lines (CLAUDE.md rule)
- Never create docs unless explicitly requested — plan is the only exception
- Read each file before editing it (already done in this session)
- Tailwind v4 — no config file; use existing tokens: `text-red`, `text-brand-white`, `bg-brand-black`, `font-display`, `font-bebas`
- Brand colors: Red `#E50019` (css class `text-red` / `bg-red`), White (`text-brand-white`), Black `#080808`
- All API responses: `Response.json({ error: "…" }, { status: 4xx })` or `Response.json({ success: true, data: … }, { status: 2xx })`
- Use `checkRateLimit()` from `lib/rate-limit.ts` on all public POST routes
- Use `logActivity()` from `lib/logger.ts` (never insert into activityLogs directly)
- Admin routes are protected by `middleware.ts` (JWT cookie `admin-token`) — no extra auth needed per route unless defense-in-depth
- Drizzle schema changes → run `npm run db:push` to sync NeonDB
- No `console.log` in production code
- pnpm is the package manager (lockfile exists)

---

## File Map

### New files
| File | Responsibility |
|------|---------------|
| `types/meeting.ts` | Domain types: MeetingType, MeetingStatus, BookingStatus, AvailableSlot, etc. |
| `lib/validators/booking.ts` | Zod schema for POST /api/contact |
| `lib/validators/meeting.ts` | Zod schema for POST /api/meetings, PATCH /api/meetings/[id] |
| `lib/services/availability.service.ts` | Computes available time slots from DB rules and existing meetings |
| `lib/services/ics.service.ts` | Generates RFC 5545 ICS calendar file content |
| `lib/services/meeting.service.ts` | Creates/updates meetings, generates bookingRef |
| `lib/services/calendar/types.ts` | CalendarProvider interface |
| `lib/services/calendar/internal.provider.ts` | No-op / internal availability provider |
| `lib/services/calendar/index.ts` | Provider factory (returns internal by default) |
| `lib/services/meeting-platform/types.ts` | MeetingPlatformProvider interface |
| `lib/services/meeting-platform/custom.provider.ts` | Custom URL provider (reads from site_settings) |
| `lib/services/meeting-platform/index.ts` | Platform factory |
| `app/api/availability/route.ts` | GET /api/availability?date=&duration=&timezone= |
| `app/api/meetings/route.ts` | POST /api/meetings |
| `app/api/meetings/[id]/route.ts` | PATCH /api/meetings/[id], DELETE /api/meetings/[id] |
| `app/api/meetings/[id]/ics/route.ts` | GET /api/meetings/[id]/ics → downloads .ics file |
| `app/api/admin/meetings/route.ts` | GET /api/admin/meetings (list + stats) |
| `app/api/admin/meetings/[id]/route.ts` | PATCH /api/admin/meetings/[id] |
| `app/api/admin/availability/route.ts` | GET/PUT /api/admin/availability |
| `app/components/SchedulerStep.tsx` | Post-booking scheduler UI (meeting type, duration, TZ, calendar, slots) |
| `app/components/CalendarPicker.tsx` | Month-view calendar grid with date selection |
| `app/components/TimeSlotGrid.tsx` | Grid of available time slot buttons |
| `app/components/ConfirmationStep.tsx` | Meeting confirmed screen with ICS/calendar links |
| `app/admin/(dashboard)/meetings/page.tsx` | Server component wrapper for meetings admin page |
| `app/admin/(dashboard)/meetings/MeetingsManager.tsx` | Client component: list, filter, update meetings |
| `app/admin/(dashboard)/availability/page.tsx` | Server component wrapper for availability admin page |
| `app/admin/(dashboard)/availability/AvailabilityManager.tsx` | Client component: configure working hours + blackout dates |

### Modified files
| File | Change |
|------|--------|
| `lib/schema.ts` | Add: `meetings`, `availabilityRules`, `blackoutDates`, `bookingStatusHistory`; extend `contactSubmissions` with `submissionRef`, `bookingStatus`, `timezone`, `referralSource` |
| `lib/logger.ts` | Add `"meeting"` to `LogType` |
| `lib/email.ts` | Add `sendBookingConfirmation()` and `sendMeetingConfirmation()` functions |
| `app/api/contact/route.ts` | Add Zod validation, honeypot, duplicate check, generate `submissionRef`, set `bookingStatus`, return `{ submissionId, bookingRef }` |
| `app/packages/[slug]/BookingForm.tsx` | Add `"scheduling"` and `"confirmed"` states that render `<SchedulerStep>` and `<ConfirmationStep>` |
| `app/components/ContactForm.tsx` | Same scheduler step integration |
| `app/admin/components/AdminSidebar.tsx` | Add "Meetings" and "Availability" links to Engagement group |
| `app/admin/(dashboard)/page.tsx` | Add meetings count to stat cards |

---

## Task 1: Dependencies + Schema Extension

**Files:**
- Modify: `lib/schema.ts`
- Modify: `lib/logger.ts`
- Create: `types/meeting.ts`

**Interfaces produced (used by every subsequent task):**
- `BookingStatus`, `MeetingType`, `MeetingStatus`, `MeetingProvider` (literal union types)
- `AvailableSlot { start: string; end: string; startLocal: string; endLocal: string }`
- Schema tables: `meetings`, `availabilityRules`, `blackoutDates`, `bookingStatusHistory`

- [ ] **Step 1: Install new dependencies**

```bash
cd "c:/Users/Rodique Orlandi/Desktop/Web Development/nextjs-project/dientertainment"
pnpm add zod date-fns date-fns-tz
pnpm add -D @types/date-fns
```

Expected output: packages added to package.json and pnpm-lock.yaml.

- [ ] **Step 2: Create `types/meeting.ts`**

```typescript
// types/meeting.ts
export type BookingStatus =
  | "pending"
  | "pending-scheduling"
  | "scheduled"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no-show";

export type MeetingType =
  | "discovery-call"
  | "consultation"
  | "strategy-session"
  | "project-discussion"
  | "website-review"
  | "follow-up";

export type MeetingStatus =
  | "scheduled"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no-show";

export type MeetingProvider =
  | "google-meet"
  | "zoom"
  | "teams"
  | "ringcentral"
  | "custom";

export const MEETING_TYPE_LABELS: Record<MeetingType, string> = {
  "discovery-call": "Discovery Call",
  consultation: "Consultation",
  "strategy-session": "Strategy Session",
  "project-discussion": "Project Discussion",
  "website-review": "Website Review",
  "follow-up": "Follow-up Meeting",
};

export const MEETING_STATUS_LABELS: Record<MeetingStatus, string> = {
  scheduled: "Scheduled",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
  "no-show": "No Show",
};

export const DURATION_OPTIONS = [15, 30, 45, 60] as const;
export type DurationMinutes = (typeof DURATION_OPTIONS)[number];

export interface AvailableSlot {
  start: string;     // ISO UTC string, e.g. "2024-01-15T14:00:00.000Z"
  end: string;       // ISO UTC string
  startLocal: string; // display string in user's timezone, e.g. "9:00 AM"
  endLocal: string;
}

export interface MeetingConfirmation {
  id: number;
  bookingRef: string;
  meetingDate: string;  // ISO UTC
  meetingEndDate: string; // ISO UTC
  timezone: string;
  durationMinutes: number;
  meetingType: MeetingType;
  meetingUrl: string | null;
  meetingProvider: MeetingProvider;
}
```

- [ ] **Step 3: Extend `lib/schema.ts`**

Read the file first (already done), then add to the END of `lib/schema.ts`:

```typescript
// ── NEW: Scheduling System Tables ──────────────────────────────────────

export const meetings = pgTable("meetings", {
  id: serial("id").primaryKey(),
  submissionId: integer("submission_id")
    .notNull()
    .references(() => contactSubmissions.id),
  bookingRef: text("booking_ref").notNull().unique(),
  meetingDate: timestamp("meeting_date", { withTimezone: true }).notNull(),
  meetingEndDate: timestamp("meeting_end_date", { withTimezone: true }).notNull(),
  timezone: text("timezone").notNull().default("America/New_York"),
  durationMinutes: integer("duration_minutes").notNull().default(30),
  meetingType: text("meeting_type").notNull(),
  status: text("status").notNull().default("scheduled"),
  meetingUrl: text("meeting_url"),
  meetingPlatformId: text("meeting_platform_id"),
  meetingProvider: text("meeting_provider").notNull().default("custom"),
  assignedTo: text("assigned_to"),
  notes: text("notes"),
  cancelReason: text("cancel_reason"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Mon–Fri working hours (dayOfWeek: 0=Sun, 1=Mon … 6=Sat)
export const availabilityRules = pgTable("availability_rules", {
  id: serial("id").primaryKey(),
  dayOfWeek: integer("day_of_week").notNull(),
  startTime: text("start_time").notNull().default("09:00"),
  endTime: text("end_time").notNull().default("17:00"),
  breakStart: text("break_start").default("12:00"),
  breakEnd: text("break_end").default("13:00"),
  isActive: boolean("is_active").notNull().default(true),
});

export const blackoutDates = pgTable("blackout_dates", {
  id: serial("id").primaryKey(),
  date: text("date").notNull(), // "YYYY-MM-DD"
  reason: text("reason"),
});

export const bookingStatusHistory = pgTable("booking_status_history", {
  id: serial("id").primaryKey(),
  submissionId: integer("submission_id")
    .notNull()
    .references(() => contactSubmissions.id),
  fromStatus: text("from_status"),
  toStatus: text("to_status").notNull(),
  changedBy: text("changed_by"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
```

Also add four columns to the `contactSubmissions` table definition (add after the existing `createdAt` line):

```typescript
  submissionRef: text("submission_ref").unique(),       // DI-YYYYMMDD-XXXXXX
  bookingStatus: text("booking_status").default("pending-scheduling"),
  timezone: text("timezone"),
  referralSource: text("referral_source"),
```

- [ ] **Step 4: Add "meeting" to `LogType` in `lib/logger.ts`**

In `lib/logger.ts`, locate the `LogType` union and add `"meeting"`:

```typescript
export type LogType =
  | "contact"
  | "booking"
  | "meeting"    // ← add this
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
```

- [ ] **Step 5: Sync DB schema**

```bash
npm run db:push
```

Expected: Drizzle prints the new columns and tables being created, then "Migration applied".

- [ ] **Step 6: Seed default availability rules (Mon–Fri, 9–5)**

Create a one-time seed script at `lib/seed-availability.ts`:

```typescript
import { db } from "./db";
import { availabilityRules } from "./schema";
import "dotenv/config";

async function seed() {
  // Mon=1, Tue=2, Wed=3, Thu=4, Fri=5
  const workdays = [1, 2, 3, 4, 5];
  await db.insert(availabilityRules).values(
    workdays.map((d) => ({
      dayOfWeek: d,
      startTime: "09:00",
      endTime: "17:00",
      breakStart: "12:00",
      breakEnd: "13:00",
      isActive: true,
    }))
  );
  console.log("Availability rules seeded.");
  process.exit(0);
}

seed().catch((e) => { console.error(e); process.exit(1); });
```

Run it:
```bash
npx tsx lib/seed-availability.ts
```

- [ ] **Step 7: Verify build compiles cleanly**

```bash
npm run build
```

Expected: "✓ Compiled successfully" with no TypeScript errors in the new files.

---

## Task 2: Zod Validators

**Files:**
- Create: `lib/validators/booking.ts`
- Create: `lib/validators/meeting.ts`

**Interfaces produced:**
- `BookingSchema` (parsed type: `z.infer<typeof bookingSchema>`)
- `CreateMeetingSchema` (parsed type: `z.infer<typeof createMeetingSchema>`)
- `UpdateMeetingSchema` (parsed type: `z.infer<typeof updateMeetingSchema>`)

- [ ] **Step 1: Create `lib/validators/booking.ts`**

```typescript
// lib/validators/booking.ts
import { z } from "zod";

const PHONE_RE = /^[\+\d\s\-\(\)\.]{7,30}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const bookingSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Full name is required")
    .max(100, "Full name is too long"),
  email: z
    .string()
    .trim()
    .regex(EMAIL_RE, "Invalid email address")
    .max(254, "Email is too long"),
  phone: z
    .string()
    .trim()
    .regex(PHONE_RE, "Invalid phone number")
    .max(30, "Phone number is too long"),
  socialHandle: z.string().trim().max(100).nullable().optional(),
  companyName: z.string().trim().max(200).nullable().optional(),
  service: z.string().trim().min(1, "Service is required").max(200),
  budget: z.string().trim().max(50).nullable().optional(),
  packageName: z.string().trim().max(200).nullable().optional(),
  packagePrice: z.string().trim().max(50).nullable().optional(),
  packageDeposit: z.string().trim().max(50).nullable().optional(),
  message: z
    .string()
    .trim()
    .min(1, "Message is required")
    .max(5000, "Message is too long"),
  timezone: z.string().trim().max(100).nullable().optional(),
  referralSource: z.string().trim().max(200).nullable().optional(),
  // Honeypot — must be absent or empty
  website: z.string().max(0, "Spam detected").optional(),
});

export type BookingInput = z.infer<typeof bookingSchema>;
```

- [ ] **Step 2: Create `lib/validators/meeting.ts`**

```typescript
// lib/validators/meeting.ts
import { z } from "zod";
import type { MeetingType, MeetingStatus } from "@/types/meeting";

const MEETING_TYPES: MeetingType[] = [
  "discovery-call",
  "consultation",
  "strategy-session",
  "project-discussion",
  "website-review",
  "follow-up",
];

const MEETING_STATUSES: MeetingStatus[] = [
  "scheduled",
  "confirmed",
  "completed",
  "cancelled",
  "no-show",
];

export const createMeetingSchema = z.object({
  submissionId: z.number().int().positive(),
  meetingDate: z.string().datetime({ message: "Invalid meeting date" }),
  durationMinutes: z.number().int().refine(
    (n) => [15, 30, 45, 60].includes(n),
    { message: "Duration must be 15, 30, 45, or 60 minutes" }
  ),
  meetingType: z.enum(MEETING_TYPES as [MeetingType, ...MeetingType[]]),
  timezone: z.string().trim().min(1).max(100),
});

export type CreateMeetingInput = z.infer<typeof createMeetingSchema>;

export const updateMeetingSchema = z.object({
  status: z.enum(MEETING_STATUSES as [MeetingStatus, ...MeetingStatus[]]).optional(),
  meetingUrl: z.string().url().nullable().optional(),
  assignedTo: z.string().trim().max(200).nullable().optional(),
  notes: z.string().trim().max(2000).nullable().optional(),
  cancelReason: z.string().trim().max(1000).nullable().optional(),
});

export type UpdateMeetingInput = z.infer<typeof updateMeetingSchema>;
```

- [ ] **Step 3: Verify types compile**

```bash
npx tsc --noEmit
```

Expected: No errors in `lib/validators/`.

---

## Task 3: Availability Service + GET /api/availability

**Files:**
- Create: `lib/services/availability.service.ts`
- Create: `app/api/availability/route.ts`

**Interfaces consumed:** `availabilityRules`, `blackoutDates`, `meetings` (Drizzle tables)
**Interfaces produced:** `getAvailableSlots(opts) → Promise<AvailableSlot[]>`

- [ ] **Step 1: Create `lib/services/availability.service.ts`**

```typescript
// lib/services/availability.service.ts
import { db } from "@/lib/db";
import { availabilityRules, blackoutDates, meetings } from "@/lib/schema";
import { and, eq, gte, lte } from "drizzle-orm";
import { fromZonedTime, toZonedTime } from "date-fns-tz";
import { addMinutes, format, isBefore, startOfDay, endOfDay } from "date-fns";
import type { AvailableSlot } from "@/types/meeting";

const BUSINESS_TIMEZONE = "America/New_York";
const MIN_NOTICE_HOURS = 24;
const MAX_BOOKING_DAYS = 60;
const SLOT_STEP_MINUTES = 15; // granularity

export interface AvailabilityOptions {
  date: string;           // "YYYY-MM-DD"
  durationMinutes: number;
  timezone: string;       // user's display timezone
}

export async function getAvailableSlots(
  opts: AvailabilityOptions
): Promise<AvailableSlot[]> {
  const { date, durationMinutes, timezone } = opts;

  // Validate date is not too far out
  const requestedDate = new Date(`${date}T00:00:00.000Z`);
  const now = new Date();
  const maxDate = addMinutes(now, MAX_BOOKING_DAYS * 24 * 60);
  if (requestedDate > maxDate) return [];

  // Determine the day of week in the BUSINESS timezone
  const zonedDate = toZonedTime(fromZonedTime(`${date}T00:00:00`, BUSINESS_TIMEZONE), BUSINESS_TIMEZONE);
  const dayOfWeek = zonedDate.getDay(); // 0=Sun, 6=Sat

  // Check if this date is blacked out
  const [blackout] = await db
    .select()
    .from(blackoutDates)
    .where(eq(blackoutDates.date, date))
    .limit(1);
  if (blackout) return [];

  // Get the availability rule for this day
  const [rule] = await db
    .select()
    .from(availabilityRules)
    .where(
      and(
        eq(availabilityRules.dayOfWeek, dayOfWeek),
        eq(availabilityRules.isActive, true)
      )
    )
    .limit(1);
  if (!rule) return [];

  // Build slot boundaries in business timezone
  const dayStart = fromZonedTime(`${date}T${rule.startTime}:00`, BUSINESS_TIMEZONE);
  const dayEnd = fromZonedTime(`${date}T${rule.endTime}:00`, BUSINESS_TIMEZONE);
  const breakStart = rule.breakStart
    ? fromZonedTime(`${date}T${rule.breakStart}:00`, BUSINESS_TIMEZONE)
    : null;
  const breakEnd = rule.breakEnd
    ? fromZonedTime(`${date}T${rule.breakEnd}:00`, BUSINESS_TIMEZONE)
    : null;

  // Fetch existing meetings that overlap with this day
  const existingMeetings = await db
    .select({ start: meetings.meetingDate, end: meetings.meetingEndDate })
    .from(meetings)
    .where(
      and(
        gte(meetings.meetingDate, startOfDay(dayStart)),
        lte(meetings.meetingDate, endOfDay(dayEnd)),
        eq(meetings.status, "scheduled")
      )
    );

  // Generate candidate slots
  const slots: AvailableSlot[] = [];
  let cursor = new Date(dayStart);
  const minStart = addMinutes(now, MIN_NOTICE_HOURS * 60);

  while (true) {
    const slotEnd = addMinutes(cursor, durationMinutes);
    if (slotEnd > dayEnd) break;

    const isBeforeMinNotice = isBefore(cursor, minStart);
    const inBreak =
      breakStart && breakEnd
        ? cursor < breakEnd && slotEnd > breakStart
        : false;
    const conflictsWithMeeting = existingMeetings.some(
      (m) => cursor < new Date(m.end) && slotEnd > new Date(m.start)
    );

    if (!isBeforeMinNotice && !inBreak && !conflictsWithMeeting) {
      const startLocal = format(
        toZonedTime(cursor, timezone),
        "h:mm a",
        { timeZone: timezone }
      );
      const endLocal = format(
        toZonedTime(slotEnd, timezone),
        "h:mm a",
        { timeZone: timezone }
      );
      slots.push({
        start: cursor.toISOString(),
        end: slotEnd.toISOString(),
        startLocal,
        endLocal,
      });
    }

    cursor = addMinutes(cursor, SLOT_STEP_MINUTES);
  }

  return slots;
}
```

- [ ] **Step 2: Create `app/api/availability/route.ts`**

```typescript
// app/api/availability/route.ts
import { getAvailableSlots } from "@/lib/services/availability.service";

const VALID_DURATIONS = new Set([15, 30, 45, 60]);

export async function GET(request: Request) {
  const url = new URL(request.url);
  const date = url.searchParams.get("date") ?? "";
  const durationStr = url.searchParams.get("duration") ?? "30";
  const timezone = url.searchParams.get("timezone") ?? "America/New_York";

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return Response.json({ error: "Invalid date format. Use YYYY-MM-DD." }, { status: 400 });
  }

  const durationMinutes = parseInt(durationStr, 10);
  if (!VALID_DURATIONS.has(durationMinutes)) {
    return Response.json({ error: "Duration must be 15, 30, 45, or 60." }, { status: 400 });
  }

  try {
    const slots = await getAvailableSlots({ date, durationMinutes, timezone });
    return Response.json({ slots });
  } catch {
    return Response.json({ error: "Failed to fetch availability." }, { status: 500 });
  }
}
```

- [ ] **Step 3: Test the availability endpoint**

Start the dev server (`npm run dev`) and make a GET request:

```
http://localhost:3000/api/availability?date=2026-07-07&duration=30&timezone=America/New_York
```

Expected response:
```json
{
  "slots": [
    { "start": "...", "end": "...", "startLocal": "9:00 AM", "endLocal": "9:30 AM" },
    ...
  ]
}
```

If no rules are seeded yet, run `npx tsx lib/seed-availability.ts` first.

---

## Task 4: Calendar + Meeting Platform Provider Abstractions

**Files:**
- Create: `lib/services/calendar/types.ts`
- Create: `lib/services/calendar/internal.provider.ts`
- Create: `lib/services/calendar/index.ts`
- Create: `lib/services/meeting-platform/types.ts`
- Create: `lib/services/meeting-platform/custom.provider.ts`
- Create: `lib/services/meeting-platform/index.ts`

These are pure type/abstraction files. The "internal" calendar provider delegates to the availability service (which reads the DB rules). The "custom" meeting platform reads a meeting URL from `site_settings`.

- [ ] **Step 1: Create `lib/services/calendar/types.ts`**

```typescript
// lib/services/calendar/types.ts
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
}

export interface CalendarProvider {
  readonly name: string;
  isConnected(): Promise<boolean>;
  getEvents(start: Date, end: Date): Promise<CalendarEvent[]>;
  createEvent(event: Omit<CalendarEvent, "id">): Promise<CalendarEvent>;
  deleteEvent(eventId: string): Promise<void>;
}
```

- [ ] **Step 2: Create `lib/services/calendar/internal.provider.ts`**

```typescript
// lib/services/calendar/internal.provider.ts
import type { CalendarProvider, CalendarEvent } from "./types";
import { db } from "@/lib/db";
import { meetings } from "@/lib/schema";
import { and, gte, lte } from "drizzle-orm";
import { nanoid } from "nanoid";

export class InternalCalendarProvider implements CalendarProvider {
  readonly name = "internal";

  async isConnected(): Promise<boolean> {
    return true;
  }

  async getEvents(start: Date, end: Date): Promise<CalendarEvent[]> {
    const rows = await db
      .select()
      .from(meetings)
      .where(
        and(
          gte(meetings.meetingDate, start),
          lte(meetings.meetingDate, end)
        )
      );
    return rows.map((m) => ({
      id: String(m.id),
      title: `Meeting #${m.bookingRef}`,
      start: new Date(m.meetingDate),
      end: new Date(m.meetingEndDate),
    }));
  }

  async createEvent(event: Omit<CalendarEvent, "id">): Promise<CalendarEvent> {
    // The internal provider doesn't need to create external events —
    // the meetings table IS the calendar. Return a synthetic event object.
    return { ...event, id: nanoid() };
  }

  async deleteEvent(_eventId: string): Promise<void> {
    // No-op: deletion is handled by the meetings table directly
  }
}
```

Note: `nanoid` is already in the project's node_modules (used by Next.js). Import directly.

- [ ] **Step 3: Create `lib/services/calendar/index.ts`**

```typescript
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
```

- [ ] **Step 4: Create `lib/services/meeting-platform/types.ts`**

```typescript
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
```

- [ ] **Step 5: Create `lib/services/meeting-platform/custom.provider.ts`**

```typescript
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
```

- [ ] **Step 6: Create `lib/services/meeting-platform/index.ts`**

```typescript
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
```

- [ ] **Step 7: Verify build**

```bash
npx tsc --noEmit
```

Expected: No errors in the new service files.

---

## Task 5: ICS Service + Download Route

**Files:**
- Create: `lib/services/ics.service.ts`
- Create: `app/api/meetings/[id]/ics/route.ts`

- [ ] **Step 1: Create `lib/services/ics.service.ts`**

```typescript
// lib/services/ics.service.ts
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export interface ICSEventData {
  uid: string;
  title: string;
  description: string;
  location: string;
  start: Date;
  end: Date;
  organizerEmail: string;
  organizerName: string;
  attendeeEmail: string;
  attendeeName: string;
}

function icsDate(date: Date): string {
  return format(toZonedTime(date, "UTC"), "yyyyMMdd'T'HHmmss'Z'", {
    timeZone: "UTC",
  });
}

function icsEscape(str: string): string {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

export function generateICS(event: ICSEventData): string {
  const now = icsDate(new Date());
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//diEntertainment//Scheduler//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${event.uid}@dientertainment.com`,
    `DTSTAMP:${now}`,
    `DTSTART:${icsDate(event.start)}`,
    `DTEND:${icsDate(event.end)}`,
    `SUMMARY:${icsEscape(event.title)}`,
    `DESCRIPTION:${icsEscape(event.description)}`,
    `LOCATION:${icsEscape(event.location)}`,
    `ORGANIZER;CN="${icsEscape(event.organizerName)}":MAILTO:${event.organizerEmail}`,
    `ATTENDEE;CN="${icsEscape(event.attendeeName)}";ROLE=REQ-PARTICIPANT;RSVP=TRUE:MAILTO:${event.attendeeEmail}`,
    "STATUS:CONFIRMED",
    "SEQUENCE:0",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
```

- [ ] **Step 2: Create `app/api/meetings/[id]/ics/route.ts`**

```typescript
// app/api/meetings/[id]/ics/route.ts
import { db } from "@/lib/db";
import { meetings, contactSubmissions } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { generateICS } from "@/lib/services/ics.service";
import { MEETING_TYPE_LABELS } from "@/types/meeting";
import type { MeetingType } from "@/types/meeting";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const meetingId = parseInt(id, 10);
  if (isNaN(meetingId)) {
    return Response.json({ error: "Invalid meeting ID." }, { status: 400 });
  }

  const [meeting] = await db
    .select()
    .from(meetings)
    .where(eq(meetings.id, meetingId))
    .limit(1);

  if (!meeting) {
    return Response.json({ error: "Meeting not found." }, { status: 404 });
  }

  const [submission] = await db
    .select({ fullName: contactSubmissions.fullName, email: contactSubmissions.email })
    .from(contactSubmissions)
    .where(eq(contactSubmissions.id, meeting.submissionId))
    .limit(1);

  const typeLabel =
    MEETING_TYPE_LABELS[meeting.meetingType as MeetingType] ?? meeting.meetingType;

  const ics = generateICS({
    uid: meeting.bookingRef,
    title: `${typeLabel} — diEntertainment`,
    description: `Your ${typeLabel} is scheduled. Booking reference: ${meeting.bookingRef}${
      meeting.meetingUrl ? `\nJoin: ${meeting.meetingUrl}` : ""
    }`,
    location: meeting.meetingUrl ?? "Link will be shared before the meeting",
    start: new Date(meeting.meetingDate),
    end: new Date(meeting.meetingEndDate),
    organizerEmail: process.env.SMTP_USER ?? "info@dientertainment.com",
    organizerName: "diEntertainment",
    attendeeEmail: submission?.email ?? "",
    attendeeName: submission?.fullName ?? "Guest",
  });

  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="meeting-${meeting.bookingRef}.ics"`,
      "Cache-Control": "no-store",
    },
  });
}
```

- [ ] **Step 3: Test ICS download**

After creating a test meeting (done in Task 7), visit:
```
http://localhost:3000/api/meetings/1/ics
```

Expected: Browser downloads a `.ics` file that can be opened in Apple Calendar/Google Calendar.

---

## Task 6: Meeting Service

**Files:**
- Create: `lib/services/meeting.service.ts`

**Interfaces produced:**
- `createMeeting(input: CreateMeetingInput) → Promise<MeetingConfirmation>`
- `getMeetingById(id: number) → Promise<Meeting | null>`
- `updateMeeting(id: number, updates: UpdateMeetingInput) → Promise<void>`
- `cancelMeeting(id: number, reason?: string) → Promise<void>`

- [ ] **Step 1: Create `lib/services/meeting.service.ts`**

```typescript
// lib/services/meeting.service.ts
import { db } from "@/lib/db";
import { meetings, contactSubmissions, bookingStatusHistory } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { addMinutes } from "date-fns";
import { getMeetingPlatformProvider } from "./meeting-platform/index";
import type { CreateMeetingInput, UpdateMeetingInput } from "@/lib/validators/meeting";
import type { MeetingConfirmation, MeetingProvider } from "@/types/meeting";

function generateBookingRef(): string {
  const now = new Date();
  const datePart = now
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, "");
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const rand = Array.from({ length: 6 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
  return `DI-${datePart}-${rand}`;
}

export async function createMeeting(
  input: CreateMeetingInput
): Promise<MeetingConfirmation> {
  const start = new Date(input.meetingDate);
  const end = addMinutes(start, input.durationMinutes);
  const bookingRef = generateBookingRef();

  // Generate meeting link from configured provider
  const platform = getMeetingPlatformProvider();
  const link = await platform.generateLink({
    title: `Meeting ${bookingRef}`,
    start,
    end,
  });

  const [row] = await db
    .insert(meetings)
    .values({
      submissionId: input.submissionId,
      bookingRef,
      meetingDate: start,
      meetingEndDate: end,
      timezone: input.timezone,
      durationMinutes: input.durationMinutes,
      meetingType: input.meetingType,
      status: "scheduled",
      meetingUrl: link.url || null,
      meetingPlatformId: link.id,
      meetingProvider: link.provider as MeetingProvider,
    })
    .returning();

  // Update submission booking status
  await db
    .update(contactSubmissions)
    .set({ bookingStatus: "scheduled" })
    .where(eq(contactSubmissions.id, input.submissionId));

  // Record status transition
  await db.insert(bookingStatusHistory).values({
    submissionId: input.submissionId,
    fromStatus: "pending-scheduling",
    toStatus: "scheduled",
    changedBy: "system",
  });

  return {
    id: row.id,
    bookingRef: row.bookingRef,
    meetingDate: row.meetingDate.toISOString(),
    meetingEndDate: row.meetingEndDate.toISOString(),
    timezone: row.timezone,
    durationMinutes: row.durationMinutes,
    meetingType: row.meetingType as import("@/types/meeting").MeetingType,
    meetingUrl: row.meetingUrl,
    meetingProvider: row.meetingProvider as MeetingProvider,
  };
}

export async function updateMeeting(
  id: number,
  updates: UpdateMeetingInput
): Promise<void> {
  await db
    .update(meetings)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(meetings.id, id));
}

export async function cancelMeeting(
  id: number,
  reason?: string
): Promise<void> {
  const [row] = await db
    .select({ submissionId: meetings.submissionId, status: meetings.status })
    .from(meetings)
    .where(eq(meetings.id, id))
    .limit(1);

  if (!row) return;

  await db
    .update(meetings)
    .set({ status: "cancelled", cancelReason: reason ?? null, updatedAt: new Date() })
    .where(eq(meetings.id, id));

  await db
    .update(contactSubmissions)
    .set({ bookingStatus: "cancelled" })
    .where(eq(contactSubmissions.id, row.submissionId));

  await db.insert(bookingStatusHistory).values({
    submissionId: row.submissionId,
    fromStatus: row.status,
    toStatus: "cancelled",
    changedBy: "admin",
    notes: reason,
  });
}
```

---

## Task 7: Meeting API Routes (Public)

**Files:**
- Create: `app/api/meetings/route.ts`
- Create: `app/api/meetings/[id]/route.ts`

- [ ] **Step 1: Create `app/api/meetings/route.ts`**

```typescript
// app/api/meetings/route.ts
import { createMeetingSchema } from "@/lib/validators/meeting";
import { createMeeting } from "@/lib/services/meeting.service";
import { db } from "@/lib/db";
import { contactSubmissions } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { logActivity } from "@/lib/logger";
import { checkRateLimit } from "@/lib/rate-limit";
import { sendMeetingConfirmation } from "@/lib/email";

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const { allowed, retryAfter } = checkRateLimit(ip);
  if (!allowed) {
    return Response.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

  try {
    const body = await request.json();
    const parsed = createMeetingSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input." },
        { status: 400 }
      );
    }

    const input = parsed.data;

    // Verify the submission exists
    const [submission] = await db
      .select()
      .from(contactSubmissions)
      .where(eq(contactSubmissions.id, input.submissionId))
      .limit(1);

    if (!submission) {
      return Response.json({ error: "Booking not found." }, { status: 404 });
    }

    // Check submission doesn't already have a scheduled meeting
    if (submission.bookingStatus === "scheduled" || submission.bookingStatus === "confirmed") {
      return Response.json(
        { error: "A meeting has already been scheduled for this booking." },
        { status: 409 }
      );
    }

    const confirmation = await createMeeting(input);

    await logActivity(
      "meeting",
      `Meeting scheduled: ${confirmation.bookingRef} for ${submission.fullName}`,
      { meetingId: confirmation.id, bookingRef: confirmation.bookingRef },
      ip
    );

    // Send confirmation email (non-blocking)
    sendMeetingConfirmation({
      to: submission.email,
      toName: submission.fullName,
      bookingRef: confirmation.bookingRef,
      meetingDate: confirmation.meetingDate,
      meetingEndDate: confirmation.meetingEndDate,
      timezone: confirmation.timezone,
      meetingType: confirmation.meetingType,
      durationMinutes: confirmation.durationMinutes,
      meetingUrl: confirmation.meetingUrl,
      meetingId: confirmation.id,
    }).catch(() => {});

    return Response.json({ success: true, meeting: confirmation }, { status: 201 });
  } catch {
    return Response.json({ error: "Failed to schedule meeting." }, { status: 500 });
  }
}
```

- [ ] **Step 2: Create `app/api/meetings/[id]/route.ts`**

```typescript
// app/api/meetings/[id]/route.ts
import { updateMeetingSchema } from "@/lib/validators/meeting";
import { updateMeeting, cancelMeeting } from "@/lib/services/meeting.service";
import { db } from "@/lib/db";
import { meetings } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { checkRateLimit } from "@/lib/rate-limit";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const { allowed } = checkRateLimit(ip);
  if (!allowed) {
    return Response.json({ error: "Too many requests." }, { status: 429 });
  }

  const { id } = await params;
  const meetingId = parseInt(id, 10);
  if (isNaN(meetingId)) {
    return Response.json({ error: "Invalid meeting ID." }, { status: 400 });
  }

  const body = await request.json();
  const parsed = updateMeetingSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 }
    );
  }

  const [exists] = await db
    .select({ id: meetings.id })
    .from(meetings)
    .where(eq(meetings.id, meetingId))
    .limit(1);

  if (!exists) {
    return Response.json({ error: "Meeting not found." }, { status: 404 });
  }

  await updateMeeting(meetingId, parsed.data);
  return Response.json({ success: true });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const meetingId = parseInt(id, 10);
  if (isNaN(meetingId)) {
    return Response.json({ error: "Invalid meeting ID." }, { status: 400 });
  }

  const body = await request.json().catch(() => ({}));
  const reason = typeof body.reason === "string" ? body.reason.trim() : undefined;

  await cancelMeeting(meetingId, reason);
  return Response.json({ success: true });
}
```

- [ ] **Step 3: Test the meetings API**

```bash
# Create a test meeting (replace submissionId with a real one from your DB)
curl -X POST http://localhost:3000/api/meetings \
  -H "Content-Type: application/json" \
  -d '{"submissionId":1,"meetingDate":"2026-07-10T14:00:00.000Z","durationMinutes":30,"meetingType":"discovery-call","timezone":"America/New_York"}'
```

Expected: `{ "success": true, "meeting": { "id": 1, "bookingRef": "DI-20260629-XXXXXX", ... } }`

---

## Task 8: Updated /api/contact Route

**Files:**
- Modify: `app/api/contact/route.ts`

Adds: Zod validation, honeypot spam check, duplicate submission prevention, `submissionRef` generation, `bookingStatus` default, sends booking received email, returns `{ submissionId, bookingRef }`.

- [ ] **Step 1: Replace `app/api/contact/route.ts` entirely**

```typescript
// app/api/contact/route.ts
import { db } from "@/lib/db";
import { contactSubmissions } from "@/lib/schema";
import { logActivity } from "@/lib/logger";
import { sendContactNotification, sendBookingConfirmation } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";
import { bookingSchema } from "@/lib/validators/booking";
import { eq, and, gte } from "drizzle-orm";

function generateSubmissionRef(): string {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const rand = Array.from({ length: 6 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
  return `DI-${datePart}-${rand}`;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const { allowed, retryAfter } = checkRateLimit(ip);
  if (!allowed) {
    return Response.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

  try {
    const raw = await request.json();

    // Honeypot: "website" field must be absent or empty
    if (raw.website && String(raw.website).trim().length > 0) {
      // Silently succeed to not tip off bots
      return Response.json({ success: true }, { status: 201 });
    }

    const parsed = bookingSchema.safeParse(raw);
    if (!parsed.success) {
      return Response.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input." },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Duplicate check: same email within the last 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const [duplicate] = await db
      .select({ id: contactSubmissions.id })
      .from(contactSubmissions)
      .where(
        and(
          eq(contactSubmissions.email, data.email),
          gte(contactSubmissions.createdAt, fiveMinutesAgo)
        )
      )
      .limit(1);

    if (duplicate) {
      return Response.json(
        { error: "A submission from this email was recently received. Please wait a few minutes before submitting again." },
        { status: 429 }
      );
    }

    const submissionRef = generateSubmissionRef();

    const [row] = await db
      .insert(contactSubmissions)
      .values({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        socialHandle: data.socialHandle ?? null,
        companyName: data.companyName ?? null,
        service: data.service,
        budget: data.budget ?? null,
        packageName: data.packageName ?? null,
        packagePrice: data.packagePrice ?? null,
        packageDeposit: data.packageDeposit ?? null,
        message: data.message,
        submissionRef,
        bookingStatus: "pending-scheduling",
        timezone: data.timezone ?? null,
        referralSource: data.referralSource ?? null,
      })
      .returning({ id: contactSubmissions.id, submissionRef: contactSubmissions.submissionRef });

    const description = data.packageName
      ? `Booking request from ${data.fullName} for ${data.packageName}`
      : `Contact inquiry from ${data.fullName} (${data.service})`;

    await logActivity(
      data.packageName ? "booking" : "contact",
      description,
      { email: data.email, service: data.service, packageName: data.packageName ?? null },
      ip
    );

    // Admin notification (non-blocking)
    sendContactNotification({
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      socialHandle: data.socialHandle ?? null,
      companyName: data.companyName ?? null,
      service: data.service,
      budget: data.budget ?? null,
      packageName: data.packageName ?? null,
      packagePrice: data.packagePrice ?? null,
      packageDeposit: data.packageDeposit ?? null,
      message: data.message,
    }).catch(() => {});

    // Booking confirmation email to client (non-blocking)
    sendBookingConfirmation({
      to: data.email,
      toName: data.fullName,
      bookingRef: submissionRef ?? "",
      packageName: data.packageName ?? null,
      service: data.service,
    }).catch(() => {});

    return Response.json(
      {
        success: true,
        submissionId: row.id,
        bookingRef: row.submissionRef,
      },
      { status: 201 }
    );
  } catch {
    return Response.json({ error: "Submission failed." }, { status: 500 });
  }
}
```

---

## Task 9: Extended Email Templates

**Files:**
- Modify: `lib/email.ts`

Adds: `sendBookingConfirmation()` and `sendMeetingConfirmation()`.

- [ ] **Step 1: Add `sendBookingConfirmation` to `lib/email.ts`**

Append to the end of `lib/email.ts`:

```typescript
// ── Booking Confirmation ──────────────────────────────────────────────

export interface BookingConfirmationData {
  to: string;
  toName: string;
  bookingRef: string;
  packageName: string | null;
  service: string;
}

export async function sendBookingConfirmation(data: BookingConfirmationData) {
  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0d0d0d;color:#f5f5f5;padding:40px;border-radius:12px;">
      <div style="margin-bottom:32px;">
        <span style="font-size:24px;font-weight:700;letter-spacing:0.08em;color:#E50019;">di</span><span style="font-size:24px;font-weight:700;letter-spacing:0.08em;">ENTERTAINMENT</span>
      </div>
      <h2 style="color:#f5f5f5;font-size:28px;margin:0 0 8px;">Booking Received.</h2>
      <p style="color:#999;font-size:14px;margin:0 0 32px;">Hi ${esc(data.toName)}, we have your request and will be in touch within 24 hours.</p>

      <div style="background:#1a1a1a;border-radius:8px;padding:24px;margin-bottom:32px;border-left:3px solid #E50019;">
        <table style="width:100%;border-collapse:collapse;font-size:13px;">
          <tr><td style="padding:6px 0;color:#666;width:140px;">Reference</td><td style="padding:6px 0;color:#E50019;font-weight:700;">${esc(data.bookingRef)}</td></tr>
          <tr><td style="padding:6px 0;color:#666;">Service</td><td style="padding:6px 0;">${esc(data.packageName ?? data.service)}</td></tr>
          <tr><td style="padding:6px 0;color:#666;">Status</td><td style="padding:6px 0;">Pending Scheduling</td></tr>
        </table>
      </div>

      <p style="color:#999;font-size:13px;">Next step: after completing the booking form, you'll be guided to schedule your discovery call.</p>
      <hr style="border:none;border-top:1px solid #222;margin:32px 0;" />
      <p style="font-size:11px;color:#444;margin:0;">diEntertainment · Premium Digital Media Agency</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"diEntertainment" <${process.env.SMTP_USER}>`,
    to: data.to,
    subject: `Booking Received — ${esc(data.bookingRef)}`,
    html,
  });
}
```

- [ ] **Step 2: Add `sendMeetingConfirmation` to `lib/email.ts`**

```typescript
// ── Meeting Confirmation ──────────────────────────────────────────────

export interface MeetingConfirmationEmailData {
  to: string;
  toName: string;
  bookingRef: string;
  meetingDate: string;  // ISO UTC
  meetingEndDate: string; // ISO UTC
  timezone: string;
  meetingType: string;  // display label
  durationMinutes: number;
  meetingUrl: string | null;
  meetingId: number;
}

export async function sendMeetingConfirmation(data: MeetingConfirmationEmailData) {
  const startDate = new Date(data.meetingDate);
  const formattedDate = startDate.toLocaleDateString("en-US", {
    timeZone: data.timezone,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = startDate.toLocaleTimeString("en-US", {
    timeZone: data.timezone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const icsUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/api/meetings/${data.meetingId}/ics`;

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0d0d0d;color:#f5f5f5;padding:40px;border-radius:12px;">
      <div style="margin-bottom:32px;">
        <span style="font-size:24px;font-weight:700;letter-spacing:0.08em;color:#E50019;">di</span><span style="font-size:24px;font-weight:700;letter-spacing:0.08em;">ENTERTAINMENT</span>
      </div>
      <div style="margin-bottom:8px;font-size:28px;">✅</div>
      <h2 style="color:#f5f5f5;font-size:28px;margin:0 0 8px;">Meeting Confirmed.</h2>
      <p style="color:#999;font-size:14px;margin:0 0 32px;">Hi ${esc(data.toName)}, your ${esc(data.meetingType)} is scheduled.</p>

      <div style="background:#1a1a1a;border-radius:8px;padding:24px;margin-bottom:24px;border-left:3px solid #E50019;">
        <table style="width:100%;border-collapse:collapse;font-size:13px;">
          <tr><td style="padding:6px 0;color:#666;width:140px;">Reference</td><td style="padding:6px 0;color:#E50019;font-weight:700;">${esc(data.bookingRef)}</td></tr>
          <tr><td style="padding:6px 0;color:#666;">Meeting Type</td><td style="padding:6px 0;">${esc(data.meetingType)}</td></tr>
          <tr><td style="padding:6px 0;color:#666;">Date</td><td style="padding:6px 0;">${esc(formattedDate)}</td></tr>
          <tr><td style="padding:6px 0;color:#666;">Time</td><td style="padding:6px 0;">${esc(formattedTime)} (${esc(data.timezone)})</td></tr>
          <tr><td style="padding:6px 0;color:#666;">Duration</td><td style="padding:6px 0;">${data.durationMinutes} minutes</td></tr>
          ${data.meetingUrl ? `<tr><td style="padding:6px 0;color:#666;">Meeting Link</td><td style="padding:6px 0;"><a href="${esc(data.meetingUrl)}" style="color:#E50019;">${esc(data.meetingUrl)}</a></td></tr>` : ""}
        </table>
      </div>

      <a href="${icsUrl}" style="display:inline-block;padding:12px 24px;background:#E50019;color:#fff;text-decoration:none;border-radius:6px;font-size:13px;font-weight:600;margin-bottom:24px;">Download Calendar Invite (.ics)</a>

      <hr style="border:none;border-top:1px solid #222;margin:32px 0;" />
      <p style="font-size:11px;color:#444;margin:0;">diEntertainment · Premium Digital Media Agency</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"diEntertainment" <${process.env.SMTP_USER}>`,
    to: data.to,
    subject: `Meeting Confirmed — ${esc(data.bookingRef)}`,
    html,
  });

  // Admin notification
  await transporter.sendMail({
    from: `"diEntertainment" <${process.env.SMTP_USER}>`,
    to: process.env.SMTP_USER ?? "",
    subject: `New Meeting Scheduled — ${esc(data.bookingRef)}`,
    html: `<div style="font-family:sans-serif;padding:20px;"><h3>New Meeting: ${esc(data.bookingRef)}</h3><p>${esc(data.toName)} scheduled a ${esc(data.meetingType)} on ${esc(formattedDate)} at ${esc(formattedTime)}.</p></div>`,
  });
}
```

---

## Task 10: Scheduler UI Components

**Files:**
- Create: `app/components/CalendarPicker.tsx`
- Create: `app/components/TimeSlotGrid.tsx`
- Create: `app/components/SchedulerStep.tsx`
- Create: `app/components/ConfirmationStep.tsx`

All components are `"use client"` — pure React with no server calls in the component itself (API calls go through `fetch`). Styling follows existing Tailwind v4 conventions: `text-red`, `text-brand-white`, `bg-brand-black`, etc.

- [ ] **Step 1: Create `app/components/CalendarPicker.tsx`**

```tsx
// app/components/CalendarPicker.tsx
"use client";

import { useState } from "react";
import { addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, isBefore, isAfter } from "date-fns";

interface Props {
  selectedDate: string | null; // "YYYY-MM-DD"
  onSelect: (date: string) => void;
  disabledWeekdays?: number[]; // 0=Sun, 6=Sat — default [0,6]
  minDate?: Date;
  maxDate?: Date;
}

function toDateStr(date: Date): string {
  return date.toISOString().slice(0, 10);
}

const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export default function CalendarPicker({
  selectedDate,
  onSelect,
  disabledWeekdays = [0, 6],
  minDate,
  maxDate,
}: Props) {
  const [viewDate, setViewDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const today = new Date();
  const effectiveMin = minDate ?? today;
  const effectiveMax = maxDate ?? addDays(today, 60);

  const monthStart = startOfMonth(viewDate);
  const monthEnd = endOfMonth(viewDate);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days: Date[] = [];
  let cursor = new Date(gridStart);
  while (cursor <= gridEnd) {
    days.push(new Date(cursor));
    cursor = addDays(cursor, 1);
  }

  function isDisabled(date: Date): boolean {
    if (!isSameMonth(date, viewDate)) return true;
    if (disabledWeekdays.includes(date.getDay())) return true;
    if (isBefore(date, new Date(effectiveMin.getFullYear(), effectiveMin.getMonth(), effectiveMin.getDate()))) return true;
    if (isAfter(date, effectiveMax)) return true;
    return false;
  }

  return (
    <div className="select-none">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => setViewDate(subMonths(viewDate, 1))}
          className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/8 rounded transition-colors"
          aria-label="Previous month"
        >
          ‹
        </button>
        <span className="text-xs tracking-[0.2em] uppercase text-brand-white/70">
          {viewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </span>
        <button
          type="button"
          onClick={() => setViewDate(addMonths(viewDate, 1))}
          className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/8 rounded transition-colors"
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      {/* Day of week headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAY_LABELS.map((d) => (
          <div key={d} className="text-center text-[10px] text-white/25 tracking-widest py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-px">
        {days.map((date, i) => {
          const isOtherMonth = !isSameMonth(date, viewDate);
          const disabled = isDisabled(date);
          const dateStr = toDateStr(date);
          const isSelected = selectedDate === dateStr;
          const isToday = isSameDay(date, today);

          if (isOtherMonth) {
            return <div key={i} className="h-9" />;
          }

          return (
            <button
              key={i}
              type="button"
              disabled={disabled}
              onClick={() => !disabled && onSelect(dateStr)}
              className={[
                "h-9 w-full text-sm rounded transition-all duration-150",
                isSelected
                  ? "bg-red text-white font-semibold"
                  : disabled
                  ? "text-white/15 cursor-not-allowed"
                  : isToday
                  ? "text-red border border-red/40 hover:bg-red/15"
                  : "text-white/70 hover:bg-white/8 hover:text-white",
              ].join(" ")}
              aria-label={date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              aria-pressed={isSelected}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create `app/components/TimeSlotGrid.tsx`**

```tsx
// app/components/TimeSlotGrid.tsx
"use client";

import type { AvailableSlot } from "@/types/meeting";

interface Props {
  slots: AvailableSlot[];
  selected: AvailableSlot | null;
  loading: boolean;
  onSelect: (slot: AvailableSlot) => void;
}

export default function TimeSlotGrid({ slots, selected, loading, onSelect }: Props) {
  if (loading) {
    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-10 bg-white/5 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <p className="text-white/35 text-sm py-4 text-center">
        No available times for this date.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
      {slots.map((slot) => {
        const isSelected = selected?.start === slot.start;
        return (
          <button
            key={slot.start}
            type="button"
            onClick={() => onSelect(slot)}
            className={[
              "px-2 py-2.5 text-[11px] tracking-wide rounded border transition-all duration-150",
              isSelected
                ? "bg-red border-red text-white font-medium"
                : "border-white/12 text-white/60 hover:border-red/50 hover:text-white hover:bg-red/8",
            ].join(" ")}
            aria-pressed={isSelected}
          >
            {slot.startLocal}
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 3: Create `app/components/SchedulerStep.tsx`**

```tsx
// app/components/SchedulerStep.tsx
"use client";

import { useState, useEffect } from "react";
import CalendarPicker from "./CalendarPicker";
import TimeSlotGrid from "./TimeSlotGrid";
import type { AvailableSlot, MeetingType, DurationMinutes, MeetingConfirmation } from "@/types/meeting";
import { MEETING_TYPE_LABELS, DURATION_OPTIONS } from "@/types/meeting";

const TIMEZONES = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "America/Anchorage", label: "Alaska Time (AKT)" },
  { value: "Pacific/Honolulu", label: "Hawaii Time (HT)" },
  { value: "America/Sao_Paulo", label: "Brazil Time (BRT)" },
  { value: "Europe/London", label: "London (GMT/BST)" },
  { value: "Europe/Paris", label: "Central European Time (CET)" },
  { value: "Asia/Dubai", label: "Gulf Standard Time (GST)" },
  { value: "Asia/Kolkata", label: "India Standard Time (IST)" },
  { value: "Asia/Tokyo", label: "Japan Standard Time (JST)" },
  { value: "Australia/Sydney", label: "Australian Eastern (AEST)" },
];

const inputClass =
  "w-full bg-transparent border-b border-white/14 focus:border-red text-brand-white text-sm py-3 outline-none appearance-none transition-colors duration-200";
const labelClass =
  "block text-brand-white/35 text-[9px] tracking-[0.3em] uppercase mb-2";

interface Props {
  submissionId: number;
  bookingRef: string;
  clientName: string;
  packageName?: string;
  onConfirmed: (confirmation: MeetingConfirmation) => void;
}

export default function SchedulerStep({
  submissionId,
  bookingRef,
  clientName,
  packageName,
  onConfirmed,
}: Props) {
  const [meetingType, setMeetingType] = useState<MeetingType>("discovery-call");
  const [duration, setDuration] = useState<DurationMinutes>(30);
  const [timezone, setTimezone] = useState<string>(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch {
      return "America/New_York";
    }
  });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [slots, setSlots] = useState<AvailableSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Fetch slots when date or duration changes
  useEffect(() => {
    if (!selectedDate) return;
    setSelectedSlot(null);
    setSlotsLoading(true);
    setError("");

    fetch(
      `/api/availability?date=${selectedDate}&duration=${duration}&timezone=${encodeURIComponent(timezone)}`
    )
      .then((r) => r.json())
      .then((data: { slots?: AvailableSlot[]; error?: string }) => {
        setSlots(data.slots ?? []);
      })
      .catch(() => setSlots([]))
      .finally(() => setSlotsLoading(false));
  }, [selectedDate, duration, timezone]);

  async function handleSchedule() {
    if (!selectedSlot) return;
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submissionId,
          meetingDate: selectedSlot.start,
          durationMinutes: duration,
          meetingType,
          timezone,
        }),
      });
      const data = await res.json();
      if (res.ok && data.meeting) {
        onConfirmed(data.meeting as MeetingConfirmation);
      } else {
        setError(data.error ?? "Failed to schedule meeting. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="text-red text-[9px] tracking-[0.35em] uppercase mb-1">
          Step 2 of 2
        </div>
        <h3
          className="font-display uppercase text-brand-white"
          style={{ fontSize: "clamp(22px, 2.5vw, 32px)" }}
        >
          Schedule Your Call
        </h3>
        <p className="text-brand-white/40 text-sm mt-2">
          Hi {clientName} — your booking{packageName ? ` for ${packageName}` : ""} was received.{" "}
          <span className="text-red">Ref: {bookingRef}</span>
        </p>
      </div>

      {/* Meeting type */}
      <div>
        <label className={labelClass}>Meeting Type</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {(Object.keys(MEETING_TYPE_LABELS) as MeetingType[]).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setMeetingType(type)}
              className={[
                "px-3 py-2.5 text-[10px] tracking-wide rounded border text-left transition-all duration-150",
                meetingType === type
                  ? "bg-red/15 border-red text-red"
                  : "border-white/10 text-white/50 hover:border-white/30 hover:text-white",
              ].join(" ")}
            >
              {MEETING_TYPE_LABELS[type]}
            </button>
          ))}
        </div>
      </div>

      {/* Duration */}
      <div>
        <label className={labelClass}>Duration</label>
        <div className="flex gap-2">
          {DURATION_OPTIONS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDuration(d)}
              className={[
                "px-4 py-2 text-xs rounded border transition-all duration-150",
                duration === d
                  ? "bg-red border-red text-white"
                  : "border-white/12 text-white/50 hover:border-white/35 hover:text-white",
              ].join(" ")}
            >
              {d}m
            </button>
          ))}
        </div>
      </div>

      {/* Timezone */}
      <div>
        <label htmlFor="tz-select" className={labelClass}>Your Timezone</label>
        <div className="relative">
          <select
            id="tz-select"
            value={timezone}
            onChange={(e) => {
              setTimezone(e.target.value);
              setSelectedDate(null);
            }}
            className={`${inputClass} cursor-pointer`}
            style={{ color: "#F5F5F5" }}
          >
            {TIMEZONES.map((tz) => (
              <option key={tz.value} value={tz.value} className="bg-[#111]">
                {tz.label}
              </option>
            ))}
          </select>
          <span className="absolute right-0 top-1/2 -translate-y-1/2 text-red text-[10px] pointer-events-none">▾</span>
        </div>
      </div>

      {/* Calendar */}
      <div>
        <label className={labelClass}>Pick a Date</label>
        <CalendarPicker
          selectedDate={selectedDate}
          onSelect={setSelectedDate}
        />
      </div>

      {/* Time slots */}
      {selectedDate && (
        <div>
          <label className={labelClass}>
            Available Times —{" "}
            {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </label>
          <TimeSlotGrid
            slots={slots}
            selected={selectedSlot}
            loading={slotsLoading}
            onSelect={setSelectedSlot}
          />
        </div>
      )}

      {error && <p className="text-red text-xs tracking-wide">{error}</p>}

      {/* CTA */}
      <button
        type="button"
        disabled={!selectedSlot || submitting}
        onClick={handleSchedule}
        className="flex items-center gap-3 bg-red text-brand-white text-[11px] tracking-[0.22em] uppercase px-10 py-4 rounded-xs hover:bg-[#FF001F] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(229,0,25,0.35)] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        style={{ transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)" }}
      >
        {submitting ? (
          <>
            <span className="inline-block w-3 h-3 border border-white/40 border-t-white rounded-full animate-spin" aria-hidden="true" />
            Scheduling...
          </>
        ) : (
          <>Confirm Meeting <span className="text-sm">→</span></>
        )}
      </button>

      <p className="text-white/20 text-xs">
        You can reschedule or cancel by contacting us with your reference number.
      </p>
    </div>
  );
}
```

- [ ] **Step 4: Create `app/components/ConfirmationStep.tsx`**

```tsx
// app/components/ConfirmationStep.tsx
"use client";

import type { MeetingConfirmation, MeetingType } from "@/types/meeting";
import { MEETING_TYPE_LABELS } from "@/types/meeting";

interface Props {
  confirmation: MeetingConfirmation;
  timezone: string;
}

function buildGoogleCalendarUrl(c: MeetingConfirmation, tz: string): string {
  const start = new Date(c.meetingDate)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(".000Z", "Z");
  const end = new Date(c.meetingEndDate)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(".000Z", "Z");
  const title = encodeURIComponent(
    `${MEETING_TYPE_LABELS[c.meetingType as MeetingType] ?? c.meetingType} — diEntertainment`
  );
  const details = encodeURIComponent(
    `Booking reference: ${c.bookingRef}${c.meetingUrl ? `\nJoin: ${c.meetingUrl}` : ""}`
  );
  const location = encodeURIComponent(c.meetingUrl ?? "");
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}&ctz=${encodeURIComponent(tz)}`;
}

function buildOutlookUrl(c: MeetingConfirmation): string {
  const start = new Date(c.meetingDate).toISOString().slice(0, 19);
  const end = new Date(c.meetingEndDate).toISOString().slice(0, 19);
  const subject = encodeURIComponent(
    `${MEETING_TYPE_LABELS[c.meetingType as MeetingType] ?? c.meetingType} — diEntertainment`
  );
  const body = encodeURIComponent(
    `Booking reference: ${c.bookingRef}${c.meetingUrl ? `\nJoin: ${c.meetingUrl}` : ""}`
  );
  const location = encodeURIComponent(c.meetingUrl ?? "");
  return `https://outlook.office.com/calendar/0/deeplink/compose?subject=${subject}&startdt=${start}&enddt=${end}&body=${body}&location=${location}`;
}

export default function ConfirmationStep({ confirmation, timezone }: Props) {
  const start = new Date(confirmation.meetingDate);
  const formattedDate = start.toLocaleDateString("en-US", {
    timeZone: timezone,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = start.toLocaleTimeString("en-US", {
    timeZone: timezone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  const typeLabel =
    MEETING_TYPE_LABELS[confirmation.meetingType as MeetingType] ??
    confirmation.meetingType;

  return (
    <div className="space-y-8">
      {/* Checkmark */}
      <div>
        <div
          className="font-display text-red leading-none mb-4"
          style={{ fontSize: "clamp(48px, 5vw, 64px)" }}
        >
          ✓
        </div>
        <h3
          className="font-display uppercase text-brand-white"
          style={{ fontSize: "clamp(22px, 2.5vw, 32px)" }}
        >
          Meeting Confirmed.
        </h3>
        <p className="text-brand-white/40 text-sm mt-2">
          A confirmation email has been sent to you.
        </p>
      </div>

      {/* Meeting details */}
      <div className="border border-red/25 bg-red/5 p-6 space-y-3">
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <div>
            <div className="text-white/35 text-[9px] tracking-[0.3em] uppercase mb-1">Reference</div>
            <div className="text-red font-medium">{confirmation.bookingRef}</div>
          </div>
          <div>
            <div className="text-white/35 text-[9px] tracking-[0.3em] uppercase mb-1">Meeting Type</div>
            <div className="text-brand-white">{typeLabel}</div>
          </div>
          <div>
            <div className="text-white/35 text-[9px] tracking-[0.3em] uppercase mb-1">Date</div>
            <div className="text-brand-white">{formattedDate}</div>
          </div>
          <div>
            <div className="text-white/35 text-[9px] tracking-[0.3em] uppercase mb-1">Time</div>
            <div className="text-brand-white">{formattedTime}</div>
          </div>
          <div>
            <div className="text-white/35 text-[9px] tracking-[0.3em] uppercase mb-1">Duration</div>
            <div className="text-brand-white">{confirmation.durationMinutes} minutes</div>
          </div>
          <div>
            <div className="text-white/35 text-[9px] tracking-[0.3em] uppercase mb-1">Timezone</div>
            <div className="text-brand-white text-xs">{timezone}</div>
          </div>
        </div>

        {confirmation.meetingUrl && (
          <div className="pt-3 border-t border-red/15">
            <div className="text-white/35 text-[9px] tracking-[0.3em] uppercase mb-1">Meeting Link</div>
            <a
              href={confirmation.meetingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red text-sm hover:underline break-all"
            >
              {confirmation.meetingUrl}
            </a>
          </div>
        )}
      </div>

      {/* Calendar buttons */}
      <div className="flex flex-wrap gap-3">
        <a
          href={buildGoogleCalendarUrl(confirmation, timezone)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-3 border border-white/15 text-white/70 text-[11px] tracking-[0.2em] uppercase hover:border-white/40 hover:text-white transition-all duration-200 rounded-xs"
        >
          Add to Google Calendar
        </a>
        <a
          href={buildOutlookUrl(confirmation)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-3 border border-white/15 text-white/70 text-[11px] tracking-[0.2em] uppercase hover:border-white/40 hover:text-white transition-all duration-200 rounded-xs"
        >
          Add to Outlook
        </a>
        <a
          href={`/api/meetings/${confirmation.id}/ics`}
          className="flex items-center gap-2 px-5 py-3 border border-white/15 text-white/70 text-[11px] tracking-[0.2em] uppercase hover:border-white/40 hover:text-white transition-all duration-200 rounded-xs"
          download
        >
          Download .ics
        </a>
      </div>

      {/* Back home */}
      <a
        href="/"
        className="inline-flex items-center gap-2 text-red text-[11px] tracking-[0.25em] uppercase hover:gap-4 transition-all duration-300"
      >
        Back to Home <span>→</span>
      </a>
    </div>
  );
}
```

---

## Task 11: Wire Scheduler into BookingForm + ContactForm

**Files:**
- Modify: `app/packages/[slug]/BookingForm.tsx`
- Modify: `app/components/ContactForm.tsx`

Both forms currently have `"idle" | "submitting" | "sent" | "error"` states. We extend them to `"idle" | "submitting" | "scheduling" | "confirmed" | "error"`.

- [ ] **Step 1: Replace `app/packages/[slug]/BookingForm.tsx`**

```tsx
// app/packages/[slug]/BookingForm.tsx
"use client";

import { useState } from "react";
import SchedulerStep from "@/app/components/SchedulerStep";
import ConfirmationStep from "@/app/components/ConfirmationStep";
import type { MeetingConfirmation } from "@/types/meeting";

const inputClass =
  "w-full bg-transparent border-b border-white/14 focus:border-red text-brand-white text-sm py-3 outline-none placeholder:text-brand-white/20 transition-colors duration-200 caret-red";
const labelClass =
  "block text-brand-white/35 text-[9px] tracking-[0.3em] uppercase mb-2";

type Props = {
  packageName: string;
  packagePrice: string;
  packageDeposit: string | null;
  service: string;
};

type Step = "form" | "submitting" | "scheduling" | "confirmed" | "error";

export default function BookingForm({
  packageName,
  packagePrice,
  packageDeposit,
  service,
}: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [step, setStep] = useState<Step>("form");
  const [errorMsg, setErrorMsg] = useState("");
  const [submissionId, setSubmissionId] = useState<number>(0);
  const [bookingRef, setBookingRef] = useState("");
  const [timezone, setTimezone] = useState(() => {
    try { return Intl.DateTimeFormat().resolvedOptions().timeZone; } catch { return "America/New_York"; }
  });
  const [confirmation, setConfirmation] = useState<MeetingConfirmation | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStep("submitting");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: name,
          email,
          phone,
          socialHandle: null,
          companyName: company || null,
          service,
          budget: null,
          packageName,
          packagePrice,
          packageDeposit,
          message,
          timezone,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setSubmissionId(data.submissionId ?? 0);
        setBookingRef(data.bookingRef ?? "");
        setStep("scheduling");
      } else {
        const data = await res.json();
        setErrorMsg(data.error ?? "Something went wrong. Please try again.");
        setStep("error");
      }
    } catch {
      setErrorMsg("Network error. Please check your connection and try again.");
      setStep("error");
    }
  }

  if (step === "scheduling") {
    return (
      <SchedulerStep
        submissionId={submissionId}
        bookingRef={bookingRef}
        clientName={name}
        packageName={packageName}
        onConfirmed={(c) => {
          setConfirmation(c);
          setStep("confirmed");
        }}
      />
    );
  }

  if (step === "confirmed" && confirmation) {
    return <ConfirmationStep confirmation={confirmation} timezone={timezone} />;
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      {/* Selected package — read-only */}
      <div className="border border-red/30 bg-red/5 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-red text-[9px] tracking-[0.35em] uppercase mb-1">Selected Package</div>
          <div className="text-brand-white font-medium text-sm">{packageName}</div>
        </div>
        <div
          className="font-display text-brand-white leading-none shrink-0"
          style={{ fontSize: "clamp(24px, 2.5vw, 36px)" }}
        >
          {packagePrice}
        </div>
      </div>

      {/* Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8">
        <div>
          <label htmlFor="bf-name" className={labelClass}>Full Name <span className="text-red">*</span></label>
          <input id="bf-name" type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="John Smith" className={inputClass} />
        </div>
        <div>
          <label htmlFor="bf-email" className={labelClass}>Email Address <span className="text-red">*</span></label>
          <input id="bf-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@company.com" className={inputClass} />
        </div>
        <div>
          <label htmlFor="bf-phone" className={labelClass}>Phone Number <span className="text-red">*</span></label>
          <input id="bf-phone" type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (305) 000-0000" className={inputClass} />
        </div>
        <div>
          <label htmlFor="bf-company" className={labelClass}>Company / Brand Name</label>
          <input id="bf-company" type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Your Brand" className={inputClass} />
        </div>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="bf-message" className={labelClass}>Tell Us About Your Project <span className="text-red">*</span></label>
        <textarea
          id="bf-message" required rows={5}
          value={message} onChange={(e) => setMessage(e.target.value)}
          placeholder="Share your vision, preferred dates, locations, or any special requirements..."
          className={`${inputClass} resize-none`}
        />
      </div>

      {/* Honeypot (hidden) */}
      <input type="text" name="website" tabIndex={-1} aria-hidden="true" style={{ position: "absolute", left: "-9999px" }} />

      {step === "error" && <p className="text-red text-xs tracking-wide">{errorMsg}</p>}

      <button
        type="submit"
        disabled={step === "submitting"}
        className="flex items-center gap-3 bg-red text-brand-white text-[11px] tracking-[0.22em] uppercase px-10 py-4 rounded-xs hover:bg-[#FF001F] hover:-translate-y-px hover:shadow-[0_6px_20px_rgba(229,0,25,0.35)] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300"
        style={{ transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)" }}
      >
        {step === "submitting" ? (
          <><span className="inline-block w-3 h-3 border border-white/40 border-t-white rounded-full animate-spin" aria-hidden="true" />Sending...</>
        ) : (
          <>Book Package <span className="text-sm">→</span></>
        )}
      </button>
    </form>
  );
}
```

- [ ] **Step 2: Update `app/components/ContactForm.tsx` — add scheduling states**

The ContactForm.tsx already has its own `"idle" | "submitting" | "sent" | "error"` state. Replace the `status` state type and the `"sent"` JSX block with the three-step flow. The form body remains identical. Key changes only:

1. Add imports at top:
```tsx
import SchedulerStep from "@/app/components/SchedulerStep";
import ConfirmationStep from "@/app/components/ConfirmationStep";
import type { MeetingConfirmation } from "@/types/meeting";
```

2. Change state:
```tsx
// Replace:
const [status, setStatus] = useState<"idle" | "submitting" | "sent" | "error">("idle");
// With:
type Step = "form" | "submitting" | "scheduling" | "confirmed" | "error";
const [step, setStep] = useState<Step>("form");
const [submissionId, setSubmissionId] = useState<number>(0);
const [bookingRef, setBookingRef] = useState("");
const [timezone] = useState(() => {
  try { return Intl.DateTimeFormat().resolvedOptions().timeZone; } catch { return "America/New_York"; }
});
const [confirmation, setConfirmation] = useState<MeetingConfirmation | null>(null);
```

3. Update `handleSubmit` — change `if (res.ok) { setStatus("sent") }` to:
```tsx
if (res.ok) {
  const data = await res.json();
  setSubmissionId(data.submissionId ?? 0);
  setBookingRef(data.bookingRef ?? "");
  setStep("scheduling");
} else {
  const data = await res.json();
  setErrorMsg(data.error ?? "Something went wrong.");
  setStep("error");
}
```
Also change catch: `setStep("error")`

4. Replace the `status === "sent"` early-return block with:
```tsx
if (step === "scheduling") {
  return (
    <SchedulerStep
      submissionId={submissionId}
      bookingRef={bookingRef}
      clientName={name}
      onConfirmed={(c) => { setConfirmation(c); setStep("confirmed"); }}
    />
  );
}
if (step === "confirmed" && confirmation) {
  return <ConfirmationStep confirmation={confirmation} timezone={timezone} />;
}
```

5. Add honeypot field inside the `<form>` (before closing tag):
```tsx
<input type="text" name="website" tabIndex={-1} aria-hidden="true" style={{ position: "absolute", left: "-9999px" }} />
```

6. Update all `status === "submitting"` checks to `step === "submitting"`, `status === "error"` to `step === "error"`, form `onSubmit` to update `step` instead of `status`.

- [ ] **Step 3: Test the full booking → scheduling flow**

1. Run `npm run dev`
2. Navigate to any package page (e.g. `/packages/1`)
3. Fill out the BookingForm and submit
4. Verify the form transitions to the scheduler (no page reload)
5. Select a meeting type, duration, timezone
6. Click a date on the calendar
7. Verify time slots load
8. Select a time slot and click "Confirm Meeting"
9. Verify the confirmation screen shows with the booking reference, date/time, and calendar links
10. Click "Download .ics" and verify the file opens in your calendar app

---

## Task 12: Admin Meetings API + UI

**Files:**
- Create: `app/api/admin/meetings/route.ts`
- Create: `app/api/admin/meetings/[id]/route.ts`
- Create: `app/admin/(dashboard)/meetings/page.tsx`
- Create: `app/admin/(dashboard)/meetings/MeetingsManager.tsx`
- Modify: `app/admin/components/AdminSidebar.tsx`
- Modify: `app/admin/(dashboard)/page.tsx`

- [ ] **Step 1: Create `app/api/admin/meetings/route.ts`**

```typescript
// app/api/admin/meetings/route.ts
import { db } from "@/lib/db";
import { meetings, contactSubmissions } from "@/lib/schema";
import { eq, desc, ilike, sql, and, or } from "drizzle-orm";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10));
  const limit = 20;
  const offset = (page - 1) * limit;
  const search = url.searchParams.get("search") ?? "";
  const status = url.searchParams.get("status") ?? "";

  const conditions = [];
  if (status && status !== "all") {
    conditions.push(eq(meetings.status, status));
  }

  const rows = await db
    .select({
      meeting: meetings,
      clientName: contactSubmissions.fullName,
      clientEmail: contactSubmissions.email,
      packageName: contactSubmissions.packageName,
    })
    .from(meetings)
    .leftJoin(contactSubmissions, eq(meetings.submissionId, contactSubmissions.id))
    .where(
      conditions.length > 0
        ? and(...conditions)
        : undefined
    )
    .orderBy(desc(meetings.meetingDate))
    .limit(limit)
    .offset(offset);

  const [{ total }] = await db
    .select({ total: sql<number>`count(*)` })
    .from(meetings);

  // Stats
  const [stats] = await db
    .select({
      scheduled: sql<number>`count(*) filter (where status = 'scheduled')`,
      confirmed: sql<number>`count(*) filter (where status = 'confirmed')`,
      completed: sql<number>`count(*) filter (where status = 'completed')`,
      cancelled: sql<number>`count(*) filter (where status = 'cancelled')`,
      noShow: sql<number>`count(*) filter (where status = 'no-show')`,
    })
    .from(meetings);

  return Response.json({
    meetings: rows,
    total: Number(total),
    page,
    limit,
    stats: {
      scheduled: Number(stats?.scheduled ?? 0),
      confirmed: Number(stats?.confirmed ?? 0),
      completed: Number(stats?.completed ?? 0),
      cancelled: Number(stats?.cancelled ?? 0),
      noShow: Number(stats?.noShow ?? 0),
    },
  });
}
```

- [ ] **Step 2: Create `app/api/admin/meetings/[id]/route.ts`**

```typescript
// app/api/admin/meetings/[id]/route.ts
import { db } from "@/lib/db";
import { meetings, contactSubmissions, bookingStatusHistory } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { logActivity } from "@/lib/logger";
import { updateMeetingSchema } from "@/lib/validators/meeting";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const meetingId = parseInt(id, 10);
  if (isNaN(meetingId)) {
    return Response.json({ error: "Invalid ID." }, { status: 400 });
  }

  const body = await request.json();
  const parsed = updateMeetingSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input." },
      { status: 400 }
    );
  }

  const [existing] = await db
    .select()
    .from(meetings)
    .where(eq(meetings.id, meetingId))
    .limit(1);

  if (!existing) {
    return Response.json({ error: "Meeting not found." }, { status: 404 });
  }

  await db
    .update(meetings)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(meetings.id, meetingId));

  // Track status change
  if (parsed.data.status && parsed.data.status !== existing.status) {
    await db.insert(bookingStatusHistory).values({
      submissionId: existing.submissionId,
      fromStatus: existing.status,
      toStatus: parsed.data.status,
      changedBy: "admin",
      notes: parsed.data.notes ?? parsed.data.cancelReason,
    });

    await db
      .update(contactSubmissions)
      .set({ bookingStatus: parsed.data.status })
      .where(eq(contactSubmissions.id, existing.submissionId));
  }

  await logActivity(
    "meeting",
    `Meeting ${existing.bookingRef} updated by admin`,
    { meetingId, changes: parsed.data }
  );

  return Response.json({ success: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const meetingId = parseInt(id, 10);
  if (isNaN(meetingId)) {
    return Response.json({ error: "Invalid ID." }, { status: 400 });
  }

  const [existing] = await db
    .select()
    .from(meetings)
    .where(eq(meetings.id, meetingId))
    .limit(1);

  if (!existing) {
    return Response.json({ error: "Meeting not found." }, { status: 404 });
  }

  await db
    .update(meetings)
    .set({ status: "cancelled", updatedAt: new Date() })
    .where(eq(meetings.id, meetingId));

  return Response.json({ success: true });
}
```

- [ ] **Step 3: Create `app/admin/(dashboard)/meetings/page.tsx`**

```typescript
// app/admin/(dashboard)/meetings/page.tsx
import type { Metadata } from "next";
import MeetingsManager from "./MeetingsManager";

export const metadata: Metadata = { title: "Meetings — diEntertainment Admin" };

export default function MeetingsPage() {
  return <MeetingsManager />;
}
```

- [ ] **Step 4: Create `app/admin/(dashboard)/meetings/MeetingsManager.tsx`**

```tsx
// app/admin/(dashboard)/meetings/MeetingsManager.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import type { MeetingStatus, MeetingType } from "@/types/meeting";
import { MEETING_TYPE_LABELS, MEETING_STATUS_LABELS } from "@/types/meeting";

interface MeetingRow {
  meeting: {
    id: number;
    bookingRef: string;
    meetingDate: string;
    meetingEndDate: string;
    timezone: string;
    durationMinutes: number;
    meetingType: string;
    status: string;
    meetingUrl: string | null;
    assignedTo: string | null;
    notes: string | null;
  };
  clientName: string | null;
  clientEmail: string | null;
  packageName: string | null;
}

interface Stats {
  scheduled: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  noShow: number;
}

const STATUS_COLORS: Record<string, string> = {
  scheduled: "bg-blue-500/15 text-blue-400",
  confirmed: "bg-green-500/15 text-green-400",
  completed: "bg-white/10 text-white/50",
  cancelled: "bg-red/10 text-red",
  "no-show": "bg-yellow-500/10 text-yellow-400",
};

export default function MeetingsManager() {
  const [rows, setRows] = useState<MeetingRow[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<number | null>(null);
  const [editStatus, setEditStatus] = useState<MeetingStatus>("scheduled");
  const [editNotes, setEditNotes] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  const fetchMeetings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/meetings?page=${page}&status=${filter}`);
      const data = await res.json();
      setRows(data.meetings ?? []);
      setTotal(data.total ?? 0);
      setStats(data.stats ?? null);
    } finally {
      setLoading(false);
    }
  }, [page, filter]);

  useEffect(() => { fetchMeetings(); }, [fetchMeetings]);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  function openEdit(row: MeetingRow) {
    setEditId(row.meeting.id);
    setEditStatus(row.meeting.status as MeetingStatus);
    setEditNotes(row.meeting.notes ?? "");
    setEditUrl(row.meeting.meetingUrl ?? "");
  }

  async function saveEdit() {
    if (!editId) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/meetings/${editId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: editStatus,
          notes: editNotes || null,
          meetingUrl: editUrl || null,
        }),
      });
      if (res.ok) {
        setEditId(null);
        showToast("Meeting updated.");
        fetchMeetings();
      }
    } finally {
      setSaving(false);
    }
  }

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="p-4 sm:p-8">
      {toast && (
        <div className="fixed top-4 right-4 bg-green-500/90 text-white text-sm px-4 py-2.5 rounded-lg z-50">
          {toast}
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Meetings</h1>
        <p className="text-white/40 text-sm mt-1">Manage scheduled calls and meetings.</p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          {[
            { label: "Scheduled", value: stats.scheduled, color: "text-blue-400" },
            { label: "Confirmed", value: stats.confirmed, color: "text-green-400" },
            { label: "Completed", value: stats.completed, color: "text-white/60" },
            { label: "Cancelled", value: stats.cancelled, color: "text-red" },
            { label: "No Show", value: stats.noShow, color: "text-yellow-400" },
          ].map((s) => (
            <div key={s.label} className="bg-[#111] border border-white/8 rounded-xl p-4">
              <p className="text-xs text-white/40 uppercase tracking-widest mb-1">{s.label}</p>
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {["all", "scheduled", "confirmed", "completed", "cancelled", "no-show"].map((s) => (
          <button
            key={s}
            onClick={() => { setFilter(s); setPage(1); }}
            className={`px-3 py-1.5 text-xs rounded capitalize transition-colors ${
              filter === s
                ? "bg-white/15 text-white"
                : "text-white/40 hover:text-white hover:bg-white/8"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#111] border border-white/8 rounded-xl overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-white/30 text-sm">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="py-12 text-center text-white/30 text-sm">No meetings found.</div>
        ) : (
          <div className="divide-y divide-white/5">
            {rows.map(({ meeting, clientName, clientEmail, packageName }) => (
              <div key={meeting.id} className="px-4 sm:px-6 py-4 flex items-start justify-between gap-4 flex-wrap">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-sm font-medium text-white">{clientName ?? "Unknown"}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full capitalize ${STATUS_COLORS[meeting.status] ?? ""}`}>
                      {MEETING_STATUS_LABELS[meeting.status as MeetingStatus] ?? meeting.status}
                    </span>
                  </div>
                  <p className="text-xs text-white/40">{clientEmail}</p>
                  <p className="text-xs text-white/30 mt-0.5">
                    {MEETING_TYPE_LABELS[meeting.meetingType as MeetingType] ?? meeting.meetingType}
                    {" · "}
                    {meeting.durationMinutes}min
                    {" · "}
                    {new Date(meeting.meetingDate).toLocaleDateString("en-US", {
                      timeZone: meeting.timezone,
                      month: "short", day: "numeric", year: "numeric",
                    })}
                    {" "}
                    {new Date(meeting.meetingDate).toLocaleTimeString("en-US", {
                      timeZone: meeting.timezone,
                      hour: "numeric", minute: "2-digit",
                    })}
                  </p>
                  <p className="text-[10px] text-red mt-0.5">{meeting.bookingRef}</p>
                </div>
                <button
                  onClick={() => openEdit({ meeting, clientName, clientEmail, packageName })}
                  className="text-xs text-white/40 hover:text-white border border-white/10 hover:border-white/25 px-3 py-1.5 rounded transition-colors shrink-0"
                >
                  Edit
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex gap-2 mt-4 justify-end">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
            className="px-3 py-1.5 text-xs text-white/40 hover:text-white disabled:opacity-30 border border-white/10 rounded transition-colors">
            ← Prev
          </button>
          <span className="px-3 py-1.5 text-xs text-white/40">{page} / {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
            className="px-3 py-1.5 text-xs text-white/40 hover:text-white disabled:opacity-30 border border-white/10 rounded transition-colors">
            Next →
          </button>
        </div>
      )}

      {/* Edit modal */}
      {editId !== null && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] border border-white/12 rounded-xl p-6 w-full max-w-md space-y-4">
            <h2 className="text-lg font-bold text-white">Update Meeting</h2>
            <div>
              <label className="block text-xs text-white/40 mb-1 uppercase tracking-widest">Status</label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value as MeetingStatus)}
                className="w-full bg-[#1a1a1a] border border-white/12 text-white text-sm py-2.5 px-3 rounded-lg outline-none"
              >
                {["scheduled","confirmed","completed","cancelled","no-show"].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1 uppercase tracking-widest">Meeting URL</label>
              <input
                type="url"
                value={editUrl}
                onChange={(e) => setEditUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-[#1a1a1a] border border-white/12 text-white text-sm py-2.5 px-3 rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1 uppercase tracking-widest">Notes</label>
              <textarea
                rows={3}
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-white/12 text-white text-sm py-2.5 px-3 rounded-lg outline-none resize-none"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={saveEdit}
                disabled={saving}
                className="flex-1 bg-red text-white text-sm py-2.5 rounded-lg hover:bg-[#FF001F] disabled:opacity-50 transition-colors"
              >
                {saving ? "Saving…" : "Save Changes"}
              </button>
              <button
                onClick={() => setEditId(null)}
                className="flex-1 border border-white/15 text-white/60 text-sm py-2.5 rounded-lg hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Add "Meetings" link to `app/admin/components/AdminSidebar.tsx`**

In the `groups` array, find the `"Engagement"` group and add a Meetings link after Submissions:

```tsx
{ href: "/admin/meetings", label: "Meetings", icon: (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="8" cy="5" r="2" stroke="currentColor" strokeWidth="1.3" />
    <circle cx="3" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.3" />
    <circle cx="13" cy="6" r="1.5" stroke="currentColor" strokeWidth="1.3" />
    <path d="M1 14c0-2 .9-3 2-3.5M15 14c0-2-.9-3-2-3.5M5 14c0-2.5 1.3-4 3-4s3 1.5 3 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
)},
```

- [ ] **Step 6: Update `app/admin/(dashboard)/page.tsx` — add meetings count**

Add to the `getCounts()` function:
```typescript
import { meetings } from "@/lib/schema";
// Inside getCounts(), add:
const [mtgs] = await db.select({ count: sql<number>`count(*)` }).from(meetings);
// In return:
return { ..., meetings: Number(mtgs[0]?.count ?? 0) };
```

Add to `statCards`:
```typescript
{ label: "Meetings", key: "meetings" as const, href: "/admin/meetings", color: "text-blue-400" },
```

- [ ] **Step 7: Test admin meetings**

1. Navigate to `http://localhost:3000/admin/meetings`
2. Verify the stats cards show counts
3. Verify the meetings list renders (after scheduling a test meeting)
4. Click "Edit" on a meeting and change its status
5. Verify the change is saved

---

## Task 13: Admin Availability Manager

**Files:**
- Create: `app/api/admin/availability/route.ts`
- Create: `app/admin/(dashboard)/availability/page.tsx`
- Create: `app/admin/(dashboard)/availability/AvailabilityManager.tsx`

Extend AdminSidebar with an "Availability" link under System group.

- [ ] **Step 1: Create `app/api/admin/availability/route.ts`**

```typescript
// app/api/admin/availability/route.ts
import { db } from "@/lib/db";
import { availabilityRules, blackoutDates } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

export async function GET() {
  const [rules, blackouts] = await Promise.all([
    db.select().from(availabilityRules).orderBy(availabilityRules.dayOfWeek),
    db.select().from(blackoutDates).orderBy(blackoutDates.date),
  ]);
  return Response.json({ rules, blackouts });
}

const ruleSchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
  breakStart: z.string().regex(/^\d{2}:\d{2}$/).nullable().optional(),
  breakEnd: z.string().regex(/^\d{2}:\d{2}$/).nullable().optional(),
  isActive: z.boolean(),
});

export async function PUT(request: Request) {
  const body = await request.json();

  const { action } = body;

  if (action === "update-rule") {
    const { id, ...rest } = body;
    const parsed = ruleSchema.safeParse(rest);
    if (!parsed.success) {
      return Response.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
    }
    await db.update(availabilityRules).set(parsed.data).where(eq(availabilityRules.id, id));
    return Response.json({ success: true });
  }

  if (action === "add-blackout") {
    const { date, reason } = body;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date ?? "")) {
      return Response.json({ error: "Invalid date format." }, { status: 400 });
    }
    await db.insert(blackoutDates).values({ date, reason: reason || null });
    return Response.json({ success: true });
  }

  if (action === "remove-blackout") {
    const { id } = body;
    await db.delete(blackoutDates).where(eq(blackoutDates.id, id));
    return Response.json({ success: true });
  }

  return Response.json({ error: "Unknown action." }, { status: 400 });
}
```

- [ ] **Step 2: Create `app/admin/(dashboard)/availability/page.tsx`**

```typescript
// app/admin/(dashboard)/availability/page.tsx
import type { Metadata } from "next";
import AvailabilityManager from "./AvailabilityManager";

export const metadata: Metadata = { title: "Availability — diEntertainment Admin" };

export default function AvailabilityPage() {
  return <AvailabilityManager />;
}
```

- [ ] **Step 3: Create `app/admin/(dashboard)/availability/AvailabilityManager.tsx`**

```tsx
// app/admin/(dashboard)/availability/AvailabilityManager.tsx
"use client";

import { useState, useEffect } from "react";

interface Rule {
  id: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  breakStart: string | null;
  breakEnd: string | null;
  isActive: boolean;
}

interface Blackout {
  id: number;
  date: string;
  reason: string | null;
}

const DAY_NAMES = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

export default function AvailabilityManager() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [blackouts, setBlackouts] = useState<Blackout[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);
  const [newBlackoutDate, setNewBlackoutDate] = useState("");
  const [newBlackoutReason, setNewBlackoutReason] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    fetch("/api/admin/availability")
      .then((r) => r.json())
      .then((d) => { setRules(d.rules ?? []); setBlackouts(d.blackouts ?? []); })
      .finally(() => setLoading(false));
  }, []);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  async function updateRule(rule: Rule) {
    setSaving(rule.id);
    await fetch("/api/admin/availability", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update-rule", id: rule.id, ...rule }),
    });
    setSaving(null);
    showToast("Rule saved.");
  }

  function patchRule(id: number, patch: Partial<Rule>) {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  async function addBlackout() {
    if (!newBlackoutDate) return;
    await fetch("/api/admin/availability", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "add-blackout", date: newBlackoutDate, reason: newBlackoutReason }),
    });
    const res = await fetch("/api/admin/availability");
    const d = await res.json();
    setBlackouts(d.blackouts ?? []);
    setNewBlackoutDate("");
    setNewBlackoutReason("");
    showToast("Blackout date added.");
  }

  async function removeBlackout(id: number) {
    await fetch("/api/admin/availability", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "remove-blackout", id }),
    });
    setBlackouts((prev) => prev.filter((b) => b.id !== id));
    showToast("Blackout date removed.");
  }

  if (loading) {
    return <div className="p-8 text-white/30 text-sm">Loading availability settings…</div>;
  }

  return (
    <div className="p-4 sm:p-8 space-y-8">
      {toast && (
        <div className="fixed top-4 right-4 bg-green-500/90 text-white text-sm px-4 py-2.5 rounded-lg z-50">{toast}</div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-white">Availability</h1>
        <p className="text-white/40 text-sm mt-1">Configure working hours and unavailable dates.</p>
      </div>

      {/* Working hours */}
      <div className="bg-[#111] border border-white/8 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/8">
          <h2 className="text-sm font-semibold text-white">Working Hours</h2>
          <p className="text-white/30 text-xs mt-1">All times are in Eastern Time (ET) business hours.</p>
        </div>
        <div className="divide-y divide-white/5">
          {rules.map((rule) => (
            <div key={rule.id} className="px-6 py-4 flex items-center gap-4 flex-wrap">
              <div className="w-24">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rule.isActive}
                    onChange={(e) => patchRule(rule.id, { isActive: e.target.checked })}
                    className="accent-red"
                  />
                  <span className="text-sm text-white">{DAY_NAMES[rule.dayOfWeek]}</span>
                </label>
              </div>
              {rule.isActive && (
                <>
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <input
                      type="time"
                      value={rule.startTime}
                      onChange={(e) => patchRule(rule.id, { startTime: e.target.value })}
                      className="bg-[#1a1a1a] border border-white/12 rounded px-2 py-1 text-white text-xs"
                    />
                    <span>–</span>
                    <input
                      type="time"
                      value={rule.endTime}
                      onChange={(e) => patchRule(rule.id, { endTime: e.target.value })}
                      className="bg-[#1a1a1a] border border-white/12 rounded px-2 py-1 text-white text-xs"
                    />
                  </div>
                  <div className="flex items-center gap-1 text-xs text-white/30">
                    Break:
                    <input
                      type="time"
                      value={rule.breakStart ?? ""}
                      onChange={(e) => patchRule(rule.id, { breakStart: e.target.value || null })}
                      className="bg-[#1a1a1a] border border-white/12 rounded px-2 py-1 text-white"
                    />
                    <span>–</span>
                    <input
                      type="time"
                      value={rule.breakEnd ?? ""}
                      onChange={(e) => patchRule(rule.id, { breakEnd: e.target.value || null })}
                      className="bg-[#1a1a1a] border border-white/12 rounded px-2 py-1 text-white"
                    />
                  </div>
                  <button
                    onClick={() => updateRule(rule)}
                    disabled={saving === rule.id}
                    className="ml-auto text-xs px-3 py-1.5 border border-white/15 text-white/50 hover:text-white rounded transition-colors disabled:opacity-40"
                  >
                    {saving === rule.id ? "Saving…" : "Save"}
                  </button>
                </>
              )}
              {!rule.isActive && (
                <span className="text-xs text-white/20 ml-2">Unavailable</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Blackout dates */}
      <div className="bg-[#111] border border-white/8 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/8">
          <h2 className="text-sm font-semibold text-white">Blackout Dates</h2>
          <p className="text-white/30 text-xs mt-1">Add holidays or any dates when you're unavailable.</p>
        </div>

        {/* Add new blackout */}
        <div className="px-6 py-4 border-b border-white/5 flex gap-3 flex-wrap items-end">
          <div>
            <label className="block text-xs text-white/30 mb-1">Date</label>
            <input
              type="date"
              value={newBlackoutDate}
              onChange={(e) => setNewBlackoutDate(e.target.value)}
              className="bg-[#1a1a1a] border border-white/12 rounded px-3 py-2 text-white text-sm"
            />
          </div>
          <div className="flex-1 min-w-32">
            <label className="block text-xs text-white/30 mb-1">Reason (optional)</label>
            <input
              type="text"
              value={newBlackoutReason}
              onChange={(e) => setNewBlackoutReason(e.target.value)}
              placeholder="Holiday, vacation, etc."
              className="w-full bg-[#1a1a1a] border border-white/12 rounded px-3 py-2 text-white text-sm"
            />
          </div>
          <button
            onClick={addBlackout}
            disabled={!newBlackoutDate}
            className="px-4 py-2 bg-red text-white text-sm rounded hover:bg-[#FF001F] disabled:opacity-40 transition-colors"
          >
            Add
          </button>
        </div>

        {blackouts.length === 0 ? (
          <p className="px-6 py-6 text-white/25 text-sm">No blackout dates.</p>
        ) : (
          <div className="divide-y divide-white/5">
            {blackouts.map((b) => (
              <div key={b.id} className="px-6 py-3 flex items-center justify-between">
                <div>
                  <span className="text-sm text-white">{b.date}</span>
                  {b.reason && <span className="text-xs text-white/35 ml-3">{b.reason}</span>}
                </div>
                <button
                  onClick={() => removeBlackout(b.id)}
                  className="text-xs text-white/30 hover:text-red transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Add "Availability" link to `AdminSidebar.tsx`**

In the `"System"` group, add an Availability link:
```tsx
{ href: "/admin/availability", label: "Availability", icon: (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <rect x="2" y="2" width="12" height="12" rx="1.2" stroke="currentColor" strokeWidth="1.3" />
    <path d="M2 6h12" stroke="currentColor" strokeWidth="1.3" />
    <path d="M5 1v2M11 1v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    <path d="M5 9.5h2M9 9.5h2M5 12h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
)},
```

- [ ] **Step 5: Verify admin pages**

1. Navigate to `http://localhost:3000/admin/availability`
2. Verify Mon–Fri rules are displayed with time inputs
3. Toggle a day off and save — verify it's persisted
4. Add a blackout date and verify it appears (and disappears from slot generation)
5. Navigate to `http://localhost:3000/admin/meetings` and verify the meetings list loads

---

## Self-Review: Spec Coverage Checklist

| Requirement | Task | Status |
|-------------|------|--------|
| Client-side + server-side validation | T2 (Zod validators) + T8 (API) | ✅ |
| Email validation, phone validation | T2 (Zod schema) | ✅ |
| Spam protection (honeypot) | T8 | ✅ |
| Duplicate submission prevention | T8 | ✅ |
| Unique booking ID, booking status | T1 (schema) + T8 (API) | ✅ |
| Preferred timezone, referral source stored | T1 (schema) + T8 (API) | ✅ |
| Booking status defaults to "Pending Scheduling" | T8 | ✅ |
| Seamless post-submission scheduler (no reload) | T10 + T11 | ✅ |
| Meeting type selection (6 types) | T10 (SchedulerStep) | ✅ |
| Duration selection (15/30/45/60 min) | T10 | ✅ |
| Timezone selection | T10 | ✅ |
| Date + time slot selection | T10 (CalendarPicker, TimeSlotGrid) | ✅ |
| Prevent double booking | T3 (availability service checks existing meetings) | ✅ |
| Prevent past dates, weekends | T10 (CalendarPicker) + T3 (availability service) | ✅ |
| Blackout dates | T13 (admin UI) + T3 (availability service) | ✅ |
| Configurable working hours + lunch break | T13 (admin UI) + T3 (availability service) | ✅ |
| Calendar provider abstraction | T4 | ✅ |
| Internal availability fallback | T4 (InternalCalendarProvider) | ✅ |
| Meeting platform provider abstraction | T4 | ✅ |
| Custom meeting URL support | T4 (CustomMeetingPlatformProvider) | ✅ |
| Confirmation screen with meeting details | T10 (ConfirmationStep) | ✅ |
| Add to Google Calendar button | T10 (ConfirmationStep) | ✅ |
| Add to Outlook Calendar button | T10 (ConfirmationStep) | ✅ |
| Download ICS file | T5 + T10 | ✅ |
| Booking received email to client | T9 + T8 | ✅ |
| Meeting confirmation email to client | T9 + T7 | ✅ |
| Calendar invite attachment | T5 (ICS download URL in email) | ✅ |
| Admin email on new meeting | T9 | ✅ |
| Status lifecycle tracking | T1 (bookingStatusHistory) + T6 (meeting.service) | ✅ |
| Admin meetings list + stats | T12 | ✅ |
| Admin: filter/sort/update/cancel meetings | T12 | ✅ |
| Admin: change meeting status, add notes, update URL | T12 | ✅ |
| Admin availability configuration | T13 | ✅ |
| Security: rate limiting on public APIs | T7, T8 | ✅ |
| Security: Zod validation on all inputs | T2, T7, T8 | ✅ |
| Security: audit logging | T7, T12 | ✅ |
| Security: XSS prevention (email esc()) | T9 | ✅ |
| Loading states, smooth transitions (no flash) | T10, T11 | ✅ |
| Mobile-first, responsive layout | T10 (grid-cols-2 → sm:grid-cols-*) | ✅ |
| Accessibility (labels, aria-pressed, aria-label) | T10 | ✅ |
| Booking status history | T1 (table) + T6, T12 (insert on change) | ✅ |
| Admin dashboard meetings count | T12 (step 6) | ✅ |

### Not Implemented (Requires External Infrastructure)

| Feature | Reason | Future Path |
|---------|---------|------------|
| Scheduled reminder emails (24h, 1h before) | Requires cron/queue (Vercel Cron, Upstash QStash) not in current stack | Add `POST /api/admin/meetings/[id]/remind` + Vercel Cron job at `/api/cron/reminders` |
| Google Calendar OAuth sync | Requires OAuth client ID, refresh token flow | Implement `GoogleCalendarProvider` in `lib/services/calendar/google.provider.ts` using `googleapis` package |
| Zoom meeting auto-creation | Requires Zoom OAuth App | Implement `ZoomMeetingProvider` in `lib/services/meeting-platform/zoom.provider.ts` |
| SMS notifications | Requires Twilio/Vonage API keys | Implement `lib/services/sms/` with same provider pattern as calendar |
| Reschedule flow (client self-service) | Needs auth token for client | Add `GET /api/meetings/[id]?token=...` + reschedule page |

---

## Extension Guide

### Adding a Calendar Provider (e.g., Google Calendar)

1. Create `lib/services/calendar/google.provider.ts` implementing `CalendarProvider`
2. Install `googleapis` package
3. Add OAuth credentials to `.env` (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`)
4. In `lib/services/calendar/index.ts`, read `site_settings.calendar_provider` and return the new provider when the value is `"google"`
5. No changes needed to any API routes or business logic

### Adding a Meeting Platform (e.g., Zoom)

1. Create `lib/services/meeting-platform/zoom.provider.ts` implementing `MeetingPlatformProvider`
2. Install `axios` or use native `fetch`
3. Add Zoom credentials to `.env` (`ZOOM_ACCOUNT_ID`, `ZOOM_CLIENT_ID`, `ZOOM_CLIENT_SECRET`)
4. In `lib/services/meeting-platform/index.ts`, read `site_settings.meeting_platform` and return the Zoom provider
5. The `createMeeting()` service automatically uses the new provider — no other changes

### Adding an SMS Provider (e.g., Twilio)

1. Create `lib/services/sms/types.ts` with `SMSProvider` interface
2. Create `lib/services/sms/twilio.provider.ts`
3. Call `getSMSProvider().send(...)` from `sendMeetingConfirmation()` in `lib/email.ts`

### Adding Reminder Emails

1. Add a Vercel Cron job at `app/api/cron/reminders/route.ts` (GET, protected by `CRON_SECRET` header)
2. Query meetings where `meetingDate` is 24 hours or 1 hour from now and no reminder was sent
3. Add `reminderSent24h: boolean` and `reminderSent1h: boolean` columns to `meetings` table
4. Call `sendMeetingReminder()` from `lib/email.ts`
5. Configure in `vercel.json`: `{ "crons": [{ "path": "/api/cron/reminders", "schedule": "*/15 * * * *" }] }`

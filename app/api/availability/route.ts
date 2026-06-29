// app/api/availability/route.ts
import { getAvailableSlots } from "@/lib/services/availability.service";
import { checkRateLimit } from "@/lib/rate-limit";

const VALID_DURATIONS = new Set([15, 30, 45, 60]);

export async function GET(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const { allowed, retryAfter } = checkRateLimit(ip);
  if (!allowed) {
    return Response.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } }
    );
  }

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

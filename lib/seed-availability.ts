import "dotenv/config";
import { db } from "./db";
import { availabilityRules } from "./schema";

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

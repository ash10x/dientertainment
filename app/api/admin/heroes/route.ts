import { getAllPageHeroes } from "@/lib/queries";

export async function GET() {
  try {
    const rows = await getAllPageHeroes();
    return Response.json(rows);
  } catch {
    return Response.json({ error: "Failed to fetch heroes." }, { status: 500 });
  }
}

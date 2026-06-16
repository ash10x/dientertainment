import { getActiveServices } from "@/lib/queries";

export async function GET() {
  try {
    const rows = await getActiveServices();
    return Response.json(rows);
  } catch {
    return Response.json([], { status: 200 });
  }
}

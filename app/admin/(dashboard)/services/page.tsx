import { getAllServices } from "@/lib/queries";
import ServicesManager from "./ServicesManager";

export default async function ServicesPage() {
  const rows = await getAllServices();
  return <ServicesManager initialServices={rows} />;
}

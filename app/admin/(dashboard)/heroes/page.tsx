import { getAllPageHeroes } from "@/lib/queries";
import HeroesManager from "./HeroesManager";

export default async function HeroesPage() {
  const heroes = await getAllPageHeroes();
  return <HeroesManager initialHeroes={heroes} />;
}

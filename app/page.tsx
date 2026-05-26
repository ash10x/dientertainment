import Nav from "./components/Nav";
import Hero from "./components/Hero";
import MarqueeStrip from "./components/MarqueeStrip";
import Services from "./components/Services";
import Stats from "./components/Stats";
import Work from "./components/Work";
import WhyChooseUs from "./components/WhyChooseUs";
import About from "./components/About";
import FutureStatement from "./components/FutureStatement";
import ContactCTA from "./components/ContactCTA";
import Footer from "./components/Footer";
import { getStatsByPage } from "@/lib/queries";

export default async function Home() {
  const stats = await getStatsByPage("home");

  return (
    <main className="bg-brand-black">
      <Nav />
      <Hero />
      <MarqueeStrip />
      <Services />
      <Stats stats={stats} />
      <Work />
      <WhyChooseUs />
      <About />
      <FutureStatement />
      <ContactCTA />
      <Footer />
    </main>
  );
}

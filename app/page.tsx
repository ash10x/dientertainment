import Nav from "./components/Nav";
import Hero from "./components/Hero";
import MarqueeStrip from "./components/MarqueeStrip";
import Services from "./components/Services";
import Stats from "./components/Stats";
import Work from "./components/Work";
import About from "./components/About";
import ContactCTA from "./components/ContactCTA";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="bg-brand-black">
      <Nav />
      <Hero />
      <MarqueeStrip />
      <Services />
      <Stats />
      <Work />
      <About />
      <ContactCTA />
      <Footer />
    </main>
  );
}

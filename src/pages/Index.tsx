import { SiteLayout } from "@/components/SiteLayout";
import { SEO } from "@/components/SEO";
import { HeroSection } from "@/components/sections/HeroSection";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { ArenaSection } from "@/components/sections/ArenaSection";
import { LiveAndTournamentsSection } from "@/components/sections/LiveAndTournamentsSection";
import { GuidesSection } from "@/components/sections/GuidesSection";
import { CommunityCTA } from "@/components/sections/CommunityCTA";

const Index = () => {
  return (
    <SiteLayout>
      <SEO
        title="PingPongHub Chile — Equipamiento Pro, Comunidad y Live"
        description="El hub #1 de tenis de mesa en Chile. Paletas, gomas y maderas curadas. WTT en vivo, torneos nacionales y la mejor comunidad de jugadores."
        canonical={typeof window !== "undefined" ? window.location.origin : undefined}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Store",
          name: "PingPongHub Chile",
          description: "Hub de tenis de mesa en Chile: equipamiento, comunidad y live.",
          areaServed: "CL",
        }}
      />
      <HeroSection />
      <FeaturedProducts />
      <ArenaSection />
      <LiveAndTournamentsSection />
      <GuidesSection />
      <CommunityCTA />
    </SiteLayout>
  );
};

export default Index;

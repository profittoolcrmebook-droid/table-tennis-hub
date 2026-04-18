import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { liveMatches } from "@/data/demo";
import { Trophy, ChevronRight } from "lucide-react";
import heroImg from "@/assets/hero-player.jpg";

export const HeroSection = () => {
  const live = liveMatches.filter(m => m.status === "live");

  return (
    <section className="relative overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img src={heroImg} alt="" className="h-full w-full object-cover opacity-30" width={1920} height={1080} />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      <div className="container-px relative mx-auto grid max-w-[1400px] grid-cols-1 gap-12 py-16 md:py-24 lg:grid-cols-[1.4fr_1fr] lg:py-32">
        <div className="space-y-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.3em] text-brand">
            <span className="live-dot" /> Live connection: WTT feed
          </span>

          <h1 className="font-display text-[clamp(3.5rem,11vw,9rem)] leading-[0.85] italic tracking-tight">
            <span className="block text-foreground">ELITE</span>
            <span className="block text-stroke">SQUAD</span>
            <span className="block text-brand">CHILE</span>
          </h1>

          <p className="max-w-md text-base text-muted-foreground">
            El hub #1 de tenis de mesa en Chile. Equipamiento PRO probado, comunidad activa y live competitivo en un solo lugar.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button asChild variant="hero" size="xl">
              <Link to="/equipamiento">Equipamiento Pro <ChevronRight className="size-4" /></Link>
            </Button>
            <Button asChild variant="hero-outline" size="xl">
              <Link to="/arena">Ver la Arena</Link>
            </Button>
          </div>
        </div>

        {/* WTT updates card */}
        <div className="relative">
          <div className="glass relative overflow-hidden rounded-2xl p-6">
            <div className="mb-5 flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-widest text-brand">WTT Updates</p>
              <Trophy className="size-5 text-brand" />
            </div>
            <div className="h-px w-full bg-gradient-to-r from-transparent via-brand/40 to-transparent" />
            <div className="mt-5 space-y-4">
              {live.map(m => (
                <div key={m.id} className="flex items-center justify-between gap-4 rounded-lg border border-border bg-background/40 p-4">
                  <div className="flex flex-1 items-center gap-3">
                    <div className="grid size-12 place-items-center rounded-full bg-secondary text-2xl">{m.flag1}</div>
                    <p className="text-xs font-bold uppercase tracking-wider">{m.player1}</p>
                  </div>
                  <p className="font-display text-3xl italic text-brand">{m.score}</p>
                  <div className="flex flex-1 items-center justify-end gap-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-right">{m.player2}</p>
                    <div className="grid size-12 place-items-center rounded-full bg-secondary text-2xl">{m.flag2}</div>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/live" className="mt-5 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-brand">
              Ver Live Center <ChevronRight className="size-3" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

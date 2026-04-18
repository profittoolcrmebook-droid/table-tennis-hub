import { Link } from "react-router-dom";
import { tournaments, liveMatches } from "@/data/demo";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, ChevronRight, Radio } from "lucide-react";
import { formatDateCL } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import arenaBg from "@/assets/arena-bg.jpg";

export const LiveAndTournamentsSection = () => {
  const upcoming = tournaments.slice(0, 3);
  const featuredMatch = liveMatches[0];

  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div className="absolute inset-0 -z-10">
        <img src={arenaBg} alt="" className="h-full w-full object-cover opacity-20" loading="lazy" width={1600} height={900} />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/85 to-background" />
      </div>

      <div className="container-px mx-auto max-w-[1400px]">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Live */}
          <div>
            <p className="section-eyebrow mb-3 flex items-center gap-2"><Radio className="size-3" /> Live Center</p>
            <h2 className="font-display text-5xl italic tracking-tight md:text-6xl">
              WTT <span className="text-brand">EN VIVO</span>
            </h2>
            <p className="mt-3 max-w-md text-sm text-muted-foreground">Sigue los mejores partidos del circuito mundial sin salir del hub.</p>

            <div className="mt-8 glass overflow-hidden rounded-2xl">
              <div className="flex items-center justify-between border-b border-border px-5 py-3">
                <Badge variant="live"><span className="live-dot" /> En vivo</Badge>
                <p className="text-xs text-muted-foreground">{featuredMatch.tournament}</p>
              </div>
              <div className="aspect-video bg-gradient-to-br from-secondary to-background grid place-items-center">
                <div className="text-center">
                  <p className="font-display text-7xl italic">
                    <span className="text-foreground">{featuredMatch.flag1} {featuredMatch.player1}</span>
                  </p>
                  <p className="font-display text-8xl italic text-brand my-3">{featuredMatch.score}</p>
                  <p className="font-display text-7xl italic text-muted-foreground">
                    {featuredMatch.player2} {featuredMatch.flag2}
                  </p>
                </div>
              </div>
            </div>

            <Button asChild variant="hero-outline" size="lg" className="mt-6">
              <Link to="/live">Abrir Live Center <ChevronRight className="size-4" /></Link>
            </Button>
          </div>

          {/* Torneos */}
          <div>
            <p className="section-eyebrow mb-3">Calendario nacional</p>
            <h2 className="font-display text-5xl italic tracking-tight md:text-6xl">
              TORNEOS <span className="text-brand">CHILE</span>
            </h2>
            <p className="mt-3 max-w-md text-sm text-muted-foreground">Próximas fechas, inscripciones abiertas y resultados oficiales.</p>

            <ul className="mt-8 space-y-3">
              {upcoming.map(t => (
                <li key={t.id} className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-brand/40 hover:bg-card/80">
                  <div className="grid size-16 shrink-0 place-items-center rounded-lg bg-brand/10 text-brand">
                    <Calendar className="size-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold uppercase tracking-widest text-brand">{formatDateCL(t.date)}</p>
                    <h3 className="font-display text-xl italic leading-tight">{t.name}</h3>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="size-3" /> {t.city} · {t.category}
                    </p>
                  </div>
                  {t.status === "abierto" && <Badge variant="stock" className="hidden sm:inline-flex">Abierto</Badge>}
                  {t.status === "proximamente" && <Badge variant="soft" className="hidden sm:inline-flex">Pronto</Badge>}
                </li>
              ))}
            </ul>

            <Button asChild variant="hero-outline" size="lg" className="mt-6">
              <Link to="/torneos">Calendario completo <ChevronRight className="size-4" /></Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

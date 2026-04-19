import { Link } from "react-router-dom";
import { clips, ranking } from "@/data/demo";
import { Button } from "@/components/ui/button";
import { Trophy, Flame, Upload, ChevronRight, TrendingUp, TrendingDown, Minus, Play } from "lucide-react";
import { compactNumber } from "@/lib/format";

export const ArenaSection = () => {
  return (
    <section className="relative py-12 md:py-16">
      <div className="absolute inset-0 -z-10 bg-grid opacity-[0.04]" />
      <div className="container-px mx-auto max-w-[1400px]">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="section-eyebrow mb-3 flex items-center gap-2"><Flame className="size-3" /> Comunidad</p>
            <h2 className="font-display text-5xl italic tracking-tight md:text-6xl">
              ARENA DE <span className="text-brand">JUGADAS</span>
            </h2>
          </div>
          <Button asChild variant="hero-outline" size="lg">
            <Link to="/arena">Ver toda la arena <ChevronRight className="size-4" /></Link>
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
          {/* Clips grid */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {clips.slice(0, 6).map(c => (
              <div key={c.id} className="group relative aspect-[3/4] overflow-hidden rounded-xl border border-border bg-card">
                <img src={c.thumbnail} alt={c.title} loading="lazy" width={400} height={533} className="h-full w-full object-cover opacity-80 transition-all group-hover:opacity-100 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                <div className="absolute inset-0 grid place-items-center opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="grid size-14 place-items-center rounded-full bg-brand/90 text-brand-foreground shadow-glow">
                    <Play className="size-6 fill-current" />
                  </div>
                </div>
                <div className="absolute inset-x-0 bottom-0 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-brand">{c.player}</p>
                  <p className="line-clamp-2 text-xs font-medium">{c.title}</p>
                  <p className="mt-1 text-[10px] text-muted-foreground">{compactNumber(c.views)} vistas · {c.city}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Side panel */}
          <aside className="flex flex-col gap-5">
            <div className="glass rounded-2xl p-5">
              <div className="mb-3 flex items-center gap-2">
                <Trophy className="size-4 text-brand" />
                <p className="text-xs font-bold uppercase tracking-widest text-brand">Premio del mes</p>
              </div>
              <p className="text-sm">
                Sube tu mejor punto y participa por una <span className="font-bold text-brand">Madera Butterfly Viscaria</span>.
              </p>
              <Button variant="hero" size="sm" className="mt-4 w-full text-xs">
                <Upload className="size-3" /> Subir mi jugada
              </Button>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="mb-4 text-xs font-bold uppercase tracking-widest text-brand">Ranking semanal Chile</p>
              <ul className="space-y-2.5">
                {ranking.map(r => (
                  <li key={r.position} className="flex items-center gap-3 text-sm">
                    <span className="font-display text-2xl italic text-muted-foreground/60 w-7">{r.position}</span>
                    <div className="flex-1">
                      <p className="font-medium leading-tight">{r.player}</p>
                      <p className="text-[10px] text-muted-foreground">{r.city}</p>
                    </div>
                    <span className="font-bebas text-base text-calipso">{r.points}</span>
                    {r.trend === "up" && <TrendingUp className="size-3.5 text-success" />}
                    {r.trend === "down" && <TrendingDown className="size-3.5 text-destructive" />}
                    {r.trend === "same" && <Minus className="size-3.5 text-muted-foreground" />}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

import { Link } from "react-router-dom";
import { clips, ranking } from "@/data/demo";
import { Button } from "@/components/ui/button";
import { Trophy, Flame, Upload, ChevronRight, Play } from "lucide-react";
import { compactNumber } from "@/lib/format";

export const ArenaSection = () => {
  // El video destacado es el clip con más "fuegos" (likes)
  const featured = [...clips].sort((a, b) => (b.likes || 0) - (a.likes || 0))[0];

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

        <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr] lg:items-stretch">
          {/* Clips grid */}
          <div className="grid grid-cols-2 auto-rows-fr gap-4 md:grid-cols-3">
            {clips.slice(0, 6).map(c => (
              <div key={c.id} className="group relative h-full min-h-[260px] overflow-hidden rounded-xl border border-border bg-card">
                <img src={c.thumbnail} alt={c.title} loading="lazy" width={400} height={533} className="absolute inset-0 h-full w-full object-cover opacity-80 transition-all group-hover:opacity-100 group-hover:scale-105" />
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
            {/* Video destacado (más votado con 🔥) */}
            {featured && (
              <div className="group relative overflow-hidden rounded-2xl border-2 border-brand bg-card shadow-glow">
                {/* Toke / badge brillante */}
                <div className="absolute left-3 top-3 z-20 inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-foreground shadow-glow animate-pulse">
                  <Flame className="size-3 fill-current" /> Más votado
                </div>
                {/* Contador de fuegos */}
                <div className="absolute right-3 top-3 z-20 inline-flex items-center gap-1 rounded-full bg-background/80 px-2.5 py-1 text-xs font-bebas backdrop-blur">
                  <Flame className="size-3.5 text-brand fill-brand" />
                  <span className="text-foreground">{compactNumber(featured.likes || 0)}</span>
                </div>

                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={featured.thumbnail}
                    alt={featured.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                  {/* Glow ring */}
                  <div className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-brand/30 ring-offset-0" />
                  {/* Play */}
                  <div className="absolute inset-0 grid place-items-center">
                    <button className="grid size-16 place-items-center rounded-full bg-brand text-brand-foreground shadow-glow transition-transform hover:scale-110">
                      <Play className="size-7 fill-current" />
                    </button>
                  </div>
                  {/* Footer info */}
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-brand">{featured.player}</p>
                    <p className="mt-1 line-clamp-2 text-sm font-bold leading-tight">{featured.title}</p>
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      {compactNumber(featured.views)} vistas · {featured.city}
                    </p>
                  </div>
                </div>

                {/* Botón fuego */}
                <button className="flex w-full items-center justify-center gap-2 border-t border-brand/30 bg-brand/10 py-3 text-xs font-bold uppercase tracking-widest text-brand transition-colors hover:bg-brand/20">
                  <Flame className="size-4 fill-current" /> Sumar fuego
                </button>
              </div>
            )}

            {/* Premio del mes (debajo) */}
            <div className="glass rounded-2xl p-5">
              <div className="mb-3 flex items-center gap-2">
                <Trophy className="size-4 text-brand" />
                <p className="text-xs font-bold uppercase tracking-widest text-brand">Premio del mes</p>
              </div>
              <p className="text-sm">
                Sube tu mejor punto y participa por una <span className="font-bold text-brand">Madera Butterfly Viscaria</span>.
              </p>
              <Button asChild variant="hero" size="sm" className="mt-4 w-full text-xs">
                <Link to="/arena?upload=1">
                  <Upload className="size-3" /> Subir mi jugada
                </Link>
              </Button>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

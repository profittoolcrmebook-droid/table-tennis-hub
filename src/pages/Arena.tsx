import { SiteLayout } from "@/components/SiteLayout";
import { SEO } from "@/components/SEO";
import { clips, ranking } from "@/data/demo";
import { Button } from "@/components/ui/button";
import { Play, Upload, Trophy, Flame } from "lucide-react";
import { compactNumber } from "@/lib/format";

const Arena = () => {
  return (
    <SiteLayout>
      <SEO title="Arena de Jugadas — Comunidad PingPongHub Chile" description="Los mejores clips de tenis de mesa de la comunidad chilena. Sube tu jugada y compite por premios mensuales." />
      <section className="container-px mx-auto max-w-[1400px] py-12">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="section-eyebrow mb-3 flex items-center gap-2"><Flame className="size-3" /> Comunidad</p>
            <h1 className="font-display text-5xl italic md:text-7xl">ARENA DE <span className="text-brand">JUGADAS</span></h1>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground">Top semanal, ranking nacional y los mejores puntos de jugadores chilenos.</p>
          </div>
          <Button variant="hero" size="lg"><Upload className="size-4" /> Subir mi jugada</Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div>
            <div className="mb-4 flex gap-2">
              {["Top semana", "Top mes", "All time", "Recientes"].map((t, i) => (
                <button key={t} className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${i === 0 ? "bg-brand text-brand-foreground" : "bg-secondary/50 text-muted-foreground hover:text-foreground"}`}>{t}</button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {[...clips, ...clips].map((c, i) => (
                <div key={i} className="group relative aspect-[3/4] overflow-hidden rounded-xl border border-border bg-card">
                  <img src={c.thumbnail} alt={c.title} loading="lazy" width={400} height={533} className="h-full w-full object-cover opacity-80 transition-all group-hover:opacity-100 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                  <div className="absolute inset-0 grid place-items-center opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="grid size-14 place-items-center rounded-full bg-brand/90 text-brand-foreground shadow-glow"><Play className="size-6 fill-current" /></div>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-brand">{c.player}</p>
                    <p className="line-clamp-2 text-xs font-medium">{c.title}</p>
                    <p className="mt-1 text-[10px] text-muted-foreground">{compactNumber(c.views)} vistas · {c.city}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="space-y-5">
            <div className="glass rounded-2xl p-5">
              <div className="mb-3 flex items-center gap-2"><Trophy className="size-4 text-brand" /><p className="text-xs font-bold uppercase tracking-widest text-brand">Premio del mes</p></div>
              <p className="text-sm">Sube tu mejor punto y participa por una <span className="font-bold text-brand">Madera Butterfly Viscaria</span>.</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <p className="mb-4 text-xs font-bold uppercase tracking-widest text-brand">Ranking semanal Chile</p>
              <ul className="space-y-2.5">
                {ranking.map(r => (
                  <li key={r.position} className="flex items-center gap-3 text-sm">
                    <span className="font-display text-2xl italic text-muted-foreground/60 w-7">{r.position}</span>
                    <div className="flex-1"><p className="font-medium leading-tight">{r.player}</p><p className="text-[10px] text-muted-foreground">{r.city}</p></div>
                    <span className="font-bebas text-base text-brand">{r.points}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </SiteLayout>
  );
};

export default Arena;

import { useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { SEO } from "@/components/SEO";
import { tournaments, ranking } from "@/data/demo";
import { Calendar, MapPin, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { formatDateCL } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const Torneos = () => {
  const [tab, setTab] = useState<"proximos" | "ranking" | "resultados">("proximos");

  return (
    <SiteLayout>
      <SEO title="Torneos de tenis de mesa Chile — PingPongHub" description="Calendario nacional, inscripciones abiertas, resultados y ranking oficial chileno de tenis de mesa." />
      <section className="container-px mx-auto max-w-[1400px] py-12">
        <p className="section-eyebrow mb-3">Calendario nacional</p>
        <h1 className="font-display text-5xl italic md:text-7xl">TORNEOS <span className="text-brand">CHILE</span></h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">Próximos torneos, ranking nacional y resultados oficiales en un solo lugar.</p>

        <div className="mt-8 flex gap-2 border-b border-border">
          {[
            { k: "proximos", l: "Próximos" },
            { k: "ranking", l: "Ranking" },
            { k: "resultados", l: "Resultados" },
          ].map(t => (
            <button key={t.k} onClick={() => setTab(t.k as typeof tab)} className={`relative px-4 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${tab === t.k ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              {t.l}
              {tab === t.k && <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-brand" />}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {tab === "proximos" && (
            <ul className="space-y-3">
              {tournaments.map(t => (
                <li key={t.id} className="group flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:border-brand/40">
                  <div className="grid size-16 shrink-0 place-items-center rounded-lg bg-brand/10 text-brand"><Calendar className="size-6" /></div>
                  <div className="flex-1">
                    <p className="text-xs font-bold uppercase tracking-widest text-brand">{formatDateCL(t.date)}</p>
                    <h3 className="font-display text-2xl italic leading-tight">{t.name}</h3>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="size-3" /> {t.city} · {t.category}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    {t.status === "abierto" && <Badge variant="stock">Inscripciones abiertas</Badge>}
                    {t.status === "proximamente" && <Badge variant="soft">Pronto</Badge>}
                    <Button variant="outline-brand" size="sm" className="hidden sm:inline-flex">Inscribirse</Button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {tab === "ranking" && (
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-secondary/30 text-xs uppercase tracking-widest text-muted-foreground">
                  <tr>
                    <th className="px-5 py-3 text-left">#</th>
                    <th className="px-5 py-3 text-left">Jugador</th>
                    <th className="px-5 py-3 text-left">Ciudad</th>
                    <th className="px-5 py-3 text-right">Puntos</th>
                    <th className="px-5 py-3 text-center">Tendencia</th>
                  </tr>
                </thead>
                <tbody>
                  {ranking.map(r => (
                    <tr key={r.position} className="border-b border-border/50 last:border-0 hover:bg-secondary/20">
                      <td className="px-5 py-4 font-display text-2xl italic text-muted-foreground/60">{r.position}</td>
                      <td className="px-5 py-4 font-medium">{r.player}</td>
                      <td className="px-5 py-4 text-muted-foreground">{r.city}</td>
                      <td className="px-5 py-4 text-right font-bebas text-lg text-brand">{r.points}</td>
                      <td className="px-5 py-4">
                        <div className="flex justify-center">
                          {r.trend === "up" && <TrendingUp className="size-4 text-success" />}
                          {r.trend === "down" && <TrendingDown className="size-4 text-destructive" />}
                          {r.trend === "same" && <Minus className="size-4 text-muted-foreground" />}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "resultados" && (
            <div className="rounded-xl border border-dashed border-border p-12 text-center">
              <p className="text-muted-foreground">Resultados de los últimos torneos próximamente.</p>
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
};

export default Torneos;

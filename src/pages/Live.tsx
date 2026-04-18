import { SiteLayout } from "@/components/SiteLayout";
import { SEO } from "@/components/SEO";
import { liveMatches } from "@/data/demo";
import { Badge } from "@/components/ui/badge";
import { Radio } from "lucide-react";

const Live = () => {
  return (
    <SiteLayout>
      <SEO title="Live Center WTT — PingPongHub Chile" description="Sigue WTT y los torneos del circuito mundial en vivo. Marcadores, próximos partidos y resultados." />
      <section className="container-px mx-auto max-w-[1400px] py-12">
        <p className="section-eyebrow mb-3 flex items-center gap-2"><Radio className="size-3" /> Live Center</p>
        <h1 className="font-display text-5xl italic md:text-7xl">WTT <span className="text-brand">EN VIVO</span></h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">Marcadores en tiempo real curados por el equipo PingPongHub.</p>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {liveMatches.map(m => (
            <div key={m.id} className="glass overflow-hidden rounded-2xl">
              <div className="flex items-center justify-between border-b border-border px-5 py-3">
                {m.status === "live" && <Badge variant="live"><span className="live-dot" /> En vivo</Badge>}
                {m.status === "scheduled" && <Badge variant="soft">Programado</Badge>}
                <p className="text-xs text-muted-foreground">{m.tournament}</p>
              </div>
              <div className="aspect-video bg-gradient-to-br from-secondary to-background grid place-items-center p-8">
                <div className="text-center">
                  <p className="font-display text-4xl italic md:text-5xl">{m.flag1} {m.player1}</p>
                  <p className="font-display text-6xl italic text-brand my-2">{m.score}</p>
                  <p className="font-display text-4xl italic text-muted-foreground md:text-5xl">{m.player2} {m.flag2}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
};

export default Live;

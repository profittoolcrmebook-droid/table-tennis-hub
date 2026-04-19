import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Upload, Users } from "lucide-react";

export const CommunityCTA = () => {
  return (
    <section className="relative overflow-hidden py-12 md:py-16">
      <div className="container-px mx-auto max-w-[1400px]">
        <div className="relative overflow-hidden rounded-3xl border border-brand/30 bg-gradient-to-br from-brand-deep via-brand to-brand-glow p-10 md:p-16">
          <div className="absolute -right-20 -top-20 size-72 rounded-full bg-brand-foreground/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 size-72 rounded-full bg-background/10 blur-3xl" />
          <div className="relative grid items-center gap-8 md:grid-cols-[1.3fr_1fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-brand-foreground/80">Comunidad PingPongHub</p>
              <h2 className="mt-3 font-display text-5xl italic leading-[0.9] tracking-tight text-brand-foreground md:text-7xl">
                SUBE TU<br />
                <span className="text-stroke" style={{ WebkitTextStroke: '2px hsl(var(--brand-foreground))' }}>MEJOR</span> JUGADA
              </h2>
              <p className="mt-5 max-w-md text-base text-brand-foreground/85">
                Cada mes premiamos al mejor punto de la comunidad chilena. Equipamiento real, jugadores reales.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Button asChild size="xl" className="bg-background text-foreground hover:bg-background/90 font-display italic tracking-wider uppercase clip-diagonal">
                <Link to="/auth"><Upload className="size-4" /> Subir mi jugada</Link>
              </Button>
              <Button asChild size="xl" variant="hero-outline" className="border-background text-background hover:bg-background hover:text-foreground">
                <Link to="/arena"><Users className="size-4" /> Ver la comunidad</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

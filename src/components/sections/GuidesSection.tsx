import { Link } from "react-router-dom";
import { articles } from "@/data/demo";
import { Button } from "@/components/ui/button";
import { ChevronRight, Clock } from "lucide-react";
import { formatDateCL } from "@/lib/format";

export const GuidesSection = () => {
  const featured = articles.slice(0, 3);
  return (
    <section className="relative py-12 md:py-16">
      <div className="container-px mx-auto max-w-[1400px]">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="section-eyebrow mb-3">Editorial</p>
            <h2 className="font-display text-5xl italic tracking-tight md:text-6xl">
              GUÍAS Y <span className="text-brand">COMPARATIVAS</span>
            </h2>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground">Contenido curado por jugadores chilenos. Sin relleno, sin copy-paste.</p>
          </div>
          <Button asChild variant="outline-brand" size="lg">
            <Link to="/guias">Ver todas las guías <ChevronRight className="size-4" /></Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {featured.map(a => (
            <Link key={a.id} to={`/guias/${a.slug}`} className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-brand/40 hover:shadow-card-elevated">
              <div className="relative aspect-[16/10] overflow-hidden">
                <img src={a.cover} alt={a.title} loading="lazy" width={640} height={400} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <span className="absolute left-3 top-3 rounded-full bg-brand px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-foreground">{a.category}</span>
              </div>
              <div className="flex flex-1 flex-col gap-3 p-5">
                <h3 className="font-display text-xl italic leading-tight tracking-tight transition-colors group-hover:text-brand">{a.title}</h3>
                <p className="line-clamp-2 text-sm text-muted-foreground">{a.excerpt}</p>
                <div className="mt-auto flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{formatDateCL(a.date)}</span>
                  <span className="flex items-center gap-1"><Clock className="size-3" /> {a.readTime}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

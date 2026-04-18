import { Link } from "react-router-dom";
import { SiteLayout } from "@/components/SiteLayout";
import { SEO } from "@/components/SEO";
import { articles } from "@/data/demo";
import { Clock } from "lucide-react";
import { formatDateCL } from "@/lib/format";

const Guias = () => {
  return (
    <SiteLayout>
      <SEO title="Guías de tenis de mesa Chile — PingPongHub" description="Guías, comparativas y consejos prácticos de tenis de mesa escritos por jugadores chilenos." />
      <section className="container-px mx-auto max-w-[1400px] py-12">
        <p className="section-eyebrow mb-3">Editorial</p>
        <h1 className="font-display text-5xl italic md:text-7xl">GUÍAS Y <span className="text-brand">COMPARATIVAS</span></h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">Contenido curado para que elijas mejor, juegues mejor y disfrutes más.</p>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map(a => (
            <Link key={a.id} to={`/guias/${a.slug}`} className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-brand/40 hover:shadow-card-elevated">
              <div className="relative aspect-[16/10] overflow-hidden">
                <img src={a.cover} alt={a.title} loading="lazy" width={640} height={400} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <span className="absolute left-3 top-3 rounded-full bg-brand px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand-foreground">{a.category}</span>
              </div>
              <div className="flex flex-1 flex-col gap-3 p-5">
                <h3 className="font-display text-xl italic leading-tight transition-colors group-hover:text-brand">{a.title}</h3>
                <p className="line-clamp-2 text-sm text-muted-foreground">{a.excerpt}</p>
                <div className="mt-auto flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{formatDateCL(a.date)}</span>
                  <span className="flex items-center gap-1"><Clock className="size-3" /> {a.readTime}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
};

export default Guias;

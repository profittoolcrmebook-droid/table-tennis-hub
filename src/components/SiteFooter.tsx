import { Link } from "react-router-dom";
import { Instagram, Youtube, Facebook } from "lucide-react";
import { brands } from "@/data/demo";

export const SiteFooter = () => {
  return (
    <footer className="mt-24 border-t border-border bg-background">
      {/* Brand marquee */}
      <div className="border-b border-border py-8 overflow-hidden">
        <div className="container-px mx-auto max-w-[1400px]">
          <p className="section-eyebrow mb-4">Marcas que vendemos</p>
          <div className="flex flex-wrap gap-x-10 gap-y-3">
            {brands.map(b => (
              <span key={b} className="font-display text-2xl text-muted-foreground/60 hover:text-brand transition-colors">{b}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="container-px mx-auto grid max-w-[1400px] grid-cols-2 gap-8 py-12 md:grid-cols-4">
        <div className="col-span-2">
          <Link to="/" className="font-display text-2xl">
            <span className="text-foreground">PINGPONG</span><span className="text-brand">HUB</span>
          </Link>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            El hub #1 de tenis de mesa en Chile. Equipamiento curado, comunidad y live competitivo.
          </p>
          <div className="mt-5 flex gap-3">
            <a aria-label="Instagram" href="#" className="grid size-10 place-items-center rounded-md bg-secondary hover:bg-brand hover:text-brand-foreground transition-colors"><Instagram className="size-4" /></a>
            <a aria-label="YouTube" href="#" className="grid size-10 place-items-center rounded-md bg-secondary hover:bg-brand hover:text-brand-foreground transition-colors"><Youtube className="size-4" /></a>
            <a aria-label="Facebook" href="#" className="grid size-10 place-items-center rounded-md bg-secondary hover:bg-brand hover:text-brand-foreground transition-colors"><Facebook className="size-4" /></a>
          </div>
        </div>

        <div>
          <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-foreground">Tienda</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/equipamiento" className="hover:text-brand">Equipamiento</Link></li>
            <li><Link to="/equipamiento?type=kit" className="hover:text-brand">Kits</Link></li>
            <li><Link to="/equipamiento?type=goma" className="hover:text-brand">Gomas</Link></li>
            <li><Link to="/equipamiento?type=madera" className="hover:text-brand">Maderas</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 text-xs font-bold uppercase tracking-widest text-foreground">Comunidad</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/arena" className="hover:text-brand">Arena de Jugadas</Link></li>
            <li><Link to="/torneos" className="hover:text-brand">Torneos Chile</Link></li>
            <li><Link to="/live" className="hover:text-brand">Live Center</Link></li>
            <li><Link to="/guias" className="hover:text-brand">Guías</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border py-5">
        <div className="container-px mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-2 text-xs text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} PingPongHub Chile. Todos los derechos reservados.</p>
          <p>Hecho con 🏓 en Santiago de Chile</p>
        </div>
      </div>
    </footer>
  );
};

import { Link, NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const links = [
  { to: "/equipamiento", label: "Equipamiento" },
  { to: "/live", label: "WTT Live" },
  { to: "/torneos", label: "Torneos Chile" },
  { to: "/arena", label: "Arena" },
  { to: "/guias", label: "Guías" },
];

export const SiteHeader = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  return (
    <header className={`sticky top-0 z-40 transition-all ${scrolled ? "bg-background/85 backdrop-blur-md border-b border-border" : "bg-transparent"}`}>
      <div className="h-1 bg-gradient-brand" />
      <div className="container-px mx-auto flex h-16 max-w-[1400px] items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-1 font-display text-2xl tracking-tight">
          <span className="text-foreground">PINGPONG</span>
          <span className="text-brand">HUB</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `relative px-3 py-2 text-xs font-bold uppercase tracking-widest transition-colors ${
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {l.label}
                  {isActive && <span className="absolute -bottom-px left-3 right-3 h-0.5 bg-brand" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost-pill" size="sm" className="hidden sm:inline-flex">
            <Link to="/auth">
              <User className="size-4" /> Cuenta
            </Link>
          </Button>
          <button
            aria-label="Menú"
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-md bg-secondary text-foreground"
            onClick={() => setOpen(o => !o)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur-md">
          <nav className="container-px mx-auto flex max-w-[1400px] flex-col py-2">
            {links.map(l => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `py-3 text-sm font-bold uppercase tracking-widest ${isActive ? "text-brand" : "text-foreground"}`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <NavLink to="/auth" className="py-3 text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Cuenta
            </NavLink>
          </nav>
        </div>
      )}
    </header>
  );
};

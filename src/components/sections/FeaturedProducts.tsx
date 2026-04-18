import { Link } from "react-router-dom";
import { products } from "@/data/demo";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export const FeaturedProducts = () => {
  const featured = products.slice(0, 4);
  return (
    <section className="relative py-20 md:py-28">
      <div className="container-px mx-auto max-w-[1400px]">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="section-eyebrow mb-3">Catálogo curado</p>
            <h2 className="font-display text-5xl italic tracking-tight md:text-6xl">
              MATERIAL DE <span className="text-brand">ÉLITE</span>
            </h2>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground">
              No vendemos copias. Probamos cada producto con jugadores locales para asegurar rendimiento profesional.
            </p>
          </div>
          <Button asChild variant="outline-brand" size="lg">
            <Link to="/equipamiento">Ver catálogo completo <ChevronRight className="size-4" /></Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  );
};

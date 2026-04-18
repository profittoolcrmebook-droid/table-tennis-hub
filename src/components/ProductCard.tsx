import { Link } from "react-router-dom";
import { Product } from "@/data/demo";
import { formatCLP } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const ProductCard = ({ product }: { product: Product }) => {
  const variant = product.badge === "MÁS VENDIDO" ? "bestseller" : "stock";
  return (
    <Link
      to={`/equipamiento/${product.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-brand/40 hover:shadow-brand"
    >
      <div className="relative aspect-square overflow-hidden bg-secondary/40">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          width={800}
          height={800}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {product.badge && (
          <Badge variant={variant} className="absolute left-3 top-3">{product.badge}</Badge>
        )}
        <div className="pointer-events-none absolute inset-0 grid place-items-center font-display text-[8rem] italic text-foreground/[0.04]">
          PRO
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{product.brand}</p>
            <h3 className="font-display text-xl italic leading-tight tracking-tight text-foreground">{product.name}</h3>
          </div>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div>
            {product.oldPrice && (
              <p className="text-xs text-muted-foreground line-through">{formatCLP(product.oldPrice)}</p>
            )}
            <p className="font-display text-2xl italic text-foreground">{formatCLP(product.price)}</p>
          </div>
          <Button variant="hero" size="sm" className="text-xs">Comprar ahora</Button>
        </div>
      </div>
    </Link>
  );
};

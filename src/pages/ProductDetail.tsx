import { useParams, Link } from "react-router-dom";
import { SiteLayout } from "@/components/SiteLayout";
import { SEO } from "@/components/SEO";
import { products } from "@/data/demo";
import { formatCLP } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Truck, ShieldCheck, Zap, ShoppingCart } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { useCart } from "@/contexts/CartContext";

const ProductDetail = () => {
  const { slug } = useParams();
  const product = products.find(p => p.slug === slug);
  const { add, open: openCart } = useCart();
  if (!product) {
    return (
      <SiteLayout>
        <div className="container-px mx-auto max-w-3xl py-24 text-center">
          <h1 className="font-display text-4xl italic">Producto no encontrado</h1>
          <Button asChild variant="outline-brand" className="mt-6"><Link to="/equipamiento">Volver al catálogo</Link></Button>
        </div>
      </SiteLayout>
    );
  }
  const related = products.filter(p => p.id !== product.id && p.type === product.type).slice(0, 4);

  return (
    <SiteLayout>
      <SEO
        title={`${product.name} — ${product.brand} | PingPongHub Chile`}
        description={product.description}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          brand: product.brand,
          description: product.description,
          image: product.image,
          offers: { "@type": "Offer", price: product.price, priceCurrency: "CLP", availability: "https://schema.org/InStock" },
        }}
      />
      <section className="container-px mx-auto max-w-[1400px] py-10">
        <Link to="/equipamiento" className="mb-6 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-brand"><ChevronLeft className="size-3" /> Volver al catálogo</Link>

        <div className="grid gap-10 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            <img src={product.image} alt={product.name} width={1000} height={1000} className="aspect-square w-full object-cover" />
          </div>

          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="pro">{product.brand}</Badge>
              {product.badge && <Badge variant={product.badge === "MÁS VENDIDO" ? "bestseller" : "stock"}>{product.badge}</Badge>}
              <Badge variant="soft">{product.type}</Badge>
            </div>

            <h1 className="font-display text-5xl italic leading-[0.95] md:text-6xl">{product.name}</h1>
            <p className="text-base text-muted-foreground">{product.description}</p>

            <div className="flex items-end gap-3">
              {product.oldPrice && <p className="text-lg text-muted-foreground line-through">{formatCLP(product.oldPrice)}</p>}
              <p className="font-display text-5xl italic text-brand">{formatCLP(product.price)}</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button onClick={() => add({ id: product.id, slug: product.slug, name: product.name, brand: product.brand, price: product.price, image: product.image })} variant="hero" size="xl"><ShoppingCart className="size-4" />Añadir al carrito</Button>
              <Button onClick={() => { add({ id: product.id, slug: product.slug, name: product.name, brand: product.brand, price: product.price, image: product.image }); openCart(); }} variant="hero-outline" size="xl">Comprar ahora</Button>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <Stat label="Velocidad" value={product.rating.speed} />
              <Stat label="Spin" value={product.rating.spin} />
              <Stat label="Control" value={product.rating.control} />
            </div>

            <div className="rounded-xl border border-border bg-card p-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-brand">Especificaciones</p>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                {product.specs.map(s => (
                  <div key={s.label} className="flex justify-between border-b border-border/50 py-1.5">
                    <dt className="text-muted-foreground">{s.label}</dt>
                    <dd className="font-medium">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <Feature icon={<Truck className="size-4" />} text={product.shipping} />
              <Feature icon={<ShieldCheck className="size-4" />} text="Garantía oficial" />
              <Feature icon={<Zap className="size-4" />} text="Probado por pros" />
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-20">
            <h2 className="font-display text-3xl italic mb-6">PRODUCTOS <span className="text-brand">RELACIONADOS</span></h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </section>
    </SiteLayout>
  );
};

const Stat = ({ label, value }: { label: string; value: number }) => (
  <div className="rounded-lg border border-border bg-card p-3 text-center">
    <p className="font-display text-3xl italic text-brand">{value}<span className="text-muted-foreground text-base">/10</span></p>
    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</p>
  </div>
);
const Feature = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="flex items-center gap-2 rounded-lg border border-border bg-card/60 p-3 text-xs">
    <span className="text-brand">{icon}</span>{text}
  </div>
);

export default ProductDetail;

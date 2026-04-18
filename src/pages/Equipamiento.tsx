import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { SiteLayout } from "@/components/SiteLayout";
import { SEO } from "@/components/SEO";
import { ProductCard } from "@/components/ProductCard";
import { products, brands, ProductLevel, ProductType, PlayStyle } from "@/data/demo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Filter, X } from "lucide-react";

const types: { value: ProductType; label: string }[] = [
  { value: "paleta", label: "Paletas armadas" },
  { value: "madera", label: "Maderas" },
  { value: "goma", label: "Gomas" },
  { value: "pelota", label: "Pelotas" },
  { value: "kit", label: "Kits" },
  { value: "accesorio", label: "Accesorios" },
];
const levels: ProductLevel[] = ["principiante", "intermedio", "avanzado", "pro"];
const styles: PlayStyle[] = ["spin", "control", "velocidad", "all-round"];

const Equipamiento = () => {
  const [params, setParams] = useSearchParams();
  const [type, setType] = useState<ProductType | "">((params.get("type") as ProductType) || "");
  const [brand, setBrand] = useState("");
  const [level, setLevel] = useState<ProductLevel | "">("");
  const [style, setStyle] = useState<PlayStyle | "">("");
  const [maxPrice, setMaxPrice] = useState(200000);

  const filtered = useMemo(() =>
    products.filter(p =>
      (!type || p.type === type) &&
      (!brand || p.brand === brand) &&
      (!level || p.level === level) &&
      (!style || p.style === style) &&
      p.price <= maxPrice
    ), [type, brand, level, style, maxPrice]);

  const clear = () => { setType(""); setBrand(""); setLevel(""); setStyle(""); setMaxPrice(200000); setParams({}); };

  return (
    <SiteLayout>
      <SEO
        title="Equipamiento de tenis de mesa Chile — PingPongHub"
        description="Paletas, gomas, maderas y kits de tenis de mesa con stock en Chile. Marcas DHS, Butterfly, Loki, Stiga y más."
      />
      <section className="container-px mx-auto max-w-[1400px] py-12">
        <div className="mb-10">
          <p className="section-eyebrow mb-3">Catálogo curado</p>
          <h1 className="font-display text-5xl italic md:text-7xl">EQUIPAMIENTO <span className="text-brand">PRO</span></h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Cada producto probado por jugadores chilenos. Stock real, despacho a todo el país.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="space-y-6 lg:sticky lg:top-24 lg:h-fit">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand"><Filter className="size-3" /> Filtros</p>
              <button onClick={clear} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-brand"><X className="size-3" /> Limpiar</button>
            </div>

            <FilterGroup label="Tipo">
              {types.map(t => <Chip key={t.value} active={type === t.value} onClick={() => setType(type === t.value ? "" : t.value)}>{t.label}</Chip>)}
            </FilterGroup>

            <FilterGroup label="Marca">
              {brands.map(b => <Chip key={b} active={brand === b} onClick={() => setBrand(brand === b ? "" : b)}>{b}</Chip>)}
            </FilterGroup>

            <FilterGroup label="Nivel">
              {levels.map(l => <Chip key={l} active={level === l} onClick={() => setLevel(level === l ? "" : l)}>{l}</Chip>)}
            </FilterGroup>

            <FilterGroup label="Estilo">
              {styles.map(s => <Chip key={s} active={style === s} onClick={() => setStyle(style === s ? "" : s)}>{s}</Chip>)}
            </FilterGroup>

            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-foreground">Precio máx.</p>
              <Slider value={[maxPrice]} max={200000} step={5000} onValueChange={v => setMaxPrice(v[0])} />
              <p className="mt-2 text-xs text-muted-foreground">Hasta ${maxPrice.toLocaleString("es-CL")}</p>
            </div>
          </aside>

          <div>
            <p className="mb-4 text-xs text-muted-foreground">{filtered.length} productos</p>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
            {filtered.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border p-12 text-center">
                <p className="text-muted-foreground">No hay productos con esos filtros.</p>
                <Button variant="outline-brand" className="mt-4" onClick={clear}>Limpiar filtros</Button>
              </div>
            )}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
};

const FilterGroup = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <p className="mb-3 text-xs font-bold uppercase tracking-widest text-foreground">{label}</p>
    <div className="flex flex-wrap gap-1.5">{children}</div>
  </div>
);
const Chip = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button onClick={onClick} className={`rounded-full border px-3 py-1 text-xs capitalize transition-colors ${active ? "border-brand bg-brand text-brand-foreground" : "border-border bg-secondary/40 text-muted-foreground hover:border-brand/40 hover:text-foreground"}`}>{children}</button>
);

export default Equipamiento;

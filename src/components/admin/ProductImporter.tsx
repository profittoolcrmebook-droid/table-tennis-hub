import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { calculateFinalPrice } from "@/lib/orderUtils";
import { formatCLP } from "@/lib/format";
import { Calculator, ExternalLink, Plus, Trash2, Save } from "lucide-react";

interface Category { id: string; slug: string; name: string; markup_percent: number; }

export const ProductImporter = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    source_url: "",
    name: "",
    brand: "",
    type: "paleta",
    description: "",
    cost_usd: 0,
    shipping_cost_usd: 0,
    exchange_rate: 950,
    markup_percent: 100,
    images: [""] as string[],
    speed: 5,
    spin: 5,
    control: 5,
    badge: "",
    stock: 99,
  });

  useEffect(() => {
    supabase.from("categories").select("*").order("sort_order").then(({ data }) => {
      const cats = (data || []) as Category[];
      setCategories(cats);
      if (cats.length > 0) setForm(f => ({ ...f, type: cats[0].slug, markup_percent: cats[0].markup_percent }));
    });
  }, []);

  const onTypeChange = (slug: string) => {
    const cat = categories.find(c => c.slug === slug);
    setForm(f => ({ ...f, type: slug, markup_percent: cat?.markup_percent ?? 100 }));
  };

  const addImage = () => setForm(f => ({ ...f, images: [...f.images, ""] }));
  const setImage = (i: number, v: string) => setForm(f => ({ ...f, images: f.images.map((img, idx) => idx === i ? v : img) }));
  const removeImage = (i: number) => setForm(f => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }));

  const finalPrice = calculateFinalPrice({
    costUsd: form.cost_usd,
    shippingUsd: form.shipping_cost_usd,
    exchangeRate: form.exchange_rate,
    markupPercent: form.markup_percent,
  });
  const baseClp = (form.cost_usd + form.shipping_cost_usd) * form.exchange_rate;
  const profit = finalPrice - baseClp;

  const slugify = (s: string) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 100);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.brand || form.cost_usd <= 0) {
      toast.error("Completa nombre, marca y costo");
      return;
    }
    const cleanImages = form.images.filter(i => i.trim().length > 0);
    if (cleanImages.length === 0) {
      toast.error("Agrega al menos una imagen");
      return;
    }

    const slug = slugify(form.name) + "-" + Date.now().toString(36);
    const { error } = await supabase.from("products").insert({
      slug,
      name: form.name,
      brand: form.brand,
      type: form.type,
      description: form.description || null,
      price: finalPrice,
      image_url: cleanImages[0],
      images: cleanImages,
      stock: form.stock,
      badge: form.badge || null,
      source_url: form.source_url || null,
      cost_usd: form.cost_usd,
      shipping_cost_usd: form.shipping_cost_usd,
      exchange_rate: form.exchange_rate,
      markup_percent: form.markup_percent,
      specs: { speed: form.speed, spin: form.spin, control: form.control },
      published: true,
    });

    if (error) { toast.error(error.message); return; }
    toast.success(`Producto creado: ${formatCLP(finalPrice)}`);
    setForm(f => ({ ...f, source_url: "", name: "", brand: "", description: "", cost_usd: 0, shipping_cost_usd: 0, images: [""], badge: "" }));
  };

  return (
    <form onSubmit={submit} className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <div className="space-y-5">
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <h3 className="font-display text-xl italic flex items-center gap-2"><ExternalLink className="size-4 text-brand" />ORIGEN ALIEXPRESS</h3>
          <div><Label className="text-xs uppercase">URL AliExpress (referencia)</Label><Input value={form.source_url} onChange={e => setForm({ ...form, source_url: e.target.value })} placeholder="https://aliexpress.com/item/..." maxLength={500} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-xs uppercase">Nombre *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required maxLength={120} /></div>
            <div><Label className="text-xs uppercase">Marca *</Label><Input value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} required maxLength={60} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-xs uppercase">Categoría *</Label>
              <select value={form.type} onChange={e => onTypeChange(e.target.value)} className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                {categories.map(c => <option key={c.id} value={c.slug}>{c.name} ({c.markup_percent}%)</option>)}
              </select>
            </div>
            <div><Label className="text-xs uppercase">Badge (opcional)</Label><Input value={form.badge} onChange={e => setForm({ ...form, badge: e.target.value })} maxLength={40} placeholder="MÁS VENDIDO" /></div>
          </div>
          <div><Label className="text-xs uppercase">Descripción</Label><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} maxLength={500} rows={3} /></div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 space-y-3">
          <h3 className="font-display text-xl italic">IMÁGENES</h3>
          {form.images.map((img, i) => (
            <div key={i} className="flex gap-2">
              <Input value={img} onChange={e => setImage(i, e.target.value)} placeholder="https://ae01.alicdn.com/..." maxLength={500} />
              {form.images.length > 1 && <Button type="button" size="icon" variant="ghost" onClick={() => removeImage(i)}><Trash2 className="size-4" /></Button>}
            </div>
          ))}
          <Button type="button" size="sm" variant="outline-brand" onClick={addImage}><Plus className="size-3" />Agregar imagen</Button>
          {form.images[0] && <img src={form.images[0]} alt="preview" className="mt-2 h-32 w-32 rounded-md object-cover" onError={e => (e.currentTarget.style.display = "none")} />}
        </div>

        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
          <h3 className="font-display text-xl italic">SPECS TÉCNICAS</h3>
          {(["speed", "spin", "control"] as const).map(k => (
            <div key={k}>
              <div className="flex justify-between text-xs uppercase tracking-widest"><span>{k === "speed" ? "Velocidad" : k === "spin" ? "Spin" : "Control"}</span><span className="text-brand font-bebas text-base">{form[k]}/10</span></div>
              <Slider value={[form[k]]} onValueChange={v => setForm({ ...form, [k]: v[0] })} min={0} max={10} step={1} className="mt-2" />
            </div>
          ))}
        </div>
      </div>

      <aside className="space-y-4 lg:sticky lg:top-24 h-fit">
        <div className="rounded-xl border border-calipso/30 bg-calipso/5 p-5 space-y-3">
          <h3 className="font-display text-xl italic flex items-center gap-2"><Calculator className="size-4 text-calipso" />CALCULADORA</h3>
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-xs uppercase">Costo USD *</Label><Input type="number" step="0.01" value={form.cost_usd || ""} onChange={e => setForm({ ...form, cost_usd: Number(e.target.value) })} required min={0} /></div>
            <div><Label className="text-xs uppercase">Envío USD</Label><Input type="number" step="0.01" value={form.shipping_cost_usd || ""} onChange={e => setForm({ ...form, shipping_cost_usd: Number(e.target.value) })} min={0} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-xs uppercase">USD → CLP</Label><Input type="number" value={form.exchange_rate} onChange={e => setForm({ ...form, exchange_rate: Number(e.target.value) })} min={1} /></div>
            <div><Label className="text-xs uppercase">Markup %</Label><Input type="number" value={form.markup_percent} onChange={e => setForm({ ...form, markup_percent: Number(e.target.value) })} min={0} max={500} /></div>
          </div>

          <div className="space-y-1.5 border-t border-border pt-3 text-sm">
            <div className="flex justify-between text-muted-foreground"><span>Costo base CLP</span><span>{formatCLP(Math.round(baseClp))}</span></div>
            <div className="flex justify-between text-calipso"><span>Ganancia</span><span>+{formatCLP(profit)}</span></div>
            <div className="flex justify-between font-display text-2xl italic pt-2 border-t border-border"><span>VENTA</span><span className="text-brand">{formatCLP(finalPrice)}</span></div>
          </div>

          <div><Label className="text-xs uppercase">Stock</Label><Input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: Number(e.target.value) })} min={0} /></div>
        </div>

        <Button type="submit" variant="hero" size="lg" className="w-full"><Save className="size-4" />Crear producto</Button>
        <p className="text-[10px] text-center text-muted-foreground">Markup precargado por categoría. Editable.</p>
      </aside>
    </form>
  );
};

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { SiteLayout } from "@/components/SiteLayout";
import { SEO } from "@/components/SEO";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatCLP } from "@/lib/format";
import { calculateShipping, REGIONES_CHILE, validateRut } from "@/lib/orderUtils";
import { toast } from "sonner";
import { Loader2, Lock, ShoppingBag } from "lucide-react";

const checkoutSchema = z.object({
  email: z.string().trim().email("Email inválido").max(255),
  full_name: z.string().trim().min(2, "Nombre requerido").max(120),
  phone: z.string().trim().min(8, "Teléfono inválido").max(20),
  rut: z.string().trim().refine(v => v === "" || validateRut(v), "RUT inválido").optional().or(z.literal("")),
  address: z.string().trim().min(5, "Dirección requerida").max(200),
  city: z.string().trim().min(2, "Ciudad requerida").max(80),
  region: z.string().min(1, "Selecciona una región"),
  notes: z.string().max(500).optional().or(z.literal("")),
});

const Checkout = () => {
  const { items, subtotal, clear } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const shipping = calculateShipping(subtotal);
  const total = subtotal + shipping;

  const [form, setForm] = useState({ email: "", full_name: "", phone: "", rut: "", address: "", city: "", region: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { if (user?.email) setForm(f => ({ ...f, email: user.email! })); }, [user]);

  useEffect(() => {
    if (items.length === 0) navigate("/equipamiento", { replace: true });
  }, [items, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = checkoutSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSubmitting(true);

    try {
      // 1. Crear orden en DB
      const { data: order, error: orderErr } = await supabase
        .from("orders")
        .insert({
          user_id: user?.id ?? null,
          email: parsed.data.email,
          full_name: parsed.data.full_name,
          phone: parsed.data.phone,
          rut: parsed.data.rut || null,
          address: parsed.data.address,
          city: parsed.data.city,
          region: parsed.data.region,
          notes: parsed.data.notes || null,
          subtotal,
          shipping,
          total,
          status: "pending",
        })
        .select()
        .single();
      if (orderErr) throw orderErr;

      // 2. Crear order_items
      const itemsPayload = items.map(it => ({
        order_id: order.id,
        product_id: /^[0-9a-f-]{36}$/i.test(it.id) ? it.id : null,
        product_name: it.name,
        product_slug: it.slug,
        product_image: it.image,
        unit_price: it.price,
        quantity: it.quantity,
        subtotal: it.price * it.quantity,
      }));
      const { error: itemsErr } = await supabase.from("order_items").insert(itemsPayload);
      if (itemsErr) throw itemsErr;

      // 3. Llamar edge function para crear preferencia MP
      const { data: pref, error: prefErr } = await supabase.functions.invoke("create-mp-preference", {
        body: { order_id: order.id },
      });

      if (prefErr || !pref?.init_point) {
        // Sin credenciales MP aún → guardar orden y redirigir a página de orden
        toast.success("Orden creada. Te contactaremos para coordinar el pago.");
        clear();
        navigate(`/orden/${order.id}`);
        return;
      }

      clear();
      window.location.href = pref.init_point;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error al procesar la orden";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) return null;

  return (
    <SiteLayout>
      <SEO title="Checkout — PingPongHub" description="Finaliza tu compra de equipamiento de tenis de mesa." />
      <section className="container-px mx-auto max-w-[1400px] py-12">
        <h1 className="font-display text-4xl italic md:text-5xl">CHECKOUT</h1>
        <p className="mt-2 text-sm text-muted-foreground">Completa tus datos. Te enviamos el detalle por email.</p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_400px]">
          <form onSubmit={submit} className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <h2 className="font-display text-xl italic">CONTACTO</h2>
              <div><Label>Email *</Label><Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required maxLength={255} /></div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div><Label>Nombre completo *</Label><Input value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} required maxLength={120} /></div>
                <div><Label>Teléfono *</Label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+56 9 1234 5678" required maxLength={20} /></div>
              </div>
              <div><Label>RUT (opcional)</Label><Input value={form.rut} onChange={e => setForm({ ...form, rut: e.target.value })} placeholder="12.345.678-9" maxLength={12} /></div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 space-y-4">
              <h2 className="font-display text-xl italic">ENVÍO</h2>
              <div><Label>Dirección *</Label><Input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} placeholder="Av. Apoquindo 4500, Depto 301" required maxLength={200} /></div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div><Label>Ciudad *</Label><Input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} required maxLength={80} /></div>
                <div>
                  <Label>Región *</Label>
                  <select required value={form.region} onChange={e => setForm({ ...form, region: e.target.value })} className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="">Selecciona…</option>
                    {REGIONES_CHILE.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>
              <div><Label>Notas (opcional)</Label><Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} maxLength={500} rows={2} placeholder="Referencias, horario preferido, etc." /></div>
            </div>

            <div className="rounded-xl border border-calipso/30 bg-calipso/5 p-4 text-xs text-muted-foreground">
              <Lock className="inline size-3 mr-1 text-calipso" />
              Importación directa: despacho 10-20 días. Te enviamos el tracking apenas se despache.
            </div>
          </form>

          <aside className="space-y-4 lg:sticky lg:top-24 h-fit">
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-display text-xl italic mb-4 flex items-center gap-2"><ShoppingBag className="size-4 text-brand" />TU ORDEN</h2>
              <div className="space-y-3 max-h-72 overflow-y-auto">
                {items.map(it => (
                  <div key={it.id} className="flex gap-3 text-sm">
                    <img src={it.image} alt={it.name} className="size-14 rounded-md object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="line-clamp-2 leading-tight">{it.name}</p>
                      <p className="text-xs text-muted-foreground">x{it.quantity}</p>
                    </div>
                    <p className="font-display italic whitespace-nowrap">{formatCLP(it.price * it.quantity)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-1.5 border-t border-border pt-4 text-sm">
                <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>{formatCLP(subtotal)}</span></div>
                <div className="flex justify-between text-muted-foreground"><span>Envío</span><span>{shipping === 0 ? "GRATIS" : formatCLP(shipping)}</span></div>
                <div className="flex justify-between border-t border-border pt-2 font-display text-2xl italic"><span>TOTAL</span><span className="text-brand">{formatCLP(total)}</span></div>
              </div>
              <Button type="submit" form="" onClick={submit} disabled={submitting} variant="hero" size="lg" className="mt-4 w-full">
                {submitting ? <><Loader2 className="size-4 animate-spin" /> Procesando…</> : "Pagar con Mercado Pago"}
              </Button>
              <p className="mt-2 text-center text-[10px] text-muted-foreground">Pago seguro. Aceptamos tarjetas, Webpay, transferencia.</p>
              {!user && <p className="mt-2 text-center text-xs text-muted-foreground">¿Tienes cuenta? <Link to="/auth" className="text-brand">Inicia sesión</Link> para guardar tu historial.</p>}
            </div>
          </aside>
        </div>
      </section>
    </SiteLayout>
  );
};

export default Checkout;

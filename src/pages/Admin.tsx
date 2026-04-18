import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SiteLayout } from "@/components/SiteLayout";
import { SEO } from "@/components/SEO";
import { useAuth, useIsAdmin } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Shield, Package, Film, Trophy } from "lucide-react";
import { formatCLP } from "@/lib/format";

interface DBProduct {
  id: string;
  slug: string;
  name: string;
  brand: string;
  type: string;
  price: number;
  description: string | null;
  badge: string | null;
}
interface DBClip {
  id: string;
  title: string;
  status: string;
  player_handle: string;
  city: string | null;
  created_at: string;
}

const Admin = () => {
  const { user, loading } = useAuth();
  const { isAdmin, checked } = useIsAdmin();
  const [tab, setTab] = useState<"productos" | "clips" | "torneos">("productos");

  if (loading || !checked) return <SiteLayout><div className="container-px mx-auto max-w-md py-24 text-center text-muted-foreground">Cargando…</div></SiteLayout>;

  if (!user) {
    return (
      <SiteLayout>
        <div className="container-px mx-auto max-w-md py-24 text-center">
          <h1 className="font-display text-3xl italic">Acceso restringido</h1>
          <p className="mt-2 text-muted-foreground">Inicia sesión para acceder al panel.</p>
          <Button asChild variant="hero" className="mt-6"><Link to="/auth">Iniciar sesión</Link></Button>
        </div>
      </SiteLayout>
    );
  }

  if (!isAdmin) {
    return (
      <SiteLayout>
        <div className="container-px mx-auto max-w-md py-24 text-center">
          <Shield className="mx-auto size-10 text-brand" />
          <h1 className="mt-4 font-display text-3xl italic">Sin permisos</h1>
          <p className="mt-2 text-muted-foreground">Esta sección es solo para administradores.</p>
          <Button asChild variant="outline-brand" className="mt-6"><Link to="/">Volver al inicio</Link></Button>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <SEO title="Admin — PingPongHub" description="Panel de administración." />
      <section className="container-px mx-auto max-w-[1400px] py-10">
        <div className="flex items-center gap-3">
          <Shield className="size-6 text-brand" />
          <h1 className="font-display text-4xl italic">PANEL <span className="text-brand">ADMIN</span></h1>
        </div>

        <div className="mt-8 flex gap-2 border-b border-border">
          {[
            { k: "productos", l: "Productos", i: <Package className="size-3" /> },
            { k: "clips", l: "Moderar clips", i: <Film className="size-3" /> },
            { k: "torneos", l: "Torneos", i: <Trophy className="size-3" /> },
          ].map(t => (
            <button key={t.k} onClick={() => setTab(t.k as typeof tab)} className={`relative flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${tab === t.k ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              {t.i}{t.l}
              {tab === t.k && <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-brand" />}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {tab === "productos" && <ProductsAdmin />}
          {tab === "clips" && <ClipsAdmin />}
          {tab === "torneos" && <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">Gestor de torneos próximamente.</div>}
        </div>
      </section>
    </SiteLayout>
  );
};

const ProductsAdmin = () => {
  const [list, setList] = useState<DBProduct[]>([]);
  const [form, setForm] = useState({ slug: "", name: "", brand: "", type: "goma", price: 0, description: "", badge: "" });

  const load = () => supabase.from("products").select("*").order("created_at", { ascending: false }).then(({ data }) => setList((data as DBProduct[]) || []));
  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from("products").insert({ ...form, badge: form.badge || null });
    if (error) toast.error(error.message);
    else { toast.success("Producto creado"); setForm({ slug: "", name: "", brand: "", type: "goma", price: 0, description: "", badge: "" }); load(); }
  };
  const del = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Eliminado"); load(); }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/30 text-xs uppercase tracking-widest text-muted-foreground">
            <tr><th className="px-4 py-3 text-left">Producto</th><th className="px-4 py-3 text-left">Marca</th><th className="px-4 py-3 text-right">Precio</th><th className="px-4 py-3"></th></tr>
          </thead>
          <tbody>
            {list.map(p => (
              <tr key={p.id} className="border-t border-border/50">
                <td className="px-4 py-3"><p className="font-medium">{p.name}</p><p className="text-xs text-muted-foreground">{p.type} · {p.slug}</p></td>
                <td className="px-4 py-3 text-muted-foreground">{p.brand}</td>
                <td className="px-4 py-3 text-right font-bebas">{formatCLP(p.price)}</td>
                <td className="px-4 py-3 text-right"><Button size="sm" variant="ghost" onClick={() => del(p.id)}>Eliminar</Button></td>
              </tr>
            ))}
            {list.length === 0 && <tr><td colSpan={4} className="p-12 text-center text-muted-foreground">Sin productos aún.</td></tr>}
          </tbody>
        </table>
      </div>

      <form onSubmit={submit} className="rounded-xl border border-border bg-card p-5 space-y-3 h-fit">
        <h3 className="font-display text-xl italic">NUEVO PRODUCTO</h3>
        <div><Label className="text-xs uppercase">Nombre</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required maxLength={120} /></div>
        <div><Label className="text-xs uppercase">Slug</Label><Input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })} required maxLength={120} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label className="text-xs uppercase">Marca</Label><Input value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} required maxLength={60} /></div>
          <div><Label className="text-xs uppercase">Tipo</Label>
            <select className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
              <option value="goma">Goma</option><option value="madera">Madera</option><option value="paleta">Paleta</option><option value="pelota">Pelota</option><option value="kit">Kit</option><option value="accesorio">Accesorio</option>
            </select>
          </div>
        </div>
        <div><Label className="text-xs uppercase">Precio CLP</Label><Input type="number" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} required min={0} max={10000000} /></div>
        <div><Label className="text-xs uppercase">Badge (opcional)</Label><Input value={form.badge} onChange={e => setForm({ ...form, badge: e.target.value })} maxLength={40} placeholder="STOCK SANTIAGO" /></div>
        <div><Label className="text-xs uppercase">Descripción</Label><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} maxLength={500} rows={3} /></div>
        <Button type="submit" variant="hero" className="w-full">Crear producto</Button>
      </form>
    </div>
  );
};

const ClipsAdmin = () => {
  const [list, setList] = useState<DBClip[]>([]);
  const load = () => supabase.from("clips").select("*").order("created_at", { ascending: false }).then(({ data }) => setList((data as DBClip[]) || []));
  useEffect(() => { load(); }, []);
  const moderate = async (id: string, status: "approved" | "rejected") => {
    const { error } = await supabase.from("clips").update({ status }).eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success(`Clip ${status === "approved" ? "aprobado" : "rechazado"}`); load(); }
  };

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-secondary/30 text-xs uppercase tracking-widest text-muted-foreground">
          <tr><th className="px-4 py-3 text-left">Clip</th><th className="px-4 py-3 text-left">Jugador</th><th className="px-4 py-3 text-left">Estado</th><th className="px-4 py-3"></th></tr>
        </thead>
        <tbody>
          {list.map(c => (
            <tr key={c.id} className="border-t border-border/50">
              <td className="px-4 py-3"><p className="font-medium">{c.title}</p><p className="text-xs text-muted-foreground">{c.city}</p></td>
              <td className="px-4 py-3 text-brand">{c.player_handle}</td>
              <td className="px-4 py-3 capitalize">{c.status}</td>
              <td className="px-4 py-3 text-right space-x-2">
                {c.status === "pending" && <>
                  <Button size="sm" variant="outline-brand" onClick={() => moderate(c.id, "approved")}>Aprobar</Button>
                  <Button size="sm" variant="ghost" onClick={() => moderate(c.id, "rejected")}>Rechazar</Button>
                </>}
              </td>
            </tr>
          ))}
          {list.length === 0 && <tr><td colSpan={4} className="p-12 text-center text-muted-foreground">No hay clips para moderar.</td></tr>}
        </tbody>
      </table>
    </div>
  );
};

export default Admin;

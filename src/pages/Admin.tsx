import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SiteLayout } from "@/components/SiteLayout";
import { SEO } from "@/components/SEO";
import { useAuth, useIsAdmin } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Shield, Package, Film, ShoppingBag, Tag, PlusCircle } from "lucide-react";
import { formatCLP } from "@/lib/format";
import { ProductImporter } from "@/components/admin/ProductImporter";
import { OrdersAdmin } from "@/components/admin/OrdersAdmin";

interface DBProduct { id: string; slug: string; name: string; brand: string; type: string; price: number; published: boolean | null; }
interface DBClip { id: string; title: string; status: string; player_handle: string; city: string | null; created_at: string; }
interface DBCategory { id: string; slug: string; name: string; markup_percent: number; sort_order: number; }

type Tab = "importar" | "productos" | "ordenes" | "clips" | "categorias";

const Admin = () => {
  const { user, loading } = useAuth();
  const { isAdmin, checked } = useIsAdmin();
  const [tab, setTab] = useState<Tab>("importar");

  if (loading || !checked) return <SiteLayout><div className="container-px mx-auto max-w-md py-24 text-center text-muted-foreground">Cargando…</div></SiteLayout>;

  if (!user) return (
    <SiteLayout>
      <div className="container-px mx-auto max-w-md py-24 text-center">
        <h1 className="font-display text-3xl italic">Acceso restringido</h1>
        <p className="mt-2 text-muted-foreground">Inicia sesión para acceder al panel.</p>
        <Button asChild variant="hero" className="mt-6"><Link to="/auth">Iniciar sesión</Link></Button>
      </div>
    </SiteLayout>
  );

  if (!isAdmin) return (
    <SiteLayout>
      <div className="container-px mx-auto max-w-md py-24 text-center">
        <Shield className="mx-auto size-10 text-brand" />
        <h1 className="mt-4 font-display text-3xl italic">Sin permisos</h1>
        <p className="mt-2 text-muted-foreground">Esta sección es solo para administradores.</p>
        <Button asChild variant="outline-brand" className="mt-6"><Link to="/">Volver al inicio</Link></Button>
      </div>
    </SiteLayout>
  );

  const tabs: { k: Tab; l: string; i: React.ReactNode }[] = [
    { k: "importar", l: "Importar", i: <PlusCircle className="size-3" /> },
    { k: "productos", l: "Productos", i: <Package className="size-3" /> },
    { k: "ordenes", l: "Órdenes", i: <ShoppingBag className="size-3" /> },
    { k: "categorias", l: "Categorías", i: <Tag className="size-3" /> },
    { k: "clips", l: "Clips", i: <Film className="size-3" /> },
  ];

  return (
    <SiteLayout>
      <SEO title="Admin — PingPongHub" description="Panel de administración." />
      <section className="container-px mx-auto max-w-[1400px] py-10">
        <div className="flex items-center gap-3">
          <Shield className="size-6 text-brand" />
          <h1 className="font-display text-4xl italic">PANEL <span className="text-brand">ADMIN</span></h1>
        </div>

        <div className="mt-8 flex gap-1 border-b border-border overflow-x-auto">
          {tabs.map(t => (
            <button key={t.k} onClick={() => setTab(t.k)} className={`relative flex items-center gap-2 whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${tab === t.k ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              {t.i}{t.l}
              {tab === t.k && <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-brand" />}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {tab === "importar" && <ProductImporter />}
          {tab === "productos" && <ProductsList />}
          {tab === "ordenes" && <OrdersAdmin />}
          {tab === "categorias" && <CategoriesAdmin />}
          {tab === "clips" && <ClipsAdmin />}
        </div>
      </section>
    </SiteLayout>
  );
};

const ProductsList = () => {
  const [list, setList] = useState<DBProduct[]>([]);
  const load = () => supabase.from("products").select("id, slug, name, brand, type, price, published").order("created_at", { ascending: false }).then(({ data }) => setList((data as DBProduct[]) || []));
  useEffect(() => { load(); }, []);
  const togglePublished = async (id: string, current: boolean | null) => {
    await supabase.from("products").update({ published: !current }).eq("id", id);
    load();
  };
  const del = async (id: string) => {
    if (!confirm("¿Eliminar este producto?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Eliminado"); load(); }
  };
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-secondary/30 text-xs uppercase tracking-widest text-muted-foreground">
          <tr><th className="px-4 py-3 text-left">Producto</th><th className="px-4 py-3 text-left">Marca</th><th className="px-4 py-3 text-right">Precio</th><th className="px-4 py-3 text-center">Estado</th><th className="px-4 py-3"></th></tr>
        </thead>
        <tbody>
          {list.map(p => (
            <tr key={p.id} className="border-t border-border/50">
              <td className="px-4 py-3"><p className="font-medium">{p.name}</p><p className="text-xs text-muted-foreground">{p.type} · {p.slug}</p></td>
              <td className="px-4 py-3 text-muted-foreground">{p.brand}</td>
              <td className="px-4 py-3 text-right font-bebas">{formatCLP(p.price)}</td>
              <td className="px-4 py-3 text-center">
                <button onClick={() => togglePublished(p.id, p.published)} className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${p.published ? "bg-calipso/15 text-calipso" : "bg-secondary text-muted-foreground"}`}>
                  {p.published ? "Publicado" : "Borrador"}
                </button>
              </td>
              <td className="px-4 py-3 text-right"><Button size="sm" variant="ghost" onClick={() => del(p.id)}>Eliminar</Button></td>
            </tr>
          ))}
          {list.length === 0 && <tr><td colSpan={5} className="p-12 text-center text-muted-foreground">Sin productos. Importa el primero desde la pestaña "Importar".</td></tr>}
        </tbody>
      </table>
    </div>
  );
};

const CategoriesAdmin = () => {
  const [list, setList] = useState<DBCategory[]>([]);
  const load = () => supabase.from("categories").select("*").order("sort_order").then(({ data }) => setList((data as DBCategory[]) || []));
  useEffect(() => { load(); }, []);
  const updateMarkup = async (id: string, markup: number) => {
    if (markup < 0 || markup > 500) return;
    const { error } = await supabase.from("categories").update({ markup_percent: markup }).eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Markup actualizado"); load(); }
  };
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden max-w-2xl">
      <div className="border-b border-border bg-secondary/30 px-5 py-3">
        <h3 className="font-display text-xl italic">MARKUPS POR CATEGORÍA</h3>
        <p className="text-xs text-muted-foreground">El % se precarga al importar productos de esa categoría.</p>
      </div>
      <table className="w-full text-sm">
        <tbody>
          {list.map(c => (
            <tr key={c.id} className="border-t border-border/50">
              <td className="px-5 py-3"><p className="font-medium">{c.name}</p><p className="text-xs text-muted-foreground">{c.slug}</p></td>
              <td className="px-5 py-3 text-right">
                <div className="inline-flex items-center gap-2">
                  <Input type="number" defaultValue={c.markup_percent} onBlur={e => updateMarkup(c.id, Number(e.target.value))} className="h-8 w-20 text-right" min={0} max={500} />
                  <span className="text-muted-foreground">%</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const ClipsAdmin = () => {
  const [list, setList] = useState<DBClip[]>([]);
  const load = () => supabase.from("clips").select("*").order("created_at", { ascending: false }).then(({ data }) => setList((data as DBClip[]) || []));
  useEffect(() => { load(); }, []);
  const moderate = async (id: string, status: "approved" | "rejected") => {
    const { error } = await supabase.from("clips").update({ status }).eq("id", id);
    if (error) toast.error(error.message); else { toast.success(`Clip ${status === "approved" ? "aprobado" : "rechazado"}`); load(); }
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

// Variable Label needed por el linter pero no usada visiblemente
void Label;

export default Admin;

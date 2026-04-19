import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { formatCLP, formatDateCL } from "@/lib/format";
import { ORDER_STATUS_LABEL } from "@/lib/orderUtils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye, Truck, CheckCircle2, XCircle } from "lucide-react";

interface DBOrder {
  id: string; email: string; full_name: string; phone: string; address: string; city: string; region: string;
  total: number; subtotal: number; shipping: number; status: string; created_at: string;
  tracking_url: string | null; tracking_code: string | null; notes: string | null;
}
interface DBItem { id: string; product_name: string; product_image: string | null; unit_price: number; quantity: number; }

export const OrdersAdmin = () => {
  const [list, setList] = useState<DBOrder[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [selected, setSelected] = useState<DBOrder | null>(null);
  const [items, setItems] = useState<DBItem[]>([]);
  const [tracking, setTracking] = useState({ code: "", url: "" });

  const load = () => supabase.from("orders").select("*").order("created_at", { ascending: false }).then(({ data }) => setList((data as DBOrder[]) || []));
  useEffect(() => { load(); }, []);

  const openDetail = async (o: DBOrder) => {
    setSelected(o);
    setTracking({ code: o.tracking_code || "", url: o.tracking_url || "" });
    const { data } = await supabase.from("order_items").select("*").eq("order_id", o.id);
    setItems((data as DBItem[]) || []);
  };

  const updateStatus = async (id: string, status: string, extra: Record<string, unknown> = {}) => {
    const { error } = await supabase.from("orders").update({ status, ...extra }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success(`Orden ${status}`);
    load();
    setSelected(s => s && s.id === id ? { ...s, status, ...extra } as DBOrder : s);
  };

  const saveTracking = async () => {
    if (!selected) return;
    await updateStatus(selected.id, "shipped", { tracking_code: tracking.code, tracking_url: tracking.url });
  };

  const filtered = filter === "all" ? list : list.filter(o => o.status === filter);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {["all", "pending", "paid", "shipped", "delivered", "cancelled"].map(s => (
          <button key={s} onClick={() => setFilter(s)} className={`rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-widest transition-colors ${filter === s ? "bg-brand text-brand-foreground" : "bg-secondary/60 text-muted-foreground hover:text-foreground"}`}>
            {s === "all" ? "Todas" : ORDER_STATUS_LABEL[s]?.label || s} ({s === "all" ? list.length : list.filter(o => o.status === s).length})
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/30 text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Orden</th>
              <th className="px-4 py-3 text-left">Cliente</th>
              <th className="px-4 py-3 text-left">Fecha</th>
              <th className="px-4 py-3 text-right">Total</th>
              <th className="px-4 py-3 text-left">Estado</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(o => {
              const st = ORDER_STATUS_LABEL[o.status] || ORDER_STATUS_LABEL.pending;
              return (
                <tr key={o.id} className="border-t border-border/50 hover:bg-secondary/20">
                  <td className="px-4 py-3 font-mono text-xs">#{o.id.slice(0, 8).toUpperCase()}</td>
                  <td className="px-4 py-3"><p className="font-medium">{o.full_name}</p><p className="text-xs text-muted-foreground">{o.email}</p></td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{formatDateCL(o.created_at)}</td>
                  <td className="px-4 py-3 text-right font-bebas text-base text-brand">{formatCLP(o.total)}</td>
                  <td className="px-4 py-3"><span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${st.color}`}>{st.label}</span></td>
                  <td className="px-4 py-3 text-right"><Button size="sm" variant="ghost" onClick={() => openDetail(o)}><Eye className="size-4" /></Button></td>
                </tr>
              );
            })}
            {filtered.length === 0 && <tr><td colSpan={6} className="p-12 text-center text-muted-foreground">Sin órdenes en este estado.</td></tr>}
          </tbody>
        </table>
      </div>

      <Dialog open={!!selected} onOpenChange={o => !o && setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader><DialogTitle className="font-display text-2xl italic">ORDEN #{selected.id.slice(0, 8).toUpperCase()}</DialogTitle></DialogHeader>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-border p-3 text-sm">
                  <p className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Cliente</p>
                  <p className="mt-1">{selected.full_name}</p>
                  <p className="text-muted-foreground">{selected.email}</p>
                  <p className="text-muted-foreground">{selected.phone}</p>
                </div>
                <div className="rounded-lg border border-border p-3 text-sm">
                  <p className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Envío</p>
                  <p className="mt-1">{selected.address}</p>
                  <p className="text-muted-foreground">{selected.city}, {selected.region}</p>
                  {selected.notes && <p className="mt-2 text-xs italic text-muted-foreground">"{selected.notes}"</p>}
                </div>
              </div>

              <div className="rounded-lg border border-border p-3 space-y-2">
                {items.map(it => (
                  <div key={it.id} className="flex items-center gap-3 text-sm">
                    {it.product_image && <img src={it.product_image} alt={it.product_name} className="size-10 rounded object-cover" />}
                    <p className="flex-1">{it.product_name} <span className="text-muted-foreground">×{it.quantity}</span></p>
                    <p className="font-display italic">{formatCLP(it.unit_price * it.quantity)}</p>
                  </div>
                ))}
                <div className="border-t border-border pt-2 flex justify-between font-display text-lg italic"><span>TOTAL</span><span className="text-brand">{formatCLP(selected.total)}</span></div>
              </div>

              <div className="rounded-lg border border-calipso/30 bg-calipso/5 p-4 space-y-3">
                <p className="text-xs font-bold uppercase tracking-widest text-calipso">Tracking AliExpress / Correos</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  <Input placeholder="Código tracking" value={tracking.code} onChange={e => setTracking({ ...tracking, code: e.target.value })} />
                  <Input placeholder="URL tracking" value={tracking.url} onChange={e => setTracking({ ...tracking, url: e.target.value })} />
                </div>
                <Button size="sm" variant="hero" onClick={saveTracking}><Truck className="size-3" />Marcar enviada con tracking</Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {selected.status === "pending" && <Button size="sm" variant="outline-brand" onClick={() => updateStatus(selected.id, "paid")}><CheckCircle2 className="size-3" />Marcar pagada</Button>}
                {(selected.status === "shipped" || selected.status === "paid") && <Button size="sm" variant="outline-brand" onClick={() => updateStatus(selected.id, "delivered")}><CheckCircle2 className="size-3" />Marcar entregada</Button>}
                {selected.status !== "cancelled" && selected.status !== "delivered" && <Button size="sm" variant="ghost" onClick={() => updateStatus(selected.id, "cancelled")}><XCircle className="size-3" />Cancelar</Button>}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

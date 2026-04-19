import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { SiteLayout } from "@/components/SiteLayout";
import { SEO } from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { formatCLP, formatDateCL } from "@/lib/format";
import { ORDER_STATUS_LABEL } from "@/lib/orderUtils";
import { CheckCircle2, Clock, ExternalLink, Loader2, Package } from "lucide-react";

interface DBOrder {
  id: string; status: string; email: string; full_name: string; phone: string;
  address: string; city: string; region: string; subtotal: number; shipping: number; total: number;
  created_at: string; tracking_url: string | null; tracking_code: string | null;
}
interface DBItem { id: string; product_name: string; product_image: string | null; product_slug: string; unit_price: number; quantity: number; subtotal: number; }

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<DBOrder | null>(null);
  const [items, setItems] = useState<DBItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      supabase.from("orders").select("*").eq("id", id).maybeSingle(),
      supabase.from("order_items").select("*").eq("order_id", id),
    ]).then(([o, it]) => {
      setOrder((o.data as DBOrder) || null);
      setItems((it.data as DBItem[]) || []);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <SiteLayout><div className="container-px mx-auto max-w-md py-24 text-center"><Loader2 className="mx-auto size-6 animate-spin text-brand" /></div></SiteLayout>;
  if (!order) return <SiteLayout><div className="container-px mx-auto max-w-md py-24 text-center text-muted-foreground">Orden no encontrada.</div></SiteLayout>;

  const status = ORDER_STATUS_LABEL[order.status] || ORDER_STATUS_LABEL.pending;
  const isPaid = order.status === "paid" || order.status === "shipped" || order.status === "delivered";

  return (
    <SiteLayout>
      <SEO title={`Orden #${order.id.slice(0, 8)} — PingPongHub`} description="Detalle de tu orden" />
      <section className="container-px mx-auto max-w-3xl py-12">
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          {isPaid ? <CheckCircle2 className="mx-auto size-14 text-calipso" /> : <Clock className="mx-auto size-14 text-yellow-500" />}
          <h1 className="mt-4 font-display text-3xl italic md:text-4xl">{isPaid ? "¡PAGO CONFIRMADO!" : "ORDEN CREADA"}</h1>
          <p className="mt-2 text-sm text-muted-foreground">Orden #{order.id.slice(0, 8).toUpperCase()} · {formatDateCL(order.created_at)}</p>
          <span className={`mt-4 inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest ${status.color}`}>{status.label}</span>
          {!isPaid && <p className="mt-4 text-sm text-muted-foreground">Te enviamos un email a <span className="text-foreground">{order.email}</span> con instrucciones para coordinar el pago.</p>}
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-display text-lg italic">PRODUCTOS</h2>
            <div className="mt-3 space-y-3">
              {items.map(it => (
                <div key={it.id} className="flex gap-3 text-sm">
                  {it.product_image && <img src={it.product_image} alt={it.product_name} className="size-14 rounded-md object-cover" />}
                  <div className="flex-1">
                    <p className="line-clamp-2">{it.product_name}</p>
                    <p className="text-xs text-muted-foreground">{formatCLP(it.unit_price)} × {it.quantity}</p>
                  </div>
                  <p className="font-display italic">{formatCLP(it.subtotal)}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-1 border-t border-border pt-3 text-sm">
              <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>{formatCLP(order.subtotal)}</span></div>
              <div className="flex justify-between text-muted-foreground"><span>Envío</span><span>{order.shipping === 0 ? "GRATIS" : formatCLP(order.shipping)}</span></div>
              <div className="flex justify-between font-display text-xl italic pt-2 border-t border-border"><span>TOTAL</span><span className="text-brand">{formatCLP(order.total)}</span></div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-display text-lg italic">ENVÍO</h2>
              <div className="mt-3 space-y-1 text-sm">
                <p className="font-medium">{order.full_name}</p>
                <p className="text-muted-foreground">{order.address}</p>
                <p className="text-muted-foreground">{order.city}, {order.region}</p>
                <p className="text-muted-foreground">{order.phone}</p>
              </div>
            </div>

            {order.tracking_code && (
              <div className="rounded-xl border border-calipso/30 bg-calipso/5 p-6">
                <h2 className="font-display text-lg italic flex items-center gap-2"><Package className="size-4 text-calipso" />SEGUIMIENTO</h2>
                <p className="mt-2 text-sm font-mono">{order.tracking_code}</p>
                {order.tracking_url && <Button asChild variant="outline-brand" size="sm" className="mt-3"><a href={order.tracking_url} target="_blank" rel="noopener noreferrer">Ver tracking <ExternalLink className="size-3" /></a></Button>}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-center"><Button asChild variant="ghost"><Link to="/equipamiento">Seguir comprando</Link></Button></div>
      </section>
    </SiteLayout>
  );
};

export default OrderDetail;

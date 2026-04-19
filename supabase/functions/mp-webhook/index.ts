// Edge function: mp-webhook
// Recibe notificaciones de Mercado Pago y actualiza el estado de la orden.
// Verifica el pago llamando a la API de MP con el payment_id recibido.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.55.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-signature, x-request-id",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const MP_TOKEN = Deno.env.get("MP_ACCESS_TOKEN");
    if (!MP_TOKEN) {
      return new Response("MP not configured", { status: 503, headers: corsHeaders });
    }

    const url = new URL(req.url);
    const topic = url.searchParams.get("type") || url.searchParams.get("topic");
    const id = url.searchParams.get("id") || url.searchParams.get("data.id");

    let payload: { type?: string; data?: { id?: string } } = {};
    try { payload = await req.json(); } catch { /* webhook puede venir vacío */ }

    const paymentId = payload?.data?.id || id;
    const eventType = payload?.type || topic;

    if (eventType !== "payment" || !paymentId) {
      return new Response("ignored", { status: 200, headers: corsHeaders });
    }

    // Consultar el pago en MP
    const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { "Authorization": `Bearer ${MP_TOKEN}` },
    });

    if (!mpRes.ok) {
      console.error("MP payment fetch failed:", await mpRes.text());
      return new Response("mp fetch failed", { status: 200, headers: corsHeaders });
    }

    const payment = await mpRes.json();
    const orderId = payment.external_reference;
    if (!orderId) return new Response("no external_reference", { status: 200, headers: corsHeaders });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    let newStatus = "pending";
    if (payment.status === "approved") newStatus = "paid";
    else if (payment.status === "rejected" || payment.status === "cancelled") newStatus = "cancelled";

    await supabase.from("orders").update({
      status: newStatus,
      payment_id: String(paymentId),
    }).eq("id", orderId);

    return new Response(JSON.stringify({ ok: true, status: newStatus }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("mp-webhook error:", err);
    return new Response("error", { status: 200, headers: corsHeaders });
  }
});

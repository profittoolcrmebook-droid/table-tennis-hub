// Edge function: create-mp-preference
// Crea una preferencia de pago en Mercado Pago para una orden existente.
// Si MP_ACCESS_TOKEN no está configurado, devuelve 503 con mensaje claro
// para que el frontend caiga al flujo "contactar para coordinar pago".

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.55.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderRow {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  total: number;
  subtotal: number;
  shipping: number;
  status: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { order_id } = await req.json().catch(() => ({}));
    if (!order_id || typeof order_id !== "string") {
      return new Response(JSON.stringify({ error: "order_id requerido" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const MP_TOKEN = Deno.env.get("MP_ACCESS_TOKEN");
    if (!MP_TOKEN) {
      return new Response(JSON.stringify({
        error: "MP_ACCESS_TOKEN no configurado",
        hint: "El admin debe agregar el Access Token de Mercado Pago en los secretos.",
      }), {
        status: 503,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: order, error: orderErr } = await supabase
      .from("orders")
      .select("id, email, full_name, phone, total, subtotal, shipping, status")
      .eq("id", order_id)
      .maybeSingle();

    if (orderErr || !order) {
      return new Response(JSON.stringify({ error: "Orden no encontrada" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const o = order as OrderRow;
    if (o.status !== "pending") {
      return new Response(JSON.stringify({ error: "Esta orden ya no está pendiente" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: items } = await supabase
      .from("order_items")
      .select("product_name, quantity, unit_price")
      .eq("order_id", order_id);

    const origin = req.headers.get("origin") || req.headers.get("referer")?.split("/").slice(0, 3).join("/") || "https://pingponghub.cl";

    const preference = {
      items: (items || []).map((it) => ({
        title: String(it.product_name).slice(0, 250),
        quantity: Number(it.quantity),
        unit_price: Number(it.unit_price),
        currency_id: "CLP",
      })),
      payer: {
        email: o.email,
        name: o.full_name.split(" ")[0],
        surname: o.full_name.split(" ").slice(1).join(" ") || o.full_name,
      },
      shipments: { cost: Number(o.shipping), mode: "not_specified" },
      external_reference: o.id,
      back_urls: {
        success: `${origin}/orden/${o.id}?status=success`,
        pending: `${origin}/orden/${o.id}?status=pending`,
        failure: `${origin}/orden/${o.id}?status=failure`,
      },
      auto_return: "approved",
      notification_url: `${Deno.env.get("SUPABASE_URL")}/functions/v1/mp-webhook`,
      statement_descriptor: "PINGPONGHUB",
    };

    const mpRes = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${MP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(preference),
    });

    const mpData = await mpRes.json();
    if (!mpRes.ok) {
      console.error("MP error:", mpData);
      return new Response(JSON.stringify({ error: "Error en Mercado Pago", details: mpData }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    await supabase.from("orders").update({ preference_id: mpData.id }).eq("id", o.id);

    return new Response(JSON.stringify({
      preference_id: mpData.id,
      init_point: mpData.init_point,
      sandbox_init_point: mpData.sandbox_init_point,
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("create-mp-preference error:", err);
    const msg = err instanceof Error ? err.message : "Error desconocido";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

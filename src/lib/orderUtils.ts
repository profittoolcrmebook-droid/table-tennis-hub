// Cálculo de markup para dropshipping AliExpress → CLP
export interface MarkupInput {
  costUsd: number;
  shippingUsd: number;
  exchangeRate: number; // CLP por USD (ej: 950)
  markupPercent: number; // ej: 80 = +80%
}

export const calculateFinalPrice = ({ costUsd, shippingUsd, exchangeRate, markupPercent }: MarkupInput): number => {
  const baseClp = (costUsd + shippingUsd) * exchangeRate;
  const withMarkup = baseClp * (1 + markupPercent / 100);
  // Redondear a múltiplo de 90 (precio psicológico CLP: $X.990)
  return Math.max(990, Math.round(withMarkup / 1000) * 1000 - 10);
};

export const SHIPPING_THRESHOLD = 50000;
export const SHIPPING_FLAT = 4990;
export const calculateShipping = (subtotal: number) => subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;

// Validador básico de RUT chileno (formato y dígito verificador)
export const validateRut = (rut: string): boolean => {
  const clean = rut.replace(/[.\-\s]/g, "").toUpperCase();
  if (!/^\d{7,8}[0-9K]$/.test(clean)) return false;
  const body = clean.slice(0, -1);
  const dv = clean.slice(-1);
  let sum = 0, mul = 2;
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i]) * mul;
    mul = mul === 7 ? 2 : mul + 1;
  }
  const calc = 11 - (sum % 11);
  const expected = calc === 11 ? "0" : calc === 10 ? "K" : String(calc);
  return dv === expected;
};

export const REGIONES_CHILE = [
  "Arica y Parinacota", "Tarapacá", "Antofagasta", "Atacama", "Coquimbo",
  "Valparaíso", "Metropolitana", "O'Higgins", "Maule", "Ñuble",
  "Biobío", "Araucanía", "Los Ríos", "Los Lagos", "Aysén", "Magallanes",
];

export const ORDER_STATUS_LABEL: Record<string, { label: string; color: string }> = {
  pending: { label: "Pendiente de pago", color: "bg-yellow-500/15 text-yellow-500" },
  paid: { label: "Pagada", color: "bg-calipso/15 text-calipso" },
  shipped: { label: "Enviada", color: "bg-blue-500/15 text-blue-400" },
  delivered: { label: "Entregada", color: "bg-green-500/15 text-green-500" },
  cancelled: { label: "Cancelada", color: "bg-destructive/15 text-destructive" },
};

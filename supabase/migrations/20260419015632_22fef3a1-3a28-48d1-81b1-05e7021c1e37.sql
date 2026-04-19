-- Categorías con markup configurable
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  markup_percent numeric(5,2) NOT NULL DEFAULT 100.00,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categorías visibles para todos"
  ON public.categories FOR SELECT USING (true);

CREATE POLICY "Admin gestiona categorías"
  ON public.categories FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed categorías iniciales con markups sugeridos
INSERT INTO public.categories (slug, name, markup_percent, sort_order) VALUES
  ('paleta', 'Paletas', 80, 1),
  ('goma', 'Gomas', 100, 2),
  ('madera', 'Maderos', 90, 3),
  ('pelota', 'Pelotas', 150, 4),
  ('kit', 'Kits', 70, 5),
  ('accesorio', 'Accesorios', 130, 6);

-- Extender products con datos de origen AliExpress y specs
ALTER TABLE public.products
  ADD COLUMN source_url text,
  ADD COLUMN cost_usd numeric(10,2),
  ADD COLUMN shipping_cost_usd numeric(10,2) DEFAULT 0,
  ADD COLUMN exchange_rate numeric(10,2),
  ADD COLUMN markup_percent numeric(5,2),
  ADD COLUMN images jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN specs jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN published boolean NOT NULL DEFAULT true;

-- Órdenes
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  email text NOT NULL,
  full_name text NOT NULL,
  phone text NOT NULL,
  rut text,
  address text NOT NULL,
  city text NOT NULL,
  region text NOT NULL,
  notes text,
  subtotal int NOT NULL,
  shipping int NOT NULL DEFAULT 0,
  total int NOT NULL,
  currency text NOT NULL DEFAULT 'CLP',
  status text NOT NULL DEFAULT 'pending', -- pending | paid | shipped | delivered | cancelled
  payment_provider text NOT NULL DEFAULT 'mercadopago',
  payment_id text,
  preference_id text,
  tracking_url text,
  tracking_code text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuario ve sus órdenes"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Cualquiera crea orden (guest checkout)"
  ON public.orders FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin actualiza órdenes"
  ON public.orders FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);

-- Items de la orden
CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  product_slug text NOT NULL,
  product_image text,
  unit_price int NOT NULL,
  quantity int NOT NULL CHECK (quantity > 0),
  subtotal int NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Items visibles si orden visible"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      WHERE o.id = order_id
      AND (auth.uid() = o.user_id OR public.has_role(auth.uid(), 'admin'))
    )
  );

CREATE POLICY "Cualquiera crea items en checkout"
  ON public.order_items FOR INSERT WITH CHECK (true);

CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
CREATE TABLE public.rankings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL CHECK (category IN ('wtt_men','wtt_women','chi_men','chi_women')),
  position INTEGER NOT NULL,
  player_name TEXT NOT NULL,
  country TEXT,
  flag TEXT,
  points INTEGER,
  club TEXT,
  photo_url TEXT,
  trend TEXT CHECK (trend IS NULL OR trend IN ('up','down','same')),
  source_url TEXT,
  synced_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (category, position)
);

CREATE INDEX idx_rankings_category_position ON public.rankings (category, position);

ALTER TABLE public.rankings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Rankings visibles para todos"
ON public.rankings FOR SELECT USING (true);

CREATE POLICY "Admin gestiona rankings"
ON public.rankings FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_rankings_updated_at
BEFORE UPDATE ON public.rankings
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
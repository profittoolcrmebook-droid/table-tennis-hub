import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Trash2, Plus, RefreshCw } from "lucide-react";

interface Ranking {
  id: string;
  category: string;
  position: number;
  player_name: string;
  country: string | null;
  flag: string | null;
  points: number | null;
  club: string | null;
  photo_url: string | null;
  trend: string | null;
  synced_at: string | null;
}

const CATEGORIES = [
  { k: "wtt_men", l: "WTT Top 10 Hombres", limit: 10 },
  { k: "wtt_women", l: "WTT Top 10 Mujeres", limit: 10 },
  { k: "chi_men", l: "Chile Top 5 Hombres", limit: 5 },
  { k: "chi_women", l: "Chile Top 5 Mujeres", limit: 5 },
];

export const RankingsAdmin = () => {
  const [tab, setTab] = useState(CATEGORIES[0].k);
  const [rows, setRows] = useState<Ranking[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("rankings")
      .select("*")
      .eq("category", tab)
      .order("position");
    setRows((data as Ranking[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [tab]);

  const update = async (id: string, patch: Partial<Ranking>) => {
    const { error } = await supabase.from("rankings").update(patch).eq("id", id);
    if (error) toast.error(error.message);
    else load();
  };

  const del = async (id: string) => {
    if (!confirm("¿Eliminar fila?")) return;
    const { error } = await supabase.from("rankings").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Eliminada"); load(); }
  };

  const addRow = async () => {
    const cat = CATEGORIES.find(c => c.k === tab)!;
    const next = (rows[rows.length - 1]?.position || 0) + 1;
    if (next > cat.limit) { toast.error(`Límite: ${cat.limit} jugadores`); return; }
    const { error } = await supabase.from("rankings").insert({
      category: tab,
      position: next,
      player_name: "Nuevo jugador",
      flag: tab.startsWith("chi") ? "🇨🇱" : "🌍",
      country: tab.startsWith("chi") ? "CHI" : "",
      points: 0,
    });
    if (error) toast.error(error.message); else load();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex flex-wrap gap-1 rounded-lg border border-border bg-card p-1">
          {CATEGORIES.map(c => (
            <button
              key={c.k}
              onClick={() => setTab(c.k)}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-widest rounded transition-colors ${
                tab === c.k ? "bg-brand text-brand-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {c.l}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" onClick={load} disabled={loading}>
            <RefreshCw className={`size-3 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button size="sm" variant="outline-brand" onClick={addRow}>
            <Plus className="size-3" /> Agregar
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/30 text-xs uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="px-3 py-3 text-left w-12">#</th>
              <th className="px-3 py-3 text-left">Jugador</th>
              <th className="px-3 py-3 text-left w-20">Bandera</th>
              <th className="px-3 py-3 text-left w-20">País</th>
              <th className="px-3 py-3 text-right w-28">Puntos</th>
              <th className="px-3 py-3 w-12"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id} className="border-t border-border/50">
                <td className="px-3 py-2">
                  <Input
                    type="number"
                    defaultValue={r.position}
                    onBlur={e => update(r.id, { position: Number(e.target.value) })}
                    className="h-8 w-14 text-center font-bebas text-lg"
                  />
                </td>
                <td className="px-3 py-2">
                  <Input
                    defaultValue={r.player_name}
                    onBlur={e => update(r.id, { player_name: e.target.value })}
                    className="h-8"
                  />
                </td>
                <td className="px-3 py-2">
                  <Input
                    defaultValue={r.flag || ""}
                    onBlur={e => update(r.id, { flag: e.target.value })}
                    className="h-8 w-16 text-center text-lg"
                  />
                </td>
                <td className="px-3 py-2">
                  <Input
                    defaultValue={r.country || ""}
                    onBlur={e => update(r.id, { country: e.target.value.toUpperCase() })}
                    className="h-8 w-16 uppercase"
                    maxLength={3}
                  />
                </td>
                <td className="px-3 py-2">
                  <Input
                    type="number"
                    defaultValue={r.points || 0}
                    onBlur={e => update(r.id, { points: Number(e.target.value) })}
                    className="h-8 w-24 text-right font-bebas"
                  />
                </td>
                <td className="px-3 py-2 text-right">
                  <Button size="sm" variant="ghost" onClick={() => del(r.id)}>
                    <Trash2 className="size-3" />
                  </Button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && !loading && (
              <tr><td colSpan={6} className="p-12 text-center text-muted-foreground">
                Sin jugadores. Agrega el primero.
              </td></tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-muted-foreground">
        💡 Los cambios se guardan al salir del campo (blur). Tu scraper VPS puede usar esta tabla vía edge function.
      </p>
    </div>
  );
};
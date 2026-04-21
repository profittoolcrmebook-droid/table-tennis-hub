import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Trophy, TrendingUp } from "lucide-react";

interface Ranking {
  id: string;
  category: string;
  position: number;
  player_name: string;
  country: string | null;
  flag: string | null;
  points: number | null;
}

const TABS = [
  { k: "wtt_men", l: "WTT Hombres", short: "M" },
  { k: "wtt_women", l: "WTT Mujeres", short: "W" },
  { k: "chi_men", l: "Chile Hombres", short: "CL M" },
  { k: "chi_women", l: "Chile Mujeres", short: "CL W" },
];

export const RankingsSection = () => {
  const [tab, setTab] = useState(TABS[0].k);
  const [rows, setRows] = useState<Ranking[]>([]);

  useEffect(() => {
    supabase
      .from("rankings")
      .select("*")
      .eq("category", tab)
      .order("position")
      .then(({ data }) => setRows((data as Ranking[]) || []));
  }, [tab]);

  return (
    <section className="container-px mx-auto max-w-[1400px] py-16">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
        <div>
          <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-brand">
            <Trophy className="size-3" /> Ranking oficial
          </span>
          <h2 className="font-display text-5xl italic mt-2">
            TOP <span className="text-brand">JUGADORES</span>
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Ranking mundial WTT y nacional Chile · actualizado automáticamente.
          </p>
        </div>
        <div className="flex flex-wrap gap-1 rounded-lg border border-border bg-card p-1">
          {TABS.map(t => (
            <button
              key={t.k}
              onClick={() => setTab(t.k)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-widest rounded transition-colors ${
                tab === t.k ? "bg-brand text-brand-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.l}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <table className="w-full">
          <thead className="bg-secondary/30 border-b border-border">
            <tr className="text-xs uppercase tracking-widest text-muted-foreground">
              <th className="px-4 py-3 text-left w-16">Pos</th>
              <th className="px-4 py-3 text-left">Jugador</th>
              <th className="px-4 py-3 text-left">País</th>
              <th className="px-4 py-3 text-right">Puntos</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={r.id}
                className={`border-t border-border/50 transition-colors hover:bg-secondary/20 ${
                  r.position <= 3 ? "bg-brand/5" : ""
                }`}
              >
                <td className="px-4 py-4">
                  <div className={`grid place-items-center size-9 rounded-full font-bebas text-lg ${
                    r.position === 1 ? "bg-brand text-brand-foreground" :
                    r.position <= 3 ? "bg-brand/20 text-brand" :
                    "bg-secondary text-foreground"
                  }`}>
                    {r.position}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <p className="font-bold">{r.player_name}</p>
                </td>
                <td className="px-4 py-4">
                  <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="text-2xl">{r.flag}</span>
                    <span className="font-mono text-xs">{r.country}</span>
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <span className="font-bebas text-2xl text-brand">
                    {r.points?.toLocaleString() || "—"}
                  </span>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={4} className="p-12 text-center text-muted-foreground">
                Cargando ranking…
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};
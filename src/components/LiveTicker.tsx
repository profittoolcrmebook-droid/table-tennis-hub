import { liveMatches } from "@/data/demo";

export const LiveTicker = () => {
  const items = [...liveMatches, ...liveMatches];
  return (
    <div className="relative h-9 overflow-hidden border-b border-border bg-background">
      <div className="absolute inset-y-0 left-0 z-10 flex items-center gap-2 bg-brand px-4 text-xs font-bold uppercase tracking-widest text-brand-foreground">
        <span className="live-dot" /> WTT Live
      </div>
      <div className="flex h-full animate-marquee whitespace-nowrap">
        {items.map((m, i) => (
          <div key={i} className="flex items-center gap-3 px-8 text-sm">
            <span className="text-muted-foreground">{m.tournament}</span>
            <span className="font-bebas tracking-wider">
              {m.flag1} {m.player1} <span className="text-brand">{m.score}</span> {m.player2} {m.flag2}
            </span>
            <span className="text-muted-foreground">•</span>
          </div>
        ))}
      </div>
    </div>
  );
};

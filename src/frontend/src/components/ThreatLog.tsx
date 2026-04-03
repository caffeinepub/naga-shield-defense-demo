import { ScrollArea } from "@/components/ui/scroll-area";
import type { ThreatEntry, ThreatOutcome } from "../hooks/useSimulation";

interface ThreatLogProps {
  threats: ThreatEntry[];
}

function outcomeColor(outcome: ThreatOutcome) {
  if (outcome === "NEUTRALIZED") return "#28E7B7";
  if (outcome === "DRAINING") return "#F6B24A";
  return "#3AA7FF";
}

function outcomeBg(outcome: ThreatOutcome) {
  if (outcome === "NEUTRALIZED") return "rgba(40,231,183,0.1)";
  if (outcome === "DRAINING") return "rgba(246,178,74,0.1)";
  return "rgba(58,167,255,0.1)";
}

function formatCycles(n: number) {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)}M`;
  return n.toLocaleString();
}

export function ThreatLog({ threats }: ThreatLogProps) {
  return (
    <div className="card-hud p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-1">
        <span
          className="font-orbitron text-naga-muted uppercase"
          style={{ fontSize: "11px", letterSpacing: "0.15em" }}
        >
          THREAT INTELLIGENCE LOG
        </span>
        <div
          className="px-2 py-0.5 rounded"
          style={{
            background: "rgba(40,231,183,0.1)",
            border: "1px solid rgba(40,231,183,0.3)",
          }}
        >
          <span
            className="font-orbitron text-naga-green"
            style={{ fontSize: "9px" }}
          >
            {threats.length} ENTRIES
          </span>
        </div>
      </div>

      {/* Audit honesty label */}
      <div
        className="mb-3 px-2 py-1 rounded flex items-center gap-2"
        style={{
          background: "rgba(246,178,74,0.07)",
          border: "1px solid rgba(246,178,74,0.25)",
        }}
      >
        <span
          className="font-orbitron font-bold"
          style={{ fontSize: "8px", color: "#F6B24A", letterSpacing: "0.12em" }}
        >
          PHASE 1 CONCEPTUAL DEMONSTRATION
        </span>
        <span style={{ fontSize: "8px", color: "#6F8196" }}>
          — behavioral simulation layer, not live threat evidence
        </span>
      </div>

      {/* Column headers */}
      <div
        className="grid gap-1 pb-2 mb-2"
        style={{
          gridTemplateColumns: "1fr 2fr 1.2fr 0.8fr 0.9fr",
          borderBottom: "1px solid rgba(60,150,190,0.2)",
        }}
      >
        {["TIMESTAMP", "ATTACKER PRINCIPAL", "TARGET", "CYCLES", "OUTCOME"].map(
          (h) => (
            <span
              key={h}
              className="font-orbitron text-naga-muted"
              style={{ fontSize: "8px", letterSpacing: "0.1em" }}
            >
              {h}
            </span>
          ),
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-1" data-ocid="threat.list">
          {threats.map((entry, idx) => (
            <div
              key={entry.id}
              data-ocid={`threat.item.${idx + 1}`}
              className="grid gap-1 py-1.5 rounded px-1 hover:bg-white/5 transition-colors"
              style={{
                gridTemplateColumns: "1fr 2fr 1.2fr 0.8fr 0.9fr",
                borderBottom: "1px solid rgba(60,150,190,0.08)",
              }}
            >
              <span
                style={{
                  fontSize: "9px",
                  color: "#6F8196",
                  fontFamily: "monospace",
                }}
              >
                {entry.timestamp.slice(5, 19)}
              </span>
              <span
                className="truncate"
                style={{
                  fontSize: "9px",
                  color: "#9AA9BA",
                  fontFamily: "monospace",
                }}
                title={entry.attackerPrincipal}
              >
                {entry.attackerPrincipal.length > 24
                  ? `${entry.attackerPrincipal.slice(0, 12)}...${entry.attackerPrincipal.slice(-6)}`
                  : entry.attackerPrincipal}
              </span>
              <span
                className="font-orbitron truncate"
                style={{ fontSize: "8px", color: "#F6B24A" }}
              >
                {entry.targetCanister
                  .replace(/_/g, "_")
                  .toUpperCase()
                  .substring(0, 14)}
              </span>
              <span
                className="font-orbitron"
                style={{ fontSize: "9px", color: "#E6EEF7" }}
              >
                {formatCycles(entry.cyclesDrained)}
              </span>
              <span>
                <span
                  className="font-orbitron px-1 py-0.5 rounded"
                  style={{
                    fontSize: "8px",
                    color: outcomeColor(entry.outcome),
                    background: outcomeBg(entry.outcome),
                    letterSpacing: "0.05em",
                  }}
                >
                  {entry.outcome}
                </span>
              </span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

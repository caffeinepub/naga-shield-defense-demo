import { AlertTriangle, Zap } from "lucide-react";
import type { HoneypotState } from "../hooks/useSimulation";

interface HoneypotVisualizerProps {
  honeypot: HoneypotState;
}

function formatCycles(n: number) {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  return n.toLocaleString();
}

const PHASE_COLORS = {
  IDLE: "#6F8196",
  ACTIVATING: "#F6B24A",
  DRAINING: "#FF4B5C",
  NEUTRALIZED: "#28E7B7",
};

const PHASE_LABELS = {
  IDLE: "STANDING BY",
  ACTIVATING: "HONEYPOT ACTIVATING...",
  DRAINING: "DRAINING ATTACKER CYCLES",
  NEUTRALIZED: "THREAT NEUTRALIZED",
};

export function HoneypotVisualizer({ honeypot }: HoneypotVisualizerProps) {
  const color = PHASE_COLORS[honeypot.phase];
  const isActive = honeypot.phase !== "IDLE";

  return (
    <div
      className="card-hud p-4 h-full flex flex-col"
      style={{
        borderColor:
          honeypot.phase === "DRAINING"
            ? "rgba(255,75,92,0.6)"
            : honeypot.phase === "NEUTRALIZED"
              ? "rgba(40,231,183,0.6)"
              : honeypot.phase === "ACTIVATING"
                ? "rgba(246,178,74,0.6)"
                : "rgba(60,150,190,0.35)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle size={14} style={{ color }} />
          <span
            className="font-orbitron"
            style={{
              fontSize: "11px",
              letterSpacing: "0.15em",
              color: "#9AA9BA",
            }}
          >
            HONEYPOT / ROSE GAS MODEL
          </span>
        </div>
        <div
          className="flex items-center gap-1.5 px-2 py-1 rounded"
          style={{
            backgroundColor: `${color}20`,
            border: `1px solid ${color}60`,
          }}
        >
          {isActive && (
            <div
              className="status-dot"
              style={{
                backgroundColor: color,
                boxShadow: `0 0 6px ${color}`,
                animationDuration:
                  honeypot.phase === "DRAINING" ? "0.5s" : "1.5s",
              }}
            />
          )}
          <span
            className="font-orbitron font-bold"
            style={{ fontSize: "9px", color, letterSpacing: "0.15em" }}
          >
            {PHASE_LABELS[honeypot.phase]}
          </span>
        </div>
      </div>

      {/* Status illustration */}
      <div
        className="flex-1 flex flex-col items-center justify-center rounded-lg py-4"
        style={{
          background: isActive
            ? `linear-gradient(135deg, ${color}08 0%, ${color}03 100%)`
            : "rgba(0,0,0,0.2)",
          border: `1px dashed ${color}30`,
          minHeight: "140px",
        }}
      >
        {honeypot.phase === "IDLE" ? (
          <div className="text-center">
            <div
              className="mx-auto mb-2 rounded-full flex items-center justify-center"
              style={{
                width: "48px",
                height: "48px",
                background: "rgba(41,214,255,0.08)",
                border: "1px solid rgba(41,214,255,0.2)",
              }}
            >
              <Zap size={22} style={{ color: "#29D6FF", opacity: 0.5 }} />
            </div>
            <div
              className="text-naga-muted font-orbitron"
              style={{ fontSize: "10px" }}
            >
              AWAITING INTRUSION ATTEMPT
            </div>
            <div className="text-naga-muted mt-1" style={{ fontSize: "9px" }}>
              Trap armed and ready
            </div>
          </div>
        ) : (
          <div className="w-full px-2">
            {/* Attacker info */}
            <div className="mb-3">
              <div className="text-naga-muted mb-1" style={{ fontSize: "9px" }}>
                ATTACKER PRINCIPAL ID
              </div>
              <div
                className="font-rajdhani px-2 py-1 rounded truncate"
                style={{
                  fontSize: "11px",
                  color: "#FF4B5C",
                  background: "rgba(255,75,92,0.08)",
                  border: "1px solid rgba(255,75,92,0.2)",
                  fontFamily: "monospace",
                }}
              >
                {honeypot.attackerPrincipal}
              </div>
            </div>

            <div className="mb-3">
              <div className="text-naga-muted mb-1" style={{ fontSize: "9px" }}>
                TARGET CANISTER
              </div>
              <div
                className="font-orbitron px-2 py-1 rounded"
                style={{
                  fontSize: "10px",
                  color: "#F6B24A",
                  background: "rgba(246,178,74,0.08)",
                  border: "1px solid rgba(246,178,74,0.2)",
                }}
              >
                {honeypot.targetCanister.toUpperCase()}
              </div>
            </div>

            {/* Drain meter */}
            <div className="mb-2">
              <div className="flex justify-between mb-1">
                <span className="text-naga-muted" style={{ fontSize: "9px" }}>
                  CYCLES DRAIN METER
                </span>
                <span style={{ fontSize: "9px", color }}>
                  {honeypot.drainProgress.toFixed(0)}%
                </span>
              </div>
              <div
                className="w-full rounded-full overflow-hidden"
                style={{
                  height: "10px",
                  background: "rgba(0,0,0,0.4)",
                  border: `1px solid ${color}30`,
                }}
              >
                <div
                  className="h-full rounded-full transition-none"
                  style={{
                    width: `${honeypot.drainProgress}%`,
                    background:
                      honeypot.phase === "NEUTRALIZED"
                        ? "linear-gradient(90deg, #28E7B7, #1EE6C8)"
                        : "linear-gradient(90deg, #F6B24A, #FF4B5C)",
                    boxShadow: `0 0 8px ${color}80`,
                    transition: "width 0.05s linear",
                  }}
                />
              </div>
            </div>

            {/* Cycles counter */}
            <div className="flex items-center justify-between">
              <span className="text-naga-muted" style={{ fontSize: "9px" }}>
                CYCLES DRAINED
              </span>
              <span
                className="font-orbitron font-bold"
                style={{
                  fontSize: "14px",
                  color:
                    honeypot.phase === "NEUTRALIZED" ? "#28E7B7" : "#FF4B5C",
                }}
              >
                {formatCycles(honeypot.cyclesDraining)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

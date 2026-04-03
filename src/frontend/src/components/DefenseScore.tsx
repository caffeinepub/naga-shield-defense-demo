import { Zap } from "lucide-react";
import { useEffect, useState } from "react";

interface DefenseScoreProps {
  meshResonanceScore: number; // 0-100 live derived metric
  cycleBurnDelta: number; // cumulative cycle burn between polls
  neutralizedCount: number;
  nakaResponseTime: number;
}

function formatCycles(n: number) {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)}M`;
  if (n === 0) return "ACCUMULATING";
  return n.toLocaleString();
}

export function DefenseScore({
  meshResonanceScore,
  cycleBurnDelta,
  neutralizedCount,
  nakaResponseTime,
}: DefenseScoreProps) {
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    setDisplayScore(meshResonanceScore);
  }, [meshResonanceScore]);

  const maxScore = 100;
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const pct = displayScore / maxScore;
  const dashOffset = circumference * (1 - pct);

  const scoreColor =
    displayScore >= 90 ? "#28E7B7" : displayScore >= 70 ? "#29D6FF" : "#F6B24A";

  const metrics = [
    {
      label: "CYCLE BURN DELTA",
      value: formatCycles(cycleBurnDelta),
      color: "#F6B24A",
      note: "LIVE",
    },
    {
      label: "SIGNATURES NEUTRALIZED",
      value: neutralizedCount.toString(),
      color: "#28E7B7",
      note: null,
    },
    {
      label: "MESH RESONANCE",
      value: `${displayScore}%`,
      color: scoreColor,
      note: "LIVE",
    },
    {
      label: "NAGA RESPONSE",
      value: `${nakaResponseTime.toFixed(1)}ms`,
      color: "#3AA7FF",
      note: null,
    },
  ];

  const tickAngles = Array.from({ length: 10 }, (_, i) => i);

  return (
    <div className="card-hud-blue card-hud p-5 flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Zap size={14} style={{ color: "#29D6FF" }} />
        <span
          className="font-orbitron text-naga-muted uppercase"
          style={{ fontSize: "11px", letterSpacing: "0.15em" }}
        >
          DEFENSE STRENGTH SCORE
        </span>
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "8px",
            color: "#28E7B7",
            background: "rgba(40,231,183,0.1)",
            border: "1px solid rgba(40,231,183,0.25)",
            borderRadius: "3px",
            padding: "1px 5px",
            marginLeft: "auto",
          }}
        >
          LIVE-DERIVED
        </span>
      </div>

      <div className="flex items-center gap-6">
        {/* Gauge */}
        <div
          className="relative flex items-center justify-center flex-shrink-0"
          style={{ width: "160px", height: "160px" }}
        >
          <svg
            aria-label="Defense score gauge — live mesh resonance"
            role="img"
            viewBox="0 0 160 160"
            width="160"
            height="160"
            className="absolute inset-0"
          >
            <defs>
              <filter id="scoreGlow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke="rgba(47,184,255,0.1)"
              strokeWidth="12"
            />
            <circle
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke={scoreColor}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              transform="rotate(-90 80 80)"
              filter="url(#scoreGlow)"
              style={{ transition: "stroke-dashoffset 0.5s ease" }}
            />
            {tickAngles.map((i) => {
              const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
              const x1 = 80 + (radius - 14) * Math.cos(a);
              const y1 = 80 + (radius - 14) * Math.sin(a);
              const x2 = 80 + (radius - 8) * Math.cos(a);
              const y2 = 80 + (radius - 8) * Math.sin(a);
              return (
                <line
                  key={`tick-${i}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="rgba(47,184,255,0.3)"
                  strokeWidth="1"
                />
              );
            })}
          </svg>
          <div className="relative z-10 text-center">
            <div
              className="font-orbitron font-bold"
              style={{ fontSize: "28px", color: scoreColor, lineHeight: 1 }}
            >
              {displayScore}
            </div>
            <div className="text-naga-muted" style={{ fontSize: "9px" }}>
              / 100
            </div>
            <div
              className="font-orbitron mt-1"
              style={{
                fontSize: "7px",
                color: scoreColor,
                letterSpacing: "0.08em",
              }}
            >
              MESH RESONANCE
            </div>
          </div>
        </div>

        {/* Metrics breakdown */}
        <div className="flex-1 space-y-3">
          {metrics.map((m) => (
            <div key={m.label}>
              <div className="flex justify-between mb-1">
                <span
                  className="font-orbitron text-naga-muted"
                  style={{ fontSize: "8px", letterSpacing: "0.1em" }}
                >
                  {m.label}
                  {m.note && (
                    <span
                      style={{
                        marginLeft: "4px",
                        color: "#28E7B7",
                        fontSize: "7px",
                      }}
                    >
                      [{m.note}]
                    </span>
                  )}
                </span>
                <span
                  className="font-orbitron font-bold"
                  style={{ fontSize: "12px", color: m.color }}
                >
                  {m.value}
                </span>
              </div>
              <div
                className="w-full rounded-full"
                style={{ height: "2px", background: "rgba(255,255,255,0.06)" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width:
                      m.label === "MESH RESONANCE" ? `${displayScore}%` : "70%",
                    background: m.color,
                    opacity: 0.5,
                    transition: "width 0.5s ease",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

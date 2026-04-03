import { useEffect, useRef, useState } from "react";
import type { CanisterState } from "../hooks/useSimulation";

interface NagaTopologyProps {
  canisters: CanisterState[];
}

interface Pulse {
  id: number;
  canisterIndex: number;
  progress: number;
  color: string;
}

function statusToColor(status: string) {
  if (status === "PROTECTED") return "#28E7B7";
  if (status === "ACTIVE") return "#29D6FF";
  return "#F6B24A";
}

export function NagaTopology({ canisters }: NagaTopologyProps) {
  const [pulses, setPulses] = useState<Pulse[]>([]);
  const pulseIdRef = useRef(0);
  const svgRef = useRef<SVGSVGElement>(null);

  const width = 480;
  const height = 380;
  const cx = width / 2;
  const cy = height / 2;
  const radius = 155;

  const ringCanisters = canisters.filter((c) => c.name !== "naga_execution");
  const nagaCanister = canisters.find((c) => c.name === "naga_execution");

  const nodePositions = ringCanisters.map((_, i) => {
    const angle = (i / ringCanisters.length) * Math.PI * 2 - Math.PI / 2;
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    };
  });

  useEffect(() => {
    const id = setInterval(() => {
      const canisterIndex = Math.floor(Math.random() * ringCanisters.length);
      const canister = ringCanisters[canisterIndex];
      const color = statusToColor(canister?.status ?? "PROTECTED");
      const pid = pulseIdRef.current++;
      setPulses((prev) => [
        ...prev.filter((p) => p.progress < 1),
        { id: pid, canisterIndex, progress: 0, color },
      ]);
    }, 600);
    return () => clearInterval(id);
  }, [ringCanisters]);

  useEffect(() => {
    let animId: number;
    const animate = () => {
      setPulses((prev) =>
        prev
          .map((p) => ({ ...p, progress: p.progress + 0.015 }))
          .filter((p) => p.progress < 1.05),
      );
      animId = requestAnimationFrame(animate);
    };
    animId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="card-hud p-4 h-full flex flex-col">
      <div className="mb-3">
        <span
          className="font-orbitron text-naga-muted uppercase"
          style={{ fontSize: "11px", letterSpacing: "0.15em" }}
        >
          NAGA PROTOCOL — ENFORCEMENT TOPOLOGY
        </span>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <svg
          ref={svgRef}
          aria-label="Naga Protocol network topology visualization"
          role="img"
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full"
          style={{ maxHeight: "360px" }}
        >
          <defs>
            <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#29D6FF" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#29D6FF" stopOpacity="0" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glowStrong">
              <feGaussianBlur stdDeviation="5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <circle cx={cx} cy={cy} r="80" fill="url(#centerGlow)" />

          {nodePositions.map((pos, i) => {
            const canister = ringCanisters[i];
            const color = statusToColor(canister.status);
            return (
              <line
                key={`line-${canister.id}`}
                x1={cx}
                y1={cy}
                x2={pos.x}
                y2={pos.y}
                stroke={color}
                strokeWidth="1"
                strokeOpacity="0.3"
                strokeDasharray={canister.status === "ALERT" ? "4 4" : "none"}
              />
            );
          })}

          {pulses.map((pulse) => {
            const pos = nodePositions[pulse.canisterIndex];
            if (!pos) return null;
            const px = cx + (pos.x - cx) * pulse.progress;
            const py = cy + (pos.y - cy) * pulse.progress;
            return (
              <circle
                key={`pulse-${pulse.id}`}
                cx={px}
                cy={py}
                r="4"
                fill={pulse.color}
                opacity={1 - pulse.progress * 0.8}
                filter="url(#glow)"
              />
            );
          })}

          {nodePositions.map((pos, i) => {
            const canister = ringCanisters[i];
            const color = statusToColor(canister.status);
            const isAlert = canister.status === "ALERT";
            return (
              <g key={`node-${canister.id}`}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isAlert ? 8 : 6}
                  fill="#0B0F14"
                  stroke={color}
                  strokeWidth={isAlert ? 2 : 1.5}
                  filter={isAlert ? "url(#glow)" : undefined}
                />
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="3"
                  fill={color}
                  opacity="0.8"
                />
                <text
                  x={pos.x}
                  y={pos.y + 16}
                  textAnchor="middle"
                  fill={color}
                  fontSize="6"
                  fontFamily="Orbitron, sans-serif"
                  letterSpacing="0.05em"
                >
                  {canister.name.substring(0, 12).toUpperCase()}
                </text>
              </g>
            );
          })}

          <circle
            cx={cx}
            cy={cy}
            r="38"
            fill="#0B0F14"
            stroke="#29D6FF"
            strokeWidth="1.5"
            filter="url(#glowStrong)"
          />
          <circle
            cx={cx}
            cy={cy}
            r="30"
            fill="none"
            stroke="rgba(41,214,255,0.3)"
            strokeWidth="1"
            strokeDasharray="3 3"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from={`0 ${cx} ${cy}`}
              to={`360 ${cx} ${cy}`}
              dur="12s"
              repeatCount="indefinite"
            />
          </circle>
          <circle
            cx={cx}
            cy={cy}
            r="22"
            fill="none"
            stroke="rgba(41,214,255,0.15)"
            strokeWidth="1"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from={`0 ${cx} ${cy}`}
              to={`-360 ${cx} ${cy}`}
              dur="8s"
              repeatCount="indefinite"
            />
          </circle>
          <circle
            cx={cx}
            cy={cy}
            r="14"
            fill="rgba(41,214,255,0.15)"
            stroke="#29D6FF"
            strokeWidth="2"
            filter="url(#glowStrong)"
          />
          <text
            x={cx}
            y={cy - 4}
            textAnchor="middle"
            fill="#29D6FF"
            fontSize="7"
            fontFamily="Orbitron, sans-serif"
            fontWeight="700"
            letterSpacing="0.08em"
          >
            NAGA
          </text>
          <text
            x={cx}
            y={cy + 8}
            textAnchor="middle"
            fill="#29D6FF"
            fontSize="5"
            fontFamily="Orbitron, sans-serif"
            letterSpacing="0.06em"
          >
            EXECUTION
          </text>
          {nagaCanister && (
            <text
              x={cx}
              y={cy + 52}
              textAnchor="middle"
              fill="rgba(41,214,255,0.6)"
              fontSize="6"
              fontFamily="Orbitron, sans-serif"
              letterSpacing="0.1em"
            >
              {nagaCanister.status}
            </text>
          )}
        </svg>
      </div>
    </div>
  );
}

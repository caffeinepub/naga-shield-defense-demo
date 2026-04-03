import { CheckCircle, Lock } from "lucide-react";

interface VaultIntegrityProps {
  integrity: number;
  cycleBalance?: bigint | null;
}

export function VaultIntegrity({
  integrity,
  cycleBalance,
}: VaultIntegrityProps) {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - integrity / 100);
  const isIntact = integrity >= 100;
  const arcColor = isIntact ? "#28E7B7" : "#FF4B5C";

  function formatCycleBalance(n: bigint): string {
    const num = Number(n);
    if (num >= 1e12) return `${(num / 1e12).toFixed(2)} T cycles`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)} B cycles`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)} M cycles`;
    return `${n.toString()} cycles`;
  }

  return (
    <div className="card-hud-green card-hud p-5 flex flex-col items-center">
      <span
        className="font-orbitron text-naga-muted uppercase mb-4 block"
        style={{ fontSize: "11px", letterSpacing: "0.15em" }}
      >
        NETWORK INTEGRITY METER
      </span>

      <div
        className="relative flex items-center justify-center"
        style={{ width: "200px", height: "200px" }}
      >
        <svg
          aria-label={`Vault integrity: ${integrity}%`}
          role="img"
          viewBox="0 0 200 200"
          width="200"
          height="200"
          className="absolute inset-0"
        >
          <defs>
            <filter id="vaultGlow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="rgba(40,231,183,0.1)"
            strokeWidth="14"
          />
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke={arcColor}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            transform="rotate(-90 100 100)"
            filter="url(#vaultGlow)"
          />
          <circle
            cx="100"
            cy="100"
            r="62"
            fill="none"
            stroke="rgba(40,231,183,0.1)"
            strokeWidth="1"
            strokeDasharray="3 6"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 100 100"
              to="360 100 100"
              dur="30s"
              repeatCount="indefinite"
            />
          </circle>
          <circle
            cx="100"
            cy="100"
            r="50"
            fill="rgba(15,42,36,0.8)"
            stroke="rgba(40,231,183,0.2)"
            strokeWidth="1"
          />
        </svg>

        <div
          className="relative z-10 flex flex-col items-center justify-center text-center"
          style={{ width: "90px" }}
        >
          <Lock size={24} style={{ color: arcColor, marginBottom: "4px" }} />
          <span
            className="font-orbitron font-bold"
            style={{ fontSize: "28px", color: arcColor, lineHeight: 1 }}
          >
            {integrity}%
          </span>
          <span
            className="text-naga-muted"
            style={{ fontSize: "8px", marginTop: "2px" }}
          >
            INTEGRITY
          </span>
        </div>
      </div>

      <div className="mt-3 text-center">
        <div
          className="font-orbitron font-bold text-naga-green"
          style={{ fontSize: "13px", letterSpacing: "0.1em" }}
        >
          SOVEREIGN CORE ASSETS
        </div>
        <div className="text-naga-muted mt-1" style={{ fontSize: "9px" }}>
          {isIntact
            ? "VAULT SEALED — INTEGRITY 100%"
            : "⚠ BREACH DETECTED — INTEGRITY COMPROMISED"}
        </div>
      </div>

      <div
        className="mt-3 flex items-center gap-2 px-4 py-2 rounded-full"
        style={{
          background: isIntact
            ? "rgba(40,231,183,0.12)"
            : "rgba(255,75,92,0.12)",
          border: `1px solid ${isIntact ? "rgba(40,231,183,0.4)" : "rgba(255,75,92,0.4)"}`,
        }}
      >
        <CheckCircle size={12} style={{ color: arcColor }} />
        <span
          className="font-orbitron font-bold"
          style={{ fontSize: "11px", color: arcColor, letterSpacing: "0.15em" }}
        >
          {isIntact ? "UNTOUCHED" : "COMPROMISED"}
        </span>
      </div>

      {/* Live cycle balance from canister */}
      {cycleBalance !== null && cycleBalance !== undefined && (
        <div
          className="mt-3 px-3 py-2 rounded w-full text-center"
          style={{
            background: "rgba(246,178,74,0.08)",
            border: "1px solid rgba(246,178,74,0.25)",
          }}
        >
          <div
            className="font-orbitron"
            style={{
              fontSize: "8px",
              color: "#6F8196",
              letterSpacing: "0.1em",
              marginBottom: "2px",
            }}
          >
            LIVE CYCLE BALANCE
          </div>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: "12px",
              color: "#F6B24A",
              fontWeight: 600,
            }}
          >
            {formatCycleBalance(cycleBalance)}
          </div>
        </div>
      )}
    </div>
  );
}

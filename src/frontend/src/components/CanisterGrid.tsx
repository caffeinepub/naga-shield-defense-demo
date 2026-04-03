import { AlertTriangle, Shield, Zap } from "lucide-react";
import type { LiveCanisterData } from "../hooks/useLiveCanisters";
import type { CanisterState, CanisterStatus } from "../hooks/useSimulation";

interface CanisterGridProps {
  canisters: CanisterState[];
  liveData?: LiveCanisterData;
}

function statusColor(status: CanisterStatus) {
  if (status === "PROTECTED") return "#28E7B7";
  if (status === "ACTIVE") return "#29D6FF";
  return "#F6B24A";
}

function statusBg(status: CanisterStatus) {
  if (status === "PROTECTED") return "rgba(40,231,183,0.12)";
  if (status === "ACTIVE") return "rgba(41,214,255,0.12)";
  return "rgba(246,178,74,0.12)";
}

function StatusIcon({ status }: { status: CanisterStatus }) {
  if (status === "PROTECTED")
    return <Shield size={12} style={{ color: "#28E7B7" }} />;
  if (status === "ACTIVE")
    return <Zap size={12} style={{ color: "#29D6FF" }} />;
  return <AlertTriangle size={12} style={{ color: "#F6B24A" }} />;
}

function formatCycles(n: bigint): string {
  const num = Number(n);
  if (num >= 1e12) return `${(num / 1e12).toFixed(1)}T cycles`;
  if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B cycles`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M cycles`;
  return `${n.toString()} cycles`;
}

function truncate(s: string, len: number): string {
  return s.length > len ? `${s.slice(0, len)}\u2026` : s;
}

function getCanisterRole(name: string): string | null {
  switch (name) {
    case "naga_shield":
      return "ENFORCEMENT HUB";
    case "naga_execution":
      return "L2 MESH GATEWAY";
    case "adaptive_ai_core":
      return "AI DEFENSE CORE";
    case "alien_analytics":
      return "THREAT ANALYTICS SENSOR";
    case "ghost_liquidity":
      return "MESH PERIMETER NODE";
    case "ghost_sniper":
      return "SIGNATURE INTERCEPT PROBE";
    case "sentience_relay":
      return "SENTIENT RELAY NODE";
    case "sovereign_signer":
      return "SOVEREIGN AUTH LAYER";
    case "seal_canister":
      return "PAYLOAD SEAL VERIFIER";
    case "cycle_airdropper":
      return "FUEL DISTRIBUTION NODE";
    case "drone_control":
      return "DRONE CONTROL UNIT";
    case "self_optimizer":
      return "SELF-OPT ENGINE";
    case "simulation_night":
      return "SHADOW SIM NODE";
    case "sovereign_core":
      return "SOVEREIGN CORE VAULT";
    case "sros_dashboard":
      return "SROS MESH MONITOR";
    case "temporal_shadow":
      return "TEMPORAL SHADOW STORE";
    case "whale_sonar":
      return "ACOUSTIC SONAR PROBE";
    default:
      return null;
  }
}

function formatPublicKey(
  result: { Ok?: number[]; Err?: string } | null,
): string | null {
  if (!result) return null;
  if ("Ok" in result && result.Ok) {
    const hex = Array.from(result.Ok as number[])
      .slice(0, 8)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    return `PK: 0x${hex}…`;
  }
  if ("Err" in result && result.Err)
    return `ERR: ${truncate(result.Err as string, 30)}`;
  return null;
}

function getLiveStatusLine(
  canisterName: string,
  liveData: LiveCanisterData | undefined,
): string | null {
  if (!liveData) return null;
  switch (canisterName) {
    case "cycle_airdropper":
      return liveData.cycleAirdropperCycles !== null
        ? formatCycles(liveData.cycleAirdropperCycles)
        : null;
    case "drone_control":
      return liveData.droneControlStatus !== null
        ? truncate(liveData.droneControlStatus, 40)
        : null;
    case "naga_execution":
      return liveData.nagaMeshHealth !== null
        ? truncate(liveData.nagaMeshHealth, 40)
        : null;
    case "seal_canister":
      if (liveData.sealVerified === null) return null;
      return liveData.sealVerified ? "SEAL VERIFIED" : "SEAL BROKEN";
    case "self_optimizer":
      return liveData.selfOptimizerStatus !== null
        ? truncate(liveData.selfOptimizerStatus, 40)
        : null;
    case "whale_sonar":
      return liveData.whaleSonarStatus !== null
        ? truncate(liveData.whaleSonarStatus, 40)
        : null;
    case "simulation_night":
      return liveData.simulationNightStatus !== null
        ? truncate(liveData.simulationNightStatus, 40)
        : null;
    case "sros_dashboard":
      return liveData.srosMeshHealth !== null
        ? truncate(liveData.srosMeshHealth, 40)
        : null;
    case "temporal_shadow":
      return liveData.temporalVoidData !== null
        ? truncate(liveData.temporalVoidData, 40)
        : null;
    case "sovereign_core":
      return liveData.sovereignMetrics !== null
        ? truncate(liveData.sovereignMetrics, 40)
        : null;
    case "sovereign_signer":
      return formatPublicKey(
        liveData.sovereignSignerKey as { Ok?: number[]; Err?: string } | null,
      );
    case "naga_shield":
      if (!liveData.nagaShieldTelemetry) return null;
      return `${liveData.nagaShieldTelemetry.meshIntegrity} | TRAPS:${liveData.nagaShieldTelemetry.activeTraps} | SIG:${liveData.nagaShieldTelemetry.neutralizedThreats}`;
    case "adaptive_ai_core":
      return liveData.adaptiveAiSignals !== null
        ? truncate(liveData.adaptiveAiSignals, 40)
        : null;
    case "alien_analytics":
      return liveData.alienAnalyticsResult !== null
        ? truncate(liveData.alienAnalyticsResult, 40)
        : null;
    case "ghost_liquidity":
      if (liveData.ghostLiquidityResult !== null) {
        const count = liveData.ghostLiquidityResult.length;
        return `FRAGMENTS: ${count}`;
      }
      return null;
    case "ghost_sniper":
      return liveData.ghostSniperResult !== null
        ? truncate(liveData.ghostSniperResult, 40)
        : null;
    case "sentience_relay":
      return liveData.sentienceRelayResult !== null
        ? truncate(liveData.sentienceRelayResult, 40)
        : null;
    default:
      return null;
  }
}

function getSealColor(
  canisterName: string,
  liveData: LiveCanisterData | undefined,
): string {
  if (
    canisterName === "seal_canister" &&
    liveData?.sealVerified !== null &&
    liveData?.sealVerified !== undefined
  ) {
    return liveData.sealVerified ? "#28E7B7" : "#FF4B5C";
  }
  return "#29D6FF";
}

export function CanisterGrid({ canisters, liveData }: CanisterGridProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
      {canisters.map((canister, idx) => {
        const isNaga = canister.name === "naga_execution";
        const isAlert = canister.status === "ALERT";
        const liveStatusLine = getLiveStatusLine(canister.name, liveData);
        const liveColor = getSealColor(canister.name, liveData);

        return (
          <div
            key={canister.id}
            data-ocid={`canister.item.${idx + 1}`}
            className={`card-hud relative p-3 transition-all duration-500 ${
              isNaga ? "col-span-2 row-span-1" : ""
            } ${isAlert ? "naga-alert-border" : ""}`}
            style={{
              borderColor: isAlert
                ? "rgba(255,75,92,0.6)"
                : isNaga
                  ? "rgba(41,214,255,0.6)"
                  : "rgba(60,150,190,0.35)",
              boxShadow: isNaga
                ? "0 0 20px 4px rgba(41,214,255,0.25), inset 0 0 20px rgba(41,214,255,0.05)"
                : isAlert
                  ? "0 0 12px 2px rgba(255,75,92,0.3)"
                  : "none",
            }}
          >
            <div
              className="absolute top-0 left-0 w-3 h-3"
              style={{
                borderTop: `2px solid ${statusColor(canister.status)}`,
                borderLeft: `2px solid ${statusColor(canister.status)}`,
              }}
            />
            <div
              className="absolute bottom-0 right-0 w-3 h-3"
              style={{
                borderBottom: `2px solid ${statusColor(canister.status)}`,
                borderRight: `2px solid ${statusColor(canister.status)}`,
              }}
            />

            {isNaga && (
              <div className="absolute top-2 right-2">
                <span
                  className="text-naga-cyan font-orbitron"
                  style={{ fontSize: "8px", letterSpacing: "0.15em" }}
                >
                  ENFORCEMENT HUB
                </span>
              </div>
            )}

            <div className="flex items-center gap-1.5 mb-2">
              <div
                className="status-dot"
                style={{
                  backgroundColor: statusColor(canister.status),
                  boxShadow: `0 0 6px ${statusColor(canister.status)}`,
                  animationDuration: isAlert ? "0.8s" : "1.5s",
                }}
              />
              <span
                className="font-orbitron"
                style={{
                  fontSize: isNaga ? "11px" : "9px",
                  color: statusColor(canister.status),
                  letterSpacing: "0.1em",
                }}
              >
                {canister.name.toUpperCase()}
              </span>
            </div>

            <div
              className="flex items-center gap-1.5 mt-1 px-2 py-1 rounded"
              style={{ backgroundColor: statusBg(canister.status) }}
            >
              <StatusIcon status={canister.status} />
              <span
                className="font-orbitron font-bold"
                style={{
                  fontSize: "9px",
                  color: statusColor(canister.status),
                  letterSpacing: "0.15em",
                }}
              >
                {canister.status}
              </span>
            </div>

            {getCanisterRole(canister.name) && (
              <div
                className="mt-1"
                style={{
                  fontFamily: "Orbitron, sans-serif",
                  fontSize: "7px",
                  color: "#4A6075",
                  letterSpacing: "0.08em",
                }}
              >
                {getCanisterRole(canister.name)}
              </div>
            )}

            {liveStatusLine && (
              <div
                className="mt-1.5"
                style={{
                  fontFamily: "monospace",
                  fontSize: "8px",
                  color: liveColor,
                  lineHeight: 1.4,
                  wordBreak: "break-all",
                }}
              >
                {liveStatusLine}
              </div>
            )}

            {isNaga && (
              <div className="mt-2 flex gap-3">
                <div>
                  <div className="text-naga-muted" style={{ fontSize: "8px" }}>
                    PROTOCOL
                  </div>
                  <div
                    className="text-naga-cyan font-orbitron"
                    style={{ fontSize: "10px" }}
                  >
                    LAYER-2
                  </div>
                </div>
                <div>
                  <div className="text-naga-muted" style={{ fontSize: "8px" }}>
                    ROUTING
                  </div>
                  <div
                    className="text-naga-green font-orbitron"
                    style={{ fontSize: "10px" }}
                  >
                    ONLINE
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

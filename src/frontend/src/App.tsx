import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Cpu,
  Eye,
  FileDown,
  Lock,
  Menu,
  Radio,
  Shield,
  X,
  Zap,
} from "lucide-react";
import React from "react";
import { useEffect, useState } from "react";
import BtmNetworkLayer from "./components/BtmNetworkLayer";
import { CanisterGrid } from "./components/CanisterGrid";
import CycleManager from "./components/CycleManager";
import { DefenseScore } from "./components/DefenseScore";
import { GenesisMission } from "./components/GenesisMission";
import { HoneypotVisualizer } from "./components/HoneypotVisualizer";
import { NagaTopology } from "./components/NagaTopology";
import { RawTelemetry } from "./components/RawTelemetry";
import RootNeuron from "./components/RootNeuron";
import SROSSubmission from "./components/SROSSubmission";
import { SROSWhitepaper } from "./components/SROSWhitepaper";
import { ThreatLog } from "./components/ThreatLog";
import { VaultIntegrity } from "./components/VaultIntegrity";
import { useLiveCanisters } from "./hooks/useLiveCanisters";
import { useSimulation } from "./hooks/useSimulation";
import { CANISTER_IDS, getNagaShieldActor } from "./lib/canisters";

type Tab =
  | "OVERVIEW"
  | "CANISTERS"
  | "HONEYPOT"
  | "THREAT LOG"
  | "POC OVERVIEW"
  | "REMEDIATION GATEWAY"
  | "CYCLES"
  | "BTM COORDINATION"
  | "RAW TELEMETRY"
  | "WHITEPAPER"
  | "SUBMISSION";

function formatCyclesShort(n: number) {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(0)}M`;
  return n.toLocaleString();
}

function formatTime(d: Date): string {
  return `${d.toUTCString().slice(17, 25)} UTC`;
}

function isNominal(state: string): boolean {
  return state.toUpperCase().includes("NOMINAL");
}

interface NagaShieldPanelProps {
  telemetry: {
    meshIntegrity: string;
    activeTraps: number;
    neutralizedThreats: number;
  } | null;
  compact?: boolean;
}

function NagaShieldPanel({ telemetry, compact = false }: NagaShieldPanelProps) {
  if (!telemetry) return null;

  const nominal = isNominal(telemetry.meshIntegrity);
  const stateColor = nominal ? "#28E7B7" : "#FF4B5C";

  if (compact) {
    return (
      <div className="space-y-1">
        <div className="flex items-start justify-between gap-1">
          <span
            style={{
              fontSize: "7px",
              color: "#4A5568",
              fontFamily: "Orbitron, sans-serif",
              flexShrink: 0,
            }}
          >
            NET STATE
          </span>
          <span
            style={{
              fontSize: "7px",
              color: stateColor,
              fontFamily: "monospace",
              textAlign: "right",
            }}
          >
            {telemetry.meshIntegrity.length > 20
              ? telemetry.meshIntegrity.slice(0, 20)
              : telemetry.meshIntegrity}
          </span>
        </div>
        <div className="flex items-start justify-between gap-1">
          <span
            style={{
              fontSize: "7px",
              color: "#4A5568",
              fontFamily: "Orbitron, sans-serif",
              flexShrink: 0,
            }}
          >
            TRAPS
          </span>
          <span
            style={{
              fontSize: "7px",
              color: "#29D6FF",
              fontFamily: "monospace",
            }}
          >
            {telemetry.activeTraps}
          </span>
        </div>
        <div className="flex items-start justify-between gap-1">
          <span
            style={{
              fontSize: "7px",
              color: "#4A5568",
              fontFamily: "Orbitron, sans-serif",
              flexShrink: 0,
            }}
          >
            NEUTRALIZED
          </span>
          <span
            style={{
              fontSize: "7px",
              color: "#29D6FF",
              fontFamily: "monospace",
            }}
          >
            {telemetry.neutralizedThreats}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="card-hud p-4 relative overflow-hidden"
      data-ocid="naga_shield.panel"
      style={{
        background: nominal
          ? "linear-gradient(135deg, rgba(40,231,183,0.08) 0%, rgba(41,214,255,0.05) 100%)"
          : "linear-gradient(135deg, rgba(255,75,92,0.10) 0%, rgba(41,214,255,0.05) 100%)",
        border: `1px solid ${nominal ? "rgba(40,231,183,0.35)" : "rgba(255,75,92,0.35)"}`,
        boxShadow: nominal
          ? "0 0 24px rgba(40,231,183,0.08), inset 0 1px 0 rgba(40,231,183,0.12)"
          : "0 0 24px rgba(255,75,92,0.10), inset 0 1px 0 rgba(255,75,92,0.10)",
      }}
    >
      {/* Decorative corner accent */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "60px",
          height: "60px",
          background: `radial-gradient(circle at top right, ${nominal ? "rgba(40,231,183,0.15)" : "rgba(255,75,92,0.15)"} 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className="flex items-center justify-center rounded"
            style={{
              width: "28px",
              height: "28px",
              background: nominal
                ? "rgba(40,231,183,0.12)"
                : "rgba(255,75,92,0.12)",
              border: `1px solid ${nominal ? "rgba(40,231,183,0.4)" : "rgba(255,75,92,0.4)"}`,
            }}
          >
            <Shield
              size={14}
              style={{ color: nominal ? "#28E7B7" : "#FF4B5C" }}
            />
          </div>
          <div>
            <div
              className="font-orbitron font-bold"
              style={{
                fontSize: "11px",
                letterSpacing: "0.15em",
                color: "#E6EEF7",
              }}
            >
              PAYLOAD INTEGRITY ENFORCEMENT — LIVE LAYER 2
            </div>
            <div
              style={{
                fontFamily: "monospace",
                fontSize: "8px",
                color: "#4A5568",
                marginTop: "1px",
              }}
            >
              {CANISTER_IDS.naga_shield}
            </div>
          </div>
        </div>
        <div
          className="flex items-center gap-1.5 px-2 py-1 rounded"
          style={{
            background: nominal
              ? "rgba(40,231,183,0.1)"
              : "rgba(255,75,92,0.1)",
            border: `1px solid ${nominal ? "rgba(40,231,183,0.3)" : "rgba(255,75,92,0.3)"}`,
          }}
        >
          <div
            className="status-dot"
            style={{
              backgroundColor: stateColor,
              boxShadow: `0 0 6px ${stateColor}`,
              width: "6px",
              height: "6px",
            }}
          />
          <span
            className="font-orbitron"
            style={{
              fontSize: "8px",
              color: stateColor,
              letterSpacing: "0.12em",
            }}
          >
            {telemetry.meshIntegrity}
          </span>
        </div>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-3 gap-3">
        {/* Network State */}
        <div
          className="p-3 rounded"
          style={{
            background: nominal
              ? "rgba(40,231,183,0.06)"
              : "rgba(255,75,92,0.06)",
            border: `1px solid ${nominal ? "rgba(40,231,183,0.2)" : "rgba(255,75,92,0.2)"}`,
          }}
        >
          <div
            className="font-orbitron text-naga-muted mb-1"
            style={{ fontSize: "7px", letterSpacing: "0.12em" }}
          >
            ENFORCEMENT STATE
          </div>
          <div className="flex items-center gap-1.5">
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                backgroundColor: stateColor,
                boxShadow: `0 0 8px ${stateColor}`,
                flexShrink: 0,
              }}
            />
            <span
              className="font-orbitron font-bold"
              style={{
                fontSize: "9px",
                color: stateColor,
                letterSpacing: "0.06em",
              }}
            >
              {nominal ? "NOMINAL" : "ALERT"}
            </span>
          </div>
        </div>

        {/* Active Intercept Traps */}
        <div
          className="p-3 rounded"
          style={{
            background: "rgba(41,214,255,0.06)",
            border: "1px solid rgba(41,214,255,0.2)",
          }}
        >
          <div
            className="font-orbitron text-naga-muted mb-1"
            style={{ fontSize: "7px", letterSpacing: "0.12em" }}
          >
            ACTIVE INTERCEPT TRAPS
          </div>
          <div
            className="font-orbitron font-bold"
            style={{ fontSize: "28px", color: "#29D6FF", lineHeight: 1 }}
          >
            {telemetry.activeTraps}
          </div>
        </div>

        {/* Neutralized Signatures */}
        <div
          className="p-3 rounded"
          style={{
            background: "rgba(41,214,255,0.06)",
            border: "1px solid rgba(41,214,255,0.2)",
          }}
        >
          <div
            className="font-orbitron text-naga-muted mb-1"
            style={{ fontSize: "7px", letterSpacing: "0.12em" }}
          >
            NEUTRALIZED SIGNATURES
          </div>
          <div
            className="font-orbitron font-bold"
            style={{ fontSize: "28px", color: "#29D6FF", lineHeight: 1 }}
          >
            {telemetry.neutralizedThreats}
          </div>
        </div>
      </div>

      {/* LIVE FIRE TEST */}
      <LiveFireTest compact={compact} />
    </div>
  );
}

function LiveFireTest({ compact }: { compact?: boolean }) {
  const [state, setState] = React.useState<
    "idle" | "firing" | "accepted" | "rejected" | "error"
  >("idle");
  const [lastResult, setLastResult] = React.useState<boolean | null>(null);
  const [lastFired, setLastFired] = React.useState<string | null>(null);

  const fire = async () => {
    setState("firing");
    try {
      const actor = getNagaShieldActor();
      const result = await actor.validate_handshake(
        "SROS_PROBE_GENESIS_MISSION",
      );
      setLastResult(result);
      setState(result ? "accepted" : "rejected");
      setLastFired(
        `${new Date().toISOString().replace("T", " ").slice(0, 19)} UTC`,
      );
    } catch {
      setState("error");
      setLastFired(
        `${new Date().toISOString().replace("T", " ").slice(0, 19)} UTC`,
      );
    }
    setTimeout(() => setState("idle"), 8000);
  };

  if (compact) return null;

  const stateConfig = {
    idle: {
      label: "LIVE VALIDATION TEST",
      color: "#F6B24A",
      bg: "rgba(246,178,74,0.08)",
      border: "rgba(246,178,74,0.3)",
      pulse: false,
    },
    firing: {
      label: "TRANSMITTING TO MAINNET...",
      color: "#29D6FF",
      bg: "rgba(41,214,255,0.08)",
      border: "rgba(41,214,255,0.3)",
      pulse: true,
    },
    accepted: {
      label: "HANDSHAKE ACCEPTED — ENFORCEMENT ACTIVE",
      color: "#28E7B7",
      bg: "rgba(40,231,183,0.08)",
      border: "rgba(40,231,183,0.3)",
      pulse: false,
    },
    rejected: {
      label: "HANDSHAKE REJECTED — ENFORCEMENT TRIGGERED",
      color: "#FF4B5C",
      bg: "rgba(255,75,92,0.08)",
      border: "rgba(255,75,92,0.3)",
      pulse: false,
    },
    error: {
      label: "CALL ERROR — CHECK CONSOLE",
      color: "#FF4B5C",
      bg: "rgba(255,75,92,0.08)",
      border: "rgba(255,75,92,0.3)",
      pulse: false,
    },
  }[state];

  return (
    <div
      className="mt-4"
      style={{
        borderTop: "1px solid rgba(41,214,255,0.12)",
        paddingTop: "14px",
      }}
    >
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div
            className="font-orbitron"
            style={{
              fontSize: "8px",
              color: "#4A5568",
              letterSpacing: "0.12em",
              marginBottom: "3px",
            }}
          >
            ON-CHAIN ENFORCEMENT PROOF — HANDSHAKE VALIDATION
          </div>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: "9px",
              color: "#4A5568",
            }}
          >
            Calls{" "}
            <span style={{ color: "#F6B24A" }}>
              validate_handshake("SROS_PROBE_GENESIS_MISSION")
            </span>{" "}
            on naga_shield mainnet canister. Result is live, verifiable
            on-chain.
          </div>
          {lastFired && (
            <div
              style={{
                fontFamily: "monospace",
                fontSize: "8px",
                color: "#4A5568",
                marginTop: "4px",
              }}
            >
              LAST FIRED: <span style={{ color: "#29D6FF" }}>{lastFired}</span>{" "}
              &mdash; RESULT:{" "}
              <span
                style={{
                  color: lastResult ? "#28E7B7" : "#FF4B5C",
                  fontWeight: "bold",
                }}
              >
                {lastResult === null
                  ? "ERROR"
                  : lastResult
                    ? "TRUE (ACCEPTED)"
                    : "FALSE (REJECTED)"}
              </span>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={fire}
          disabled={state === "firing"}
          className="font-orbitron"
          style={{
            padding: "10px 20px",
            background: stateConfig.bg,
            border: `1px solid ${stateConfig.border}`,
            borderRadius: "4px",
            color: stateConfig.color,
            fontSize: "10px",
            letterSpacing: "0.12em",
            cursor: state === "firing" ? "not-allowed" : "pointer",
            opacity: state === "firing" ? 0.7 : 1,
            transition: "all 0.2s",
            whiteSpace: "nowrap",
            boxShadow:
              state !== "idle" ? `0 0 16px ${stateConfig.border}` : "none",
          }}
        >
          {stateConfig.label}
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const sim = useSimulation();
  const liveData = useLiveCanisters();
  const [activeTab, setActiveTab] = useState<Tab>("OVERVIEW");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Compute live badge state
  const liveWithinWindow =
    liveData.lastFetched !== null &&
    Date.now() - liveData.lastFetched.getTime() < 60_000;

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const tabs: Tab[] = [
    "OVERVIEW",
    "CANISTERS",
    "HONEYPOT",
    "THREAT LOG",
    "POC OVERVIEW",
    "REMEDIATION GATEWAY",
    "CYCLES",
    "BTM COORDINATION",
    "RAW TELEMETRY",
    "WHITEPAPER",
    "SUBMISSION",
  ];

  const kpiCards = [
    {
      id: "kpi_integrity",
      label: "SYSTEM INTEGRITY",
      value: `${sim.systemIntegrity}%`,
      sub: "ALL CANISTERS SECURED",
      color: "#28E7B7",
      bgClass: "card-hud-green",
      icon: <Shield size={16} style={{ color: "#28E7B7" }} />,
    },
    {
      id: "kpi_threats",
      label: "ACTIVE THREATS",
      value: sim.activeThreats.toString(),
      sub: sim.activeThreats > 0 ? "THREATS DETECTED" : "NETWORK CLEAR",
      color: sim.activeThreats > 0 ? "#FF4B5C" : "#28E7B7",
      bgClass: sim.activeThreats > 0 ? "card-hud-red" : "card-hud",
      icon: (
        <AlertTriangle
          size={16}
          style={{ color: sim.activeThreats > 0 ? "#FF4B5C" : "#28E7B7" }}
        />
      ),
    },
    {
      id: "kpi_cycles",
      label: "COMPUTE RESOURCE DELTA",
      value:
        liveData.cycleBurnDelta > 0
          ? formatCyclesShort(liveData.cycleBurnDelta)
          : "ACCUMULATING",
      sub: "INTER-POLL CYCLE CONSUMPTION",
      color: "#F6B24A",
      bgClass: "card-hud-amber",
      icon: <Zap size={16} style={{ color: "#F6B24A" }} />,
    },
    {
      id: "kpi_score",
      label: "CONSENSUS INDEX",
      value: `${liveData.meshResonanceScore}%`,
      sub: "LIVE NODE FULFILLMENT RATIO",
      color: "#29D6FF",
      bgClass: "card-hud-blue",
      icon: <Activity size={16} style={{ color: "#29D6FF" }} />,
    },
  ];

  const sidebarIcons = [
    { icon: <Shield size={18} />, label: "Overview", tab: "OVERVIEW" as Tab },
    { icon: <Cpu size={18} />, label: "Canisters", tab: "CANISTERS" as Tab },
    {
      icon: <AlertTriangle size={18} />,
      label: "Honeypot",
      tab: "HONEYPOT" as Tab,
    },
    { icon: <Eye size={18} />, label: "Threat Log", tab: "THREAT LOG" as Tab },
    {
      icon: <Radio size={18} />,
      label: "POC Overview",
      tab: "POC OVERVIEW" as Tab,
    },
    {
      icon: <Zap size={18} />,
      label: "Remediation Gateway",
      tab: "REMEDIATION GATEWAY" as Tab,
    },
    {
      icon: <Activity size={18} />,
      label: "Cycles",
      tab: "CYCLES" as Tab,
    },
    {
      icon: <Lock size={18} />,
      label: "BTM Coordination",
      tab: "BTM COORDINATION" as Tab,
    },
    {
      icon: <Menu size={18} />,
      label: "Raw Telemetry",
      tab: "RAW TELEMETRY" as Tab,
    },
    {
      icon: <FileDown size={18} />,
      label: "Whitepaper",
      tab: "WHITEPAPER" as Tab,
    },
    {
      icon: <FileDown size={18} />,
      label: "Submission",
      tab: "SUBMISSION" as Tab,
    },
  ];

  return (
    <div
      className="hex-bg min-h-screen flex flex-col"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <div className="scan-overlay" />

      {/* ===== HEADER ===== */}
      <header
        className="flex items-center justify-between px-4 py-2 flex-shrink-0"
        style={{
          background: "linear-gradient(180deg, #0B1520 0%, #0B0F14 100%)",
          borderBottom: "1px solid rgba(41,214,255,0.2)",
          boxShadow: "0 2px 20px rgba(41,214,255,0.08)",
          height: "56px",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div className="flex items-center gap-3 flex-shrink-0">
          <div
            className="flex items-center justify-center rounded"
            style={{
              width: "36px",
              height: "36px",
              background: "rgba(41,214,255,0.12)",
              border: "1px solid rgba(41,214,255,0.4)",
              boxShadow: "0 0 12px rgba(41,214,255,0.2)",
            }}
          >
            <Shield size={18} style={{ color: "#29D6FF" }} />
          </div>
          <div>
            <div
              className="font-orbitron font-bold text-naga-cyan"
              style={{
                fontSize: "14px",
                letterSpacing: "0.12em",
                lineHeight: 1,
              }}
            >
              SROS
            </div>
            <div
              className="text-naga-muted"
              style={{ fontSize: "8px", letterSpacing: "0.15em" }}
            >
              SOVEREIGN RESONANT OPERATING SYSTEM · ICP MAINNET
            </div>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-1" data-ocid="nav.tab">
          {tabs.map((tab) => (
            <button
              type="button"
              key={tab}
              data-ocid={`nav.${tab.toLowerCase().replace(/ /g, "_")}.link`}
              onClick={() => setActiveTab(tab)}
              className="px-3 py-1.5 rounded transition-all duration-200"
              style={{
                fontFamily: "Orbitron, sans-serif",
                fontSize: "9px",
                letterSpacing: "0.12em",
                color: activeTab === tab ? "#29D6FF" : "#6F8196",
                background:
                  activeTab === tab ? "rgba(41,214,255,0.12)" : "transparent",
                border: `1px solid ${
                  activeTab === tab ? "rgba(41,214,255,0.35)" : "transparent"
                }`,
              }}
            >
              {tab}
            </button>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {/* Live data badge */}
          <div
            className="flex items-center gap-1.5 px-2 py-1 rounded"
            style={{
              background: liveData.isLoading
                ? "rgba(246,178,74,0.08)"
                : liveWithinWindow
                  ? "rgba(40,231,183,0.08)"
                  : "rgba(60,150,190,0.08)",
              border: `1px solid ${
                liveData.isLoading
                  ? "rgba(246,178,74,0.25)"
                  : liveWithinWindow
                    ? "rgba(40,231,183,0.3)"
                    : "rgba(60,150,190,0.2)"
              }`,
            }}
          >
            {liveData.isLoading ? (
              <span
                className="font-orbitron"
                style={{
                  fontSize: "8px",
                  color: "#F6B24A",
                  letterSpacing: "0.12em",
                }}
              >
                SYNCING...
              </span>
            ) : liveWithinWindow ? (
              <>
                <div
                  className="status-dot"
                  style={{
                    backgroundColor: "#28E7B7",
                    boxShadow: "0 0 6px #28E7B7",
                    width: "6px",
                    height: "6px",
                  }}
                />
                <span
                  className="font-orbitron"
                  style={{
                    fontSize: "8px",
                    color: "#28E7B7",
                    letterSpacing: "0.12em",
                  }}
                >
                  LIVE
                </span>
                {liveData.lastFetched && (
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontSize: "8px",
                      color: "#6F8196",
                    }}
                  >
                    {formatTime(liveData.lastFetched)}
                  </span>
                )}
              </>
            ) : (
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: "8px",
                  color: "#6F8196",
                }}
              >
                {liveData.lastFetched
                  ? formatTime(liveData.lastFetched)
                  : "NO DATA"}
              </span>
            )}
          </div>

          {/* NAGA SHIELD canister ID badge */}
          <div
            className="px-2 py-1 rounded flex items-center gap-1.5"
            style={{
              background: "rgba(40,231,183,0.06)",
              border: "1px solid rgba(40,231,183,0.25)",
            }}
          >
            <Shield size={10} style={{ color: "#28E7B7" }} />
            <span
              className="font-orbitron"
              style={{
                fontSize: "7px",
                color: "#28E7B7",
                letterSpacing: "0.08em",
              }}
            >
              NAGA SHIELD
            </span>
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "8px",
                color: "#9AA9BA",
              }}
            >
              {CANISTER_IDS.naga_shield}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="status-dot status-dot-green" />
            <span
              className="font-orbitron text-naga-green"
              style={{ fontSize: "9px" }}
            >
              CONNECTED
            </span>
          </div>
          <div
            className="font-orbitron text-naga-muted"
            style={{ fontSize: "10px" }}
          >
            {sim.clock}
          </div>
        </div>

        <button
          type="button"
          className="md:hidden p-2"
          data-ocid="nav.mobile.toggle"
          onClick={() => setMobileMenuOpen((p) => !p)}
          style={{ color: "#29D6FF" }}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {mobileMenuOpen && (
        <div
          className="md:hidden flex flex-col gap-1 p-4"
          style={{
            background: "#0B1520",
            borderBottom: "1px solid rgba(41,214,255,0.2)",
            zIndex: 99,
          }}
        >
          {tabs.map((tab) => (
            <button
              type="button"
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2 rounded"
              style={{
                fontFamily: "Orbitron, sans-serif",
                fontSize: "10px",
                letterSpacing: "0.12em",
                color: activeTab === tab ? "#29D6FF" : "#6F8196",
                background:
                  activeTab === tab ? "rgba(41,214,255,0.1)" : "transparent",
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      )}

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 flex">
        <aside
          className="hidden lg:flex flex-col items-center gap-3 py-4 flex-shrink-0"
          style={{
            width: "56px",
            background: "rgba(0,0,0,0.3)",
            borderRight: "1px solid rgba(60,150,190,0.15)",
          }}
        >
          {sidebarIcons.map((item) => (
            <button
              type="button"
              key={item.label}
              onClick={() => setActiveTab(item.tab)}
              title={item.label}
              className="flex items-center justify-center rounded-lg transition-all duration-200"
              style={{
                width: "40px",
                height: "40px",
                color: activeTab === item.tab ? "#29D6FF" : "#4A5568",
                background:
                  activeTab === item.tab
                    ? "rgba(41,214,255,0.1)"
                    : "transparent",
                border: `1px solid ${
                  activeTab === item.tab
                    ? "rgba(41,214,255,0.3)"
                    : "transparent"
                }`,
              }}
            >
              {item.icon}
            </button>
          ))}
        </aside>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4 max-w-screen-2xl mx-auto">
            {/* OVERVIEW */}
            {activeTab === "OVERVIEW" && (
              <div className="space-y-4">
                {/* NAGA SHIELD TELEMETRY — primary enforcement hub */}
                <NagaShieldPanel telemetry={liveData.nagaShieldTelemetry} />

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {kpiCards.map((kpi) => (
                    <div
                      key={kpi.id}
                      data-ocid={`kpi.${kpi.id}.card`}
                      className={`card-hud ${kpi.bgClass} p-4 relative overflow-hidden`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div
                            className="text-naga-muted font-orbitron mb-2"
                            style={{ fontSize: "9px", letterSpacing: "0.15em" }}
                          >
                            {kpi.label}
                          </div>
                          <div
                            className="font-orbitron font-bold"
                            style={{
                              fontSize: "36px",
                              color: kpi.color,
                              lineHeight: 1,
                            }}
                          >
                            {kpi.value}
                          </div>
                          {(kpi.id === "kpi_integrity" ||
                            kpi.id === "kpi_threats") && (
                            <span
                              style={{
                                fontSize: "8px",
                                color: "#F6B24A",
                                fontFamily: "monospace",
                              }}
                            >
                              PHASE 1 · CONCEPTUAL
                            </span>
                          )}
                          <div
                            className="mt-1"
                            style={{
                              fontSize: "9px",
                              color: kpi.color,
                              opacity: 0.7,
                            }}
                          >
                            {kpi.sub}
                          </div>
                        </div>
                        <div
                          className="flex items-center justify-center rounded-lg"
                          style={{
                            width: "32px",
                            height: "32px",
                            background: `${kpi.color}15`,
                            border: `1px solid ${kpi.color}30`,
                          }}
                        >
                          {kpi.icon}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* MESH INTEGRITY FEED — live DRE / enforcement metrics */}
                {(liveData.nagaShieldTelemetry !== null ||
                  liveData.adaptiveAiSignals !== null) && (
                  <div
                    className="p-4 rounded"
                    data-ocid="mesh_integrity.panel"
                    style={{
                      background: "rgba(0,0,0,0.3)",
                      border: "1px solid rgba(41,214,255,0.2)",
                    }}
                  >
                    <div
                      className="font-orbitron text-naga-cyan mb-3"
                      style={{ fontSize: "10px", letterSpacing: "0.15em" }}
                    >
                      DISTRIBUTED ENFORCEMENT TELEMETRY — LIVE ON-CHAIN
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {/* DRE Trap Status */}
                      {liveData.nagaShieldTelemetry && (
                        <div
                          className="p-3 rounded"
                          style={{
                            background: "rgba(41,214,255,0.06)",
                            border: "1px solid rgba(41,214,255,0.25)",
                          }}
                        >
                          <div
                            className="font-orbitron text-naga-muted mb-1"
                            style={{ fontSize: "8px", letterSpacing: "0.1em" }}
                          >
                            DRE TRAP STATUS
                          </div>
                          <div
                            className="font-orbitron font-bold"
                            style={{
                              fontSize: "28px",
                              color: "#29D6FF",
                              lineHeight: 1,
                            }}
                          >
                            {liveData.nagaShieldTelemetry.activeTraps}
                          </div>
                          <div
                            style={{
                              fontSize: "9px",
                              color: "#29D6FF",
                              opacity: 0.7,
                              marginTop: "2px",
                            }}
                          >
                            ACTIVE DRE NODES
                          </div>
                        </div>
                      )}

                      {/* Signature Neutralization */}
                      {liveData.nagaShieldTelemetry && (
                        <div
                          className="p-3 rounded"
                          style={{
                            background: "rgba(40,231,183,0.06)",
                            border: "1px solid rgba(40,231,183,0.25)",
                          }}
                        >
                          <div
                            className="font-orbitron text-naga-muted mb-1"
                            style={{ fontSize: "8px", letterSpacing: "0.1em" }}
                          >
                            SIGNATURES NEUTRALIZED
                          </div>
                          <div
                            className="font-orbitron font-bold"
                            style={{
                              fontSize: "28px",
                              color: "#28E7B7",
                              lineHeight: 1,
                            }}
                          >
                            {liveData.nagaShieldTelemetry.neutralizedThreats}
                          </div>
                          <div
                            style={{
                              fontSize: "9px",
                              color: "#28E7B7",
                              opacity: 0.7,
                              marginTop: "2px",
                            }}
                          >
                            THREATS NEUTRALIZED
                          </div>
                        </div>
                      )}

                      {/* Enforcement Layer */}
                      {(liveData.nagaMeshHealth || liveData.srosMeshHealth) &&
                        (() => {
                          const meshVal =
                            liveData.nagaMeshHealth ??
                            liveData.srosMeshHealth ??
                            "";
                          const meshNominal =
                            meshVal.toUpperCase().includes("NOMINAL") ||
                            meshVal.toUpperCase().includes("HEALTHY") ||
                            meshVal.toUpperCase().includes("OK");
                          return (
                            <div
                              className="p-3 rounded"
                              style={{
                                background: meshNominal
                                  ? "rgba(40,231,183,0.06)"
                                  : "rgba(255,75,92,0.06)",
                                border: `1px solid ${meshNominal ? "rgba(40,231,183,0.25)" : "rgba(255,75,92,0.25)"}`,
                              }}
                            >
                              <div
                                className="font-orbitron text-naga-muted mb-1"
                                style={{
                                  fontSize: "8px",
                                  letterSpacing: "0.1em",
                                }}
                              >
                                LAYER 2 PROTOCOL MESH
                              </div>
                              <div className="flex items-center gap-1.5 mb-1">
                                <div
                                  style={{
                                    width: "8px",
                                    height: "8px",
                                    borderRadius: "50%",
                                    backgroundColor: meshNominal
                                      ? "#28E7B7"
                                      : "#FF4B5C",
                                    boxShadow: `0 0 6px ${meshNominal ? "#28E7B7" : "#FF4B5C"}`,
                                  }}
                                />
                                <span
                                  className="font-orbitron font-bold"
                                  style={{
                                    fontSize: "11px",
                                    color: meshNominal ? "#28E7B7" : "#FF4B5C",
                                  }}
                                >
                                  {meshNominal ? "NOMINAL" : "ALERT"}
                                </span>
                              </div>
                              <div
                                style={{
                                  fontFamily: "monospace",
                                  fontSize: "8px",
                                  color: "#6F8196",
                                }}
                              >
                                PROTOCOL-LAYER MESH
                              </div>
                            </div>
                          );
                        })()}

                      {/* AI Defense Core Signals */}
                      {liveData.adaptiveAiSignals && (
                        <div
                          className="p-3 rounded"
                          style={{
                            background: "rgba(246,178,74,0.06)",
                            border: "1px solid rgba(246,178,74,0.25)",
                          }}
                        >
                          <div
                            className="font-orbitron text-naga-muted mb-1"
                            style={{ fontSize: "8px", letterSpacing: "0.1em" }}
                          >
                            ADAPTIVE OPTIMIZATION ENGINE
                          </div>
                          <div className="flex items-center gap-1.5 mb-1">
                            <div
                              style={{
                                width: "8px",
                                height: "8px",
                                borderRadius: "50%",
                                backgroundColor: "#F6B24A",
                                boxShadow: "0 0 6px #F6B24A",
                              }}
                            />
                            <span
                              className="font-orbitron font-bold"
                              style={{ fontSize: "11px", color: "#F6B24A" }}
                            >
                              LIVE
                            </span>
                          </div>
                          <div
                            style={{
                              fontFamily: "monospace",
                              fontSize: "8px",
                              color: "#F6B24A",
                              opacity: 0.85,
                              wordBreak: "break-all",
                            }}
                          >
                            {liveData.adaptiveAiSignals.slice(0, 60)}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="lg:col-span-1">
                    <NagaTopology canisters={sim.canisters} />
                  </div>
                  <div className="lg:col-span-1">
                    <HoneypotVisualizer honeypot={sim.honeypot} />
                  </div>
                  <div className="lg:col-span-1" style={{ minHeight: "360px" }}>
                    <ThreatLog threats={sim.threats.slice(0, 8)} />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <VaultIntegrity
                    integrity={sim.systemIntegrity}
                    cycleBalance={liveData.cycleAirdropperCycles}
                  />
                  <DefenseScore
                    meshResonanceScore={liveData.meshResonanceScore}
                    cycleBurnDelta={liveData.cycleBurnDelta}
                    neutralizedCount={sim.neutralizedCount}
                    nakaResponseTime={sim.nakaResponseTime}
                  />
                </div>
              </div>
            )}

            {/* CANISTERS */}
            {activeTab === "CANISTERS" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2
                      className="font-orbitron font-bold text-naga-cyan"
                      style={{ fontSize: "16px", letterSpacing: "0.1em" }}
                    >
                      LIVE NODE STATUS MONITOR
                    </h2>
                    <p
                      className="text-naga-muted mt-0.5"
                      style={{ fontSize: "11px" }}
                    >
                      18 Monitored Canisters — Real-time Status
                    </p>
                  </div>
                  <div
                    className="flex items-center gap-2 px-3 py-1.5 rounded"
                    style={{
                      background: "rgba(40,231,183,0.1)",
                      border: "1px solid rgba(40,231,183,0.3)",
                    }}
                  >
                    <div className="status-dot status-dot-green" />
                    <span
                      className="font-orbitron text-naga-green"
                      style={{ fontSize: "9px" }}
                    >
                      ALL SYSTEMS NOMINAL
                    </span>
                  </div>
                </div>
                <CanisterGrid canisters={sim.canisters} liveData={liveData} />
                <div className="mt-4">
                  <NagaTopology canisters={sim.canisters} />
                </div>
              </div>
            )}

            {/* HONEYPOT */}
            {activeTab === "HONEYPOT" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2
                      className="font-orbitron font-bold text-naga-amber"
                      style={{ fontSize: "16px", letterSpacing: "0.1em" }}
                    >
                      DECEPTION LAYER / ATTACKER RESOURCE DRAIN
                    </h2>
                    <p
                      className="text-naga-muted mt-0.5"
                      style={{ fontSize: "11px" }}
                    >
                      Threshold-triggered resource exhaustion model — Phase 1
                      Conceptual Demonstration
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div style={{ minHeight: "380px" }}>
                    <HoneypotVisualizer honeypot={sim.honeypot} />
                  </div>
                  <div style={{ minHeight: "380px" }}>
                    <ThreatLog threats={sim.threats} />
                  </div>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    {
                      label: "TOTAL DRAINED",
                      value: formatCyclesShort(sim.totalCyclesDrained),
                      color: "#F6B24A",
                    },
                    {
                      label: "NEUTRALIZED",
                      value: sim.neutralizedCount.toString(),
                      color: "#28E7B7",
                    },
                    {
                      label: "BLOCKED",
                      value: sim.threats
                        .filter((t) => t.outcome === "BLOCKED")
                        .length.toString(),
                      color: "#3AA7FF",
                    },
                    {
                      label: "LOG ENTRIES",
                      value: sim.threats.length.toString(),
                      color: "#29D6FF",
                    },
                  ].map((s) => (
                    <div key={s.label} className="card-hud p-4 text-center">
                      <div
                        className="text-naga-muted font-orbitron"
                        style={{ fontSize: "9px", letterSpacing: "0.12em" }}
                      >
                        {s.label}
                      </div>
                      <div
                        className="font-orbitron font-bold mt-2"
                        style={{ fontSize: "28px", color: s.color }}
                      >
                        {s.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* THREAT LOG */}
            {activeTab === "THREAT LOG" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2
                      className="font-orbitron font-bold text-naga-red"
                      style={{ fontSize: "16px", letterSpacing: "0.1em" }}
                    >
                      THREAT INTELLIGENCE LOG
                    </h2>
                    <p
                      className="text-naga-muted mt-0.5"
                      style={{ fontSize: "11px" }}
                    >
                      All detected intrusion attempts — chronological
                    </p>
                  </div>
                  <div
                    className="px-3 py-1.5 rounded font-orbitron"
                    style={{
                      background: "rgba(255,75,92,0.1)",
                      border: "1px solid rgba(255,75,92,0.3)",
                      fontSize: "10px",
                      color: "#FF4B5C",
                    }}
                  >
                    {sim.threats.length} TOTAL EVENTS
                  </div>
                </div>
                <div style={{ minHeight: "500px" }}>
                  <ThreatLog threats={sim.threats} />
                </div>
              </div>
            )}

            {/* POC OVERVIEW */}
            {activeTab === "POC OVERVIEW" && (
              <div className="space-y-4">
                <div>
                  <h2
                    className="font-orbitron font-bold text-naga-cyan"
                    style={{ fontSize: "16px", letterSpacing: "0.1em" }}
                  >
                    SROS — SOVEREIGN COORDINATION MESH · PROOF OF CONCEPT
                  </h2>
                  <p
                    className="text-naga-muted mt-0.5"
                    style={{ fontSize: "11px" }}
                  >
                    ICP Mainnet · 17-Node Autonomous Canister Suite · DOE Phase
                    1 Submission
                  </p>
                </div>

                {/* NAGA SHIELD TELEMETRY in POC Overview */}
                <NagaShieldPanel telemetry={liveData.nagaShieldTelemetry} />

                <GenesisMission
                  sovereignMetrics={liveData.sovereignMetrics}
                  isControllerAuthenticated={
                    liveData.sovereignSignerKey !== null &&
                    "Ok" in (liveData.sovereignSignerKey as { Ok?: unknown }) &&
                    Array.isArray(
                      (liveData.sovereignSignerKey as { Ok?: unknown }).Ok,
                    )
                  }
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <VaultIntegrity
                    integrity={sim.systemIntegrity}
                    cycleBalance={liveData.cycleAirdropperCycles}
                  />
                  <DefenseScore
                    meshResonanceScore={liveData.meshResonanceScore}
                    cycleBurnDelta={liveData.cycleBurnDelta}
                    neutralizedCount={sim.neutralizedCount}
                    nakaResponseTime={sim.nakaResponseTime}
                  />
                </div>
              </div>
            )}

            {/* ROOT NEURON */}
            {activeTab === "REMEDIATION GATEWAY" && (
              <div className="space-y-4">
                <RootNeuron />
              </div>
            )}

            {/* CYCLES */}
            {activeTab === "CYCLES" && (
              <div className="space-y-4">
                <CycleManager />
              </div>
            )}

            {/* BTM NETWORK */}
            {activeTab === "BTM COORDINATION" && (
              <div className="space-y-4">
                <BtmNetworkLayer />
              </div>
            )}

            {/* RAW TELEMETRY */}
            {activeTab === "RAW TELEMETRY" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2
                      className="font-orbitron font-bold text-naga-cyan"
                      style={{ fontSize: "16px", letterSpacing: "0.1em" }}
                    >
                      RAW TELEMETRY INSPECTOR
                    </h2>
                    <p
                      className="text-naga-muted mt-0.5"
                      style={{ fontSize: "11px" }}
                    >
                      Live on-chain responses from all 17 canisters —
                      audit-verifiable, zero simulation
                    </p>
                  </div>
                </div>
                <RawTelemetry
                  rawResults={liveData.rawResults}
                  lastFetched={liveData.lastFetched}
                  meshResonanceScore={liveData.meshResonanceScore}
                  isLoading={liveData.isLoading}
                />
              </div>
            )}

            {/* WHITEPAPER */}
            {activeTab === "WHITEPAPER" && (
              <div className="p-4">
                <SROSWhitepaper />
              </div>
            )}

            {/* SUBMISSION */}
            {activeTab === "SUBMISSION" && (
              <div className="p-4">
                <SROSSubmission />
              </div>
            )}
          </div>

          {/* FOOTER */}
          <footer
            className="flex items-center justify-between px-4 py-2 mt-4"
            style={{
              background: "rgba(0,0,0,0.4)",
              borderTop: "1px solid rgba(41,214,255,0.1)",
              fontSize: "9px",
            }}
          >
            <div className="flex items-center gap-3">
              <div className="status-dot status-dot-green" />
              <span
                className="font-orbitron text-naga-muted"
                style={{ letterSpacing: "0.12em" }}
              >
                SROS v2.4.1 — ALL NODES OPERATIONAL
              </span>
            </div>
            <div className="flex items-center gap-2 text-naga-muted">
              <CheckCircle size={10} style={{ color: "#28E7B7" }} />
              <span>
                © {new Date().getFullYear()}. Built with love using{" "}
                <a
                  href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#29D6FF" }}
                >
                  caffeine.ai
                </a>
              </span>
            </div>
          </footer>
        </div>

        {/* RIGHT SIDEBAR */}
        <aside
          className="hidden xl:flex flex-col flex-shrink-0 p-3 gap-3 overflow-y-auto"
          style={{
            width: "280px",
            background: "rgba(0,0,0,0.25)",
            borderLeft: "1px solid rgba(60,150,190,0.15)",
          }}
        >
          {/* NAGA SHIELD section at top of sidebar */}
          {liveData.nagaShieldTelemetry && (
            <>
              <div
                className="font-orbitron"
                style={{
                  fontSize: "9px",
                  letterSpacing: "0.15em",
                  color: isNominal(liveData.nagaShieldTelemetry.meshIntegrity)
                    ? "#28E7B7"
                    : "#FF4B5C",
                }}
              >
                NAGA SHIELD
              </div>
              <NagaShieldPanel
                telemetry={liveData.nagaShieldTelemetry}
                compact
              />
              <div
                style={{ height: "1px", background: "rgba(60,150,190,0.15)" }}
              />
            </>
          )}

          <div
            className="font-orbitron text-naga-muted"
            style={{ fontSize: "9px", letterSpacing: "0.15em" }}
          >
            RECENT EVENTS
          </div>

          <div className="space-y-1.5">
            {sim.threats.slice(0, 6).map((t, i) => (
              <div
                key={t.id}
                data-ocid={`sidebar.item.${i + 1}`}
                className="p-2 rounded"
                style={{
                  background: "rgba(0,0,0,0.3)",
                  border: "1px solid rgba(60,150,190,0.12)",
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className="font-orbitron"
                    style={{
                      fontSize: "7px",
                      color:
                        t.outcome === "NEUTRALIZED"
                          ? "#28E7B7"
                          : t.outcome === "BLOCKED"
                            ? "#3AA7FF"
                            : "#F6B24A",
                    }}
                  >
                    {t.outcome}
                  </span>
                  <span style={{ fontSize: "7px", color: "#4A5568" }}>
                    {t.timestamp.slice(11, 19)}
                  </span>
                </div>
                <div
                  className="font-orbitron"
                  style={{ fontSize: "8px", color: "#F6B24A" }}
                >
                  → {t.targetCanister.toUpperCase().substring(0, 16)}
                </div>
              </div>
            ))}
          </div>

          <div style={{ height: "1px", background: "rgba(60,150,190,0.15)" }} />

          <div
            className="font-orbitron text-naga-muted"
            style={{ fontSize: "9px", letterSpacing: "0.15em" }}
          >
            CANISTER STATUS
          </div>
          <div className="space-y-1">
            {sim.canisters.map((c) => (
              <div key={c.id} className="flex items-center justify-between">
                <span
                  style={{
                    fontSize: "8px",
                    color: "#6F8196",
                    fontFamily: "monospace",
                  }}
                >
                  {c.name.substring(0, 16)}
                </span>
                <div
                  className="status-dot"
                  style={{
                    width: "6px",
                    height: "6px",
                    backgroundColor:
                      c.status === "PROTECTED"
                        ? "#28E7B7"
                        : c.status === "ACTIVE"
                          ? "#29D6FF"
                          : "#F6B24A",
                    boxShadow: `0 0 4px ${
                      c.status === "PROTECTED"
                        ? "#28E7B7"
                        : c.status === "ACTIVE"
                          ? "#29D6FF"
                          : "#F6B24A"
                    }`,
                  }}
                />
              </div>
            ))}
          </div>

          <div style={{ height: "1px", background: "rgba(60,150,190,0.15)" }} />

          <div>
            <div
              className="font-orbitron text-naga-muted mb-1"
              style={{ fontSize: "9px", letterSpacing: "0.12em" }}
            >
              DISPATCH LATENCY
            </div>
            <div
              className="font-orbitron font-bold text-naga-blue"
              style={{ fontSize: "20px" }}
            >
              {sim.nakaResponseTime.toFixed(1)}ms
            </div>
            <span
              style={{
                fontSize: "8px",
                color: "#4A5568",
                fontFamily: "monospace",
              }}
            >
              [SIM]
            </span>
          </div>

          {/* Live IC data summary in sidebar */}
          {!liveData.isLoading && liveData.lastFetched && (
            <>
              <div
                style={{ height: "1px", background: "rgba(60,150,190,0.15)" }}
              />
              <div
                className="font-orbitron text-naga-muted"
                style={{ fontSize: "9px", letterSpacing: "0.15em" }}
              >
                LIVE IC DATA
              </div>
              <div className="space-y-1">
                {[
                  {
                    label: "DRONE CTRL",
                    value: liveData.droneControlStatus
                      ? liveData.droneControlStatus.slice(0, 20)
                      : null,
                  },
                  {
                    label: "MESH HEALTH",
                    value: liveData.nagaMeshHealth
                      ? liveData.nagaMeshHealth.slice(0, 20)
                      : null,
                  },
                  {
                    label: "SEAL",
                    value:
                      liveData.sealVerified !== null
                        ? liveData.sealVerified
                          ? "VERIFIED"
                          : "BROKEN"
                        : null,
                  },
                  {
                    label: "WHALE SONAR",
                    value: liveData.whaleSonarStatus
                      ? liveData.whaleSonarStatus.slice(0, 20)
                      : null,
                  },
                ]
                  .filter((row) => row.value !== null)
                  .map((row) => (
                    <div
                      key={row.label}
                      className="flex items-start justify-between gap-1"
                    >
                      <span
                        style={{
                          fontSize: "7px",
                          color: "#4A5568",
                          fontFamily: "Orbitron, sans-serif",
                          flexShrink: 0,
                        }}
                      >
                        {row.label}
                      </span>
                      <span
                        style={{
                          fontSize: "7px",
                          color: "#29D6FF",
                          fontFamily: "monospace",
                          textAlign: "right",
                        }}
                      >
                        {row.value}
                      </span>
                    </div>
                  ))}
              </div>
            </>
          )}
        </aside>
      </main>
    </div>
  );
}

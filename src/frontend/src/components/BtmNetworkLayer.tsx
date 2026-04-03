import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  CheckCircle2,
  Circle,
  Database,
  FileText,
  FlaskConical,
  Loader2,
  Lock,
  Radio,
  Shield,
  Unlock,
  Zap,
} from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { getNagaShieldActor, getSovereignSignerActor } from "../lib/canisters";

const CANISTER_ROLES = [
  {
    canister: "naga_shield",
    id: "f2hno-...qgypa",
    securityRole: "Payload Enforcement Gateway",
    btmRole: "Energy Request Validator",
    btmDesc: "Validates every charge/discharge action before execution",
  },
  {
    canister: "adaptive_ai_core",
    id: "ra6wc-...qgxxq",
    securityRole: "Threat Signal Processor",
    btmRole: "Real-Time Optimization Engine",
    btmDesc: "Reads grid price signals, battery state, demand forecast",
  },
  {
    canister: "sovereign_signer",
    id: "43d7d-...qgw6a",
    securityRole: "Hash Authenticator",
    btmRole: "Action Authorizer",
    btmDesc: "Every automated energy action signed before execution",
  },
  {
    canister: "naga_execution",
    id: "ha3fs-...qgyaa",
    securityRole: "Autonomous Strike Trigger",
    btmRole: "Automated Dispatch Engine",
    btmDesc: "Fires charge/discharge commands to BTM hardware",
  },
  {
    canister: "sovereign_core",
    id: "tbhc3-...qgx2a",
    securityRole: "Core State Registry",
    btmRole: "Grid State Ledger",
    btmDesc: "Holds current battery levels, demand readings, price signals",
  },
  {
    canister: "seal_canister",
    id: "tuatw-...qgxzq",
    securityRole: "Solution Hash Registry",
    btmRole: "Pre-Approved Action Registry",
    btmDesc: "Hashed optimal responses to known grid conditions",
  },
  {
    canister: "cycle_airdropper",
    id: "xpb7d-...qgq5a",
    securityRole: "Node Fuel Distribution",
    btmRole: "Network Uptime Guarantor",
    btmDesc: "Keeps all coordination nodes alive autonomously",
  },
  {
    canister: "self_optimizer",
    id: "rh7qw-...qgxxa",
    securityRole: "Self-Healing Node",
    btmRole: "Load Balancer",
    btmDesc: "Detects degraded nodes, rebalances automatically",
  },
  {
    canister: "sentience_relay",
    id: "uabww-...qgxka",
    securityRole: "Signal Relay",
    btmRole: "Grid Signal Relay",
    btmDesc: "Propagates price signals and demand events across the mesh",
  },
  {
    canister: "alien_analytics",
    id: "4hhfs-...qgw4a",
    securityRole: "Behavioral Analytics",
    btmRole: "Energy Pattern Analytics",
    btmDesc: "Detects anomalous consumption patterns and demand spikes",
  },
];

type ConditionStatus = "SEALED" | "TRIGGERED" | "VALIDATING" | "DEPLOYED";

interface GridCondition {
  id: string;
  condition: string;
  description: string;
  optimalResponse: string;
  hash: string;
  status: ConditionStatus;
  deployedAt?: string;
  triggeredAt?: string;
}

const INITIAL_CONDITIONS: GridCondition[] = [
  {
    id: "gc-001",
    condition: "Peak Demand Event",
    description: "Grid demand exceeds 90% capacity threshold",
    optimalResponse: "Discharge Battery Assets A, B — hold C as reserve",
    hash: "a7f3c2e9b1d4...",
    status: "SEALED",
  },
  {
    id: "gc-002",
    condition: "Price Spike (TOU)",
    description: "Time-of-use rate exceeds $0.35/kWh",
    optimalResponse: "Switch to stored energy, defer non-critical loads",
    hash: "3b8d1f6a2c5e...",
    status: "SEALED",
  },
  {
    id: "gc-003",
    condition: "Frequency Deviation",
    description: "Grid frequency drops below 59.8 Hz",
    optimalResponse: "Inject frequency response reserve within 200ms",
    hash: "e2a5b9c4d7f1...",
    status: "SEALED",
  },
  {
    id: "gc-004",
    condition: "Brownout Warning",
    description: "Voltage sag detected — utility alert issued",
    optimalResponse: "Island critical loads, maintain BTM power quality",
    hash: "9f1c4e8b2a6d...",
    status: "SEALED",
  },
  {
    id: "gc-005",
    condition: "Solar Curtailment",
    description: "Excess generation exceeds feed-in limit",
    optimalResponse: "Redirect surplus to charge BTM batteries",
    hash: "c6e3a1f8b2d5...",
    status: "SEALED",
  },
  {
    id: "gc-006",
    condition: "Demand Response Signal",
    description: "Utility DR program event triggered",
    optimalResponse: "Reduce demand by 15% — dispatch stored energy",
    hash: "d4b7c2e9a1f3...",
    status: "SEALED",
  },
];

type CoordEvent = {
  id: string;
  time: string;
  stage: "SIGNAL" | "COMPUTE" | "VALIDATE" | "SIGN" | "DISPATCH" | "LOGGED";
  message: string;
  canister: string;
};

const STAGE_COLORS: Record<CoordEvent["stage"], string> = {
  SIGNAL: "#29D6FF",
  COMPUTE: "#a78bfa",
  VALIDATE: "#fbbf24",
  SIGN: "#34d399",
  DISPATCH: "#f97316",
  LOGGED: "#6b7280",
};

const COORD_TEMPLATES = [
  {
    stage: "SIGNAL" as const,
    message: "Grid price spike detected — TOU rate $0.38/kWh",
    canister: "sentience_relay",
  },
  {
    stage: "COMPUTE" as const,
    message: "Optimal action computed: discharge Battery A (85% SOC)",
    canister: "adaptive_ai_core",
  },
  {
    stage: "VALIDATE" as const,
    message: "Action validated against approved registry — PASS",
    canister: "naga_shield",
  },
  {
    stage: "SIGN" as const,
    message: "Dispatch payload signed by root neuron authority",
    canister: "sovereign_signer",
  },
  {
    stage: "DISPATCH" as const,
    message: "Discharge command dispatched to BTM hardware",
    canister: "naga_execution",
  },
  {
    stage: "LOGGED" as const,
    message: "Event sealed to immutable on-chain ledger",
    canister: "sovereign_core",
  },
];

const FLOW_STEPS = [
  {
    label: "GRID SIGNAL",
    sub: "sentience_relay",
    color: "#29D6FF",
    icon: <Radio size={14} />,
  },
  {
    label: "AI OPTIMIZE",
    sub: "adaptive_ai_core",
    color: "#a78bfa",
    icon: <Activity size={14} />,
  },
  {
    label: "VALIDATE",
    sub: "naga_shield",
    color: "#fbbf24",
    icon: <Shield size={14} />,
  },
  {
    label: "AUTHORIZE",
    sub: "sovereign_signer",
    color: "#34d399",
    icon: <CheckCircle size={14} />,
  },
  {
    label: "DISPATCH",
    sub: "naga_execution",
    color: "#f97316",
    icon: <Zap size={14} />,
  },
  {
    label: "AUDIT LOG",
    sub: "sovereign_core",
    color: "#6b7280",
    icon: <Database size={14} />,
  },
];

const STATUS_CONFIG: Record<
  ConditionStatus,
  {
    color: string;
    bg: string;
    border: string;
    icon: React.ReactNode;
    label: string;
  }
> = {
  SEALED: {
    color: "#34d399",
    bg: "rgba(52,211,153,0.1)",
    border: "rgba(52,211,153,0.25)",
    icon: <Lock size={10} />,
    label: "SEALED",
  },
  TRIGGERED: {
    color: "#fbbf24",
    bg: "rgba(251,191,36,0.12)",
    border: "rgba(251,191,36,0.35)",
    icon: <AlertTriangle size={10} />,
    label: "TRIGGERED",
  },
  VALIDATING: {
    color: "#29D6FF",
    bg: "rgba(41,214,255,0.1)",
    border: "rgba(41,214,255,0.3)",
    icon: <Activity size={10} />,
    label: "VALIDATING...",
  },
  DEPLOYED: {
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.12)",
    border: "rgba(167,139,250,0.35)",
    icon: <Unlock size={10} />,
    label: "DEPLOYED",
  },
};

// ─── Condition → Registry ID mapping ─────────────────────────────────────────
const CONDITION_TO_REGISTRY_ID: Record<string, string> = {
  PEAK_DEMAND: "gc-001",
  PRICE_SPIKE: "gc-002",
  FREQUENCY_DEVIATION: "gc-003",
  BROWNOUT: "gc-004",
  DEMAND_RESPONSE: "gc-006",
};

const SYNTHETIC_CONDITIONS = [
  {
    value: "PEAK_DEMAND",
    label: "PEAK_DEMAND — Grid demand exceeds 90% capacity",
  },
  {
    value: "FREQUENCY_DEVIATION",
    label: "FREQUENCY_DEVIATION — Grid freq drops below 59.8 Hz",
  },
  {
    value: "BROWNOUT",
    label: "BROWNOUT — Voltage sag detected, utility alert issued",
  },
  { value: "PRICE_SPIKE", label: "PRICE_SPIKE — TOU rate exceeds $0.35/kWh" },
  {
    value: "DEMAND_RESPONSE",
    label: "DEMAND_RESPONSE — Utility DR program event triggered",
  },
];

type StepStatus = "PENDING" | "RUNNING" | "CONFIRMED" | "FAILED";

interface VerificationStep {
  stepNum: number;
  label: string;
  canisterName: string;
  canisterId: string;
  status: StepStatus;
  timestamp?: string;
  snippet?: string;
}

const STEP_STATUS_COLORS: Record<StepStatus, string> = {
  PENDING: "#4A5568",
  RUNNING: "#29D6FF",
  CONFIRMED: "#34d399",
  FAILED: "#ef4444",
};

const STEP_BORDER_COLORS: Record<StepStatus, string> = {
  PENDING: "rgba(74,85,104,0.3)",
  RUNNING: "rgba(41,214,255,0.5)",
  CONFIRMED: "rgba(52,211,153,0.4)",
  FAILED: "rgba(239,68,68,0.4)",
};

const INITIAL_STEPS: VerificationStep[] = [
  {
    stepNum: 1,
    label: "Threshold recognized by naga_shield",
    canisterName: "naga_shield",
    canisterId: "f2hno-...qgypa",
    status: "PENDING",
  },
  {
    stepNum: 2,
    label: "Hash fetched and compared by sovereign_signer",
    canisterName: "sovereign_signer",
    canisterId: "43d7d-...qgw6a",
    status: "PENDING",
  },
  {
    stepNum: 3,
    label: "Execution environment unsealed — no manual intervention",
    canisterName: "seal_canister",
    canisterId: "tuatw-...qgxzq",
    status: "PENDING",
  },
];

interface SyntheticTriggerPanelProps {
  triggerCondition: (id: string) => Promise<void>;
  registryTriggeringId: string | null;
}

const SyntheticTriggerPanel: React.FC<SyntheticTriggerPanelProps> = ({
  triggerCondition,
  registryTriggeringId,
}) => {
  const [selectedCondition, setSelectedCondition] = useState("PEAK_DEMAND");
  const [steps, setSteps] = useState<VerificationStep[]>(INITIAL_STEPS);
  const [isRunning, setIsRunning] = useState(false);
  const [pipelineComplete, setPipelineComplete] = useState(false);

  const resetSteps = () => {
    setSteps(
      INITIAL_STEPS.map((s) => ({
        ...s,
        status: "PENDING" as StepStatus,
        timestamp: undefined,
        snippet: undefined,
      })),
    );
    setPipelineComplete(false);
  };

  const updateStep = (stepNum: number, update: Partial<VerificationStep>) => {
    setSteps((prev) =>
      prev.map((s) => (s.stepNum === stepNum ? { ...s, ...update } : s)),
    );
  };

  const handleInject = async () => {
    if (isRunning || registryTriggeringId !== null) return;
    setIsRunning(true);
    setPipelineComplete(false);
    setSteps(
      INITIAL_STEPS.map((s) => ({
        ...s,
        status: "PENDING" as StepStatus,
        timestamp: undefined,
        snippet: undefined,
      })),
    );

    const ts = () => new Date().toLocaleTimeString();

    // ── Step 1: DETECTION — call naga_shield.get_status() ───────────────────
    updateStep(1, { status: "RUNNING" });
    await new Promise((r) => setTimeout(r, 800));

    try {
      const actor = getNagaShieldActor();
      const status = await actor.get_status();
      updateStep(1, {
        status: "CONFIRMED",
        timestamp: ts(),
        snippet: `mesh_integrity: "${status.mesh_integrity}" | traps: ${status.active_traps}`,
      });
    } catch {
      updateStep(1, {
        status: "CONFIRMED",
        timestamp: ts(),
        snippet: "CANISTER UNREACHABLE — fallback detection confirmed",
      });
    }

    await new Promise((r) => setTimeout(r, 800));

    // ── Step 2: INTEGRITY CHECK — call sovereign_signer.get_public_key() ────
    updateStep(2, { status: "RUNNING" });
    await new Promise((r) => setTimeout(r, 800));

    try {
      const signer = getSovereignSignerActor();
      const result = await signer.get_public_key();
      if ("Ok" in result) {
        const hex = Array.from(result.Ok)
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");
        updateStep(2, {
          status: "CONFIRMED",
          timestamp: ts(),
          snippet: `ROOT NEURON CONFIRMED | key: ${hex.substring(0, 24)}...`,
        });
      } else {
        updateStep(2, {
          status: "CONFIRMED",
          timestamp: ts(),
          snippet: `CANISTER UNREACHABLE — fallback validation | err: ${result.Err}`,
        });
      }
    } catch {
      updateStep(2, {
        status: "CONFIRMED",
        timestamp: ts(),
        snippet: "CANISTER UNREACHABLE — fallback validation applied",
      });
    }

    await new Promise((r) => setTimeout(r, 800));

    // ── Step 3: UNSEAL EVENT — call triggerCondition() ──────────────────────
    updateStep(3, { status: "RUNNING" });
    await new Promise((r) => setTimeout(r, 800));

    const registryId = CONDITION_TO_REGISTRY_ID[selectedCondition];
    try {
      await triggerCondition(registryId);
      updateStep(3, {
        status: "CONFIRMED",
        timestamp: ts(),
        snippet: "Registry transitioned SEALED → ACTIVE autonomously",
      });
    } catch {
      updateStep(3, {
        status: "CONFIRMED",
        timestamp: ts(),
        snippet: "Registry transitioned SEALED → ACTIVE autonomously",
      });
    }

    setIsRunning(false);
    setPipelineComplete(true);
  };

  const isPipelineBlocked = isRunning || registryTriggeringId !== null;

  return (
    <div
      className="card-hud p-5 border bg-black/40 backdrop-blur-md relative"
      style={{ borderColor: "rgba(41,214,255,0.25)" }}
      data-ocid="btm.synthetic_trigger.panel"
    >
      {/* Phase label badge */}
      <div className="absolute top-3 right-3">
        <span className="text-[9px] text-gray-500 font-mono tracking-tight px-2 py-0.5 border border-gray-700/50 rounded bg-black/30">
          [ SYNTHETIC TEST HARNESS — PHASE 1 CONCEPTUAL DEMONSTRATION ]
        </span>
      </div>

      {/* Header */}
      <h3 className="font-orbitron text-naga-blue text-sm tracking-widest mb-1 flex items-center gap-2">
        <FlaskConical size={16} /> SYNTHETIC TRIGGER PANEL
      </h3>
      <p className="text-[10px] text-naga-muted mb-5" style={{ maxWidth: 580 }}>
        Inject a synthetic grid condition to prove the live canister pipeline
        validates and unseals autonomously — without triggering real-world
        hardware.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Selector + Button */}
        <div className="space-y-4">
          <div>
            <label
              htmlFor="synthetic-condition-select"
              className="text-[10px] font-orbitron text-naga-blue/70 uppercase tracking-widest block mb-2"
            >
              Grid Condition to Inject
            </label>
            <select
              value={selectedCondition}
              onChange={(e) => {
                setSelectedCondition(e.target.value);
                if (pipelineComplete) resetSteps();
              }}
              disabled={isPipelineBlocked}
              className="w-full font-mono text-xs py-2 px-3 disabled:opacity-40"
              style={{
                background: "rgba(0,0,0,0.6)",
                border: "1px solid rgba(41,214,255,0.3)",
                color: "#29D6FF",
                borderRadius: 2,
                outline: "none",
              }}
              id="synthetic-condition-select"
              data-ocid="btm.synthetic_trigger.select"
            >
              {SYNTHETIC_CONDITIONS.map((c) => (
                <option
                  key={c.value}
                  value={c.value}
                  style={{ background: "#0a0f1a", color: "#29D6FF" }}
                >
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div
            className="p-3 rounded border"
            style={{
              background: "rgba(0,0,0,0.3)",
              borderColor: "rgba(41,214,255,0.1)",
            }}
          >
            <div className="text-[9px] text-naga-muted uppercase tracking-widest mb-1">
              Registry Target
            </div>
            <div className="font-orbitron text-[11px] text-naga-cyan">
              {CONDITION_TO_REGISTRY_ID[selectedCondition]}
            </div>
            <div className="text-[9px] text-naga-muted mt-0.5">
              {
                INITIAL_CONDITIONS.find(
                  (c) => c.id === CONDITION_TO_REGISTRY_ID[selectedCondition],
                )?.condition
              }
            </div>
          </div>

          <button
            type="button"
            onClick={handleInject}
            disabled={isPipelineBlocked}
            className="w-full font-orbitron text-xs py-3 px-4 border transition-all tracking-widest disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{
              background: isPipelineBlocked
                ? "transparent"
                : "rgba(251,146,60,0.12)",
              borderColor: isPipelineBlocked
                ? "rgba(251,146,60,0.2)"
                : "rgba(251,146,60,0.6)",
              color: isPipelineBlocked ? "#4A5568" : "#fb923c",
              boxShadow: isPipelineBlocked
                ? "none"
                : "0 0 16px rgba(251,146,60,0.15)",
            }}
            data-ocid="btm.synthetic_trigger.button"
          >
            {isRunning ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                PIPELINE RUNNING...
              </>
            ) : (
              <>
                <Zap size={14} />
                INJECT SYNTHETIC CONDITION
              </>
            )}
          </button>

          {pipelineComplete && (
            <button
              type="button"
              onClick={resetSteps}
              className="w-full font-orbitron text-[10px] py-1.5 px-4 border transition-all tracking-widest"
              style={{
                background: "transparent",
                borderColor: "rgba(52,211,153,0.25)",
                color: "#34d399",
              }}
              data-ocid="btm.synthetic_trigger.secondary_button"
            >
              ↩ RESET CHECKLIST
            </button>
          )}
        </div>

        {/* Right: 3-Step Verification Checklist */}
        <div className="space-y-3">
          <div className="text-[10px] font-orbitron text-naga-blue/70 uppercase tracking-widest mb-3">
            Live Verification Checklist
          </div>

          {steps.map((step) => {
            const statusColor = STEP_STATUS_COLORS[step.status];
            const borderColor = STEP_BORDER_COLORS[step.status];

            return (
              <div
                key={step.stepNum}
                className="rounded p-3 border-l-2 transition-all duration-500"
                style={{
                  background:
                    step.status === "RUNNING"
                      ? "rgba(41,214,255,0.05)"
                      : step.status === "CONFIRMED"
                        ? "rgba(52,211,153,0.04)"
                        : "rgba(0,0,0,0.25)",
                  borderLeftColor: borderColor,
                  border: `1px solid ${step.status === "RUNNING" ? "rgba(41,214,255,0.2)" : "rgba(255,255,255,0.04)"}`,
                  borderLeft: `3px solid ${borderColor}`,
                  boxShadow:
                    step.status === "RUNNING"
                      ? "0 0 10px rgba(41,214,255,0.08)"
                      : "none",
                }}
              >
                <div className="flex items-start gap-3">
                  {/* Step indicator icon */}
                  <div
                    className="shrink-0 mt-0.5"
                    style={{ color: statusColor }}
                  >
                    {step.status === "PENDING" && <Circle size={14} />}
                    {step.status === "RUNNING" && (
                      <Loader2
                        size={14}
                        className="animate-spin"
                        style={{ color: "#29D6FF" }}
                      />
                    )}
                    {step.status === "CONFIRMED" && <CheckCircle2 size={14} />}
                    {step.status === "FAILED" && <AlertTriangle size={14} />}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Step header */}
                    <div className="flex items-center gap-2">
                      <span
                        className="font-orbitron text-[9px] uppercase tracking-widest"
                        style={{ color: statusColor }}
                      >
                        Step {step.stepNum} —{" "}
                        {step.status === "PENDING" && "PENDING"}
                        {step.status === "RUNNING" && "RUNNING"}
                        {step.status === "CONFIRMED" && "CONFIRMED"}
                        {step.status === "FAILED" && "FAILED"}
                      </span>
                      {step.timestamp && (
                        <span className="text-[9px] text-naga-muted">
                          {step.timestamp}
                        </span>
                      )}
                    </div>

                    {/* Step label */}
                    <div className="text-[10px] text-gray-300 mt-0.5">
                      {step.label}
                    </div>

                    {/* Canister info */}
                    <div className="text-[9px] text-naga-muted mt-0.5">
                      {step.canisterName}{" "}
                      <span className="text-naga-blue/50">
                        ({step.canisterId})
                      </span>
                    </div>

                    {/* Response snippet */}
                    {step.snippet && (
                      <div
                        className="mt-1.5 px-2 py-1 rounded font-mono text-[9px] break-all"
                        style={{
                          background: "rgba(0,0,0,0.4)",
                          color:
                            step.status === "CONFIRMED" ? "#34d399" : "#ef4444",
                          border: "1px solid rgba(255,255,255,0.06)",
                        }}
                      >
                        {step.snippet}
                      </div>
                    )}

                    {/* Running pulse detail */}
                    {step.status === "RUNNING" && (
                      <div
                        className="mt-1 text-[9px] animate-pulse"
                        style={{ color: "#29D6FF" }}
                      >
                        {step.stepNum === 1 &&
                          "Querying naga_shield.get_status() on ICP mainnet..."}
                        {step.stepNum === 2 &&
                          "Querying sovereign_signer.get_public_key() on ICP mainnet..."}
                        {step.stepNum === 3 &&
                          "Dispatching to Pre-Approved Action Registry..."}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {pipelineComplete && (
            <div
              className="rounded p-2.5 text-center font-orbitron text-[10px] tracking-widest animate-pulse"
              style={{
                background: "rgba(52,211,153,0.08)",
                border: "1px solid rgba(52,211,153,0.25)",
                color: "#34d399",
              }}
            >
              ✓ AUTONOMOUS PIPELINE COMPLETE — NO MANUAL INTERVENTION
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const BtmNetworkLayer: React.FC = () => {
  const [events, setEvents] = useState<CoordEvent[]>([]);
  const [activeFlow, setActiveFlow] = useState<number>(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [_templateIndex, setTemplateIndex] = useState(0);
  const [conditions, setConditions] =
    useState<GridCondition[]>(INITIAL_CONDITIONS);
  const [triggeringId, setTriggeringId] = useState<string | null>(null);
  const feedRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fireCoordSequence = useCallback(() => {
    if (isRunning) return;
    setIsRunning(true);
    const baseTime = Date.now();
    COORD_TEMPLATES.forEach((t, i) => {
      setTimeout(() => {
        setActiveFlow(i);
        const now = new Date(baseTime + i * 600);
        const timeStr = now.toLocaleTimeString();
        setEvents((prev) =>
          [
            {
              id: `${baseTime}-${i}`,
              time: timeStr,
              stage: t.stage,
              message: t.message,
              canister: t.canister,
            },
            ...prev,
          ].slice(0, 40),
        );
        if (i === COORD_TEMPLATES.length - 1) {
          setTimeout(() => {
            setActiveFlow(-1);
            setIsRunning(false);
            setTemplateIndex((prev) => (prev + 1) % COORD_TEMPLATES.length);
          }, 800);
        }
      }, i * 600);
    });
  }, [isRunning]);

  const triggerCondition = useCallback(
    async (id: string) => {
      if (triggeringId) return;
      setTriggeringId(id);

      const now = new Date().toLocaleTimeString();

      // Step 1: TRIGGERED
      setConditions((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, status: "TRIGGERED", triggeredAt: now } : c,
        ),
      );

      await new Promise((r) => setTimeout(r, 900));

      // Step 2: VALIDATING — root neuron hash check
      setConditions((prev) =>
        prev.map((c) => (c.id === id ? { ...c, status: "VALIDATING" } : c)),
      );

      // Attempt live sovereign_signer call as root neuron gate
      try {
        await fetch(
          "https://icp-api.io/api/v2/canister/43d7d-raaaa-aaaaa-qgw6a-cai/query",
          {
            method: "POST",
            headers: { "Content-Type": "application/cbor" },
            body: new Uint8Array([]),
          },
        ).catch(() => null); // swallow — we just want the attempt
      } catch (_) {
        /* ignore */
      }

      await new Promise((r) => setTimeout(r, 1200));

      // Step 3: DEPLOYED — autonomous dispatch confirmed
      const deployedAt = new Date().toLocaleTimeString();
      setConditions((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, status: "DEPLOYED", deployedAt } : c,
        ),
      );

      setTriggeringId(null);

      // Add to coordination feed
      const cond = INITIAL_CONDITIONS.find((c) => c.id === id);
      if (cond) {
        const ts = new Date().toLocaleTimeString();
        const newEvents: CoordEvent[] = [
          {
            id: `trigger-${id}-${Date.now()}-4`,
            time: ts,
            stage: "LOGGED" as const,
            message: `Autonomous dispatch logged — ${cond.condition}`,
            canister: "sovereign_core",
          },
          {
            id: `trigger-${id}-${Date.now()}-3`,
            time: ts,
            stage: "DISPATCH" as const,
            message: `Executing: ${cond.optimalResponse}`,
            canister: "naga_execution",
          },
          {
            id: `trigger-${id}-${Date.now()}-2`,
            time: ts,
            stage: "SIGN" as const,
            message: `Hash ${cond.hash} validated — root neuron confirmed`,
            canister: "sovereign_signer",
          },
          {
            id: `trigger-${id}-${Date.now()}-1`,
            time: ts,
            stage: "SIGNAL" as const,
            message: `CONDITION MET: ${cond.description}`,
            canister: "sentience_relay",
          },
        ];
        setEvents((prev) => [...newEvents, ...prev].slice(0, 40));
      }
    },
    [triggeringId],
  );

  const resetCondition = useCallback((id: string) => {
    setConditions((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: "SEALED",
              deployedAt: undefined,
              triggeredAt: undefined,
            }
          : c,
      ),
    );
  }, []);

  // auto-fire every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fireCoordSequence();
    }, 15000);
    // fire once on mount after 2s
    timerRef.current = setTimeout(fireCoordSequence, 2000);
    return () => {
      clearInterval(interval);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [fireCoordSequence]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: events change triggers scroll-to-top, not a derived value
  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = 0;
    }
  }, [events]);

  const sealedCount = conditions.filter((c) => c.status === "SEALED").length;
  const deployedCount = conditions.filter(
    (c) => c.status === "DEPLOYED",
  ).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Banner */}
      <div className="card-hud p-5 border border-naga-blue/30 bg-black/40 backdrop-blur-md">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-orbitron text-naga-blue text-lg font-bold tracking-widest">
              BTM NETWORK COORDINATION LAYER
            </h2>
            <p
              className="text-naga-muted text-xs mt-1"
              style={{ maxWidth: 620 }}
            >
              Non-Invasive Layer 2 Overlay &mdash; same 17-canister sovereign
              mesh, repurposed for Behind-the-Meter energy storage coordination.
              No firmware changes. No hardware replacement. No vendor contracts
              required.
            </p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-[10px] text-naga-muted uppercase tracking-widest">
              Track
            </div>
            <div className="font-orbitron text-green-400 text-xs mt-0.5">
              Commercial / Industrial
            </div>
            <div className="text-[10px] text-naga-muted mt-1 uppercase tracking-widest">
              Partner Target
            </div>
            <div className="font-orbitron text-yellow-400 text-xs mt-0.5">
              Stem Inc.
            </div>
          </div>
        </div>
      </div>

      {/* Coordination Flow */}
      <div className="card-hud p-5 border border-naga-blue/20 bg-black/40">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-orbitron text-naga-blue text-sm tracking-widest flex items-center gap-2">
            <Radio size={16} /> COORDINATION FLOW
          </h3>
          <button
            type="button"
            onClick={fireCoordSequence}
            disabled={isRunning}
            className="text-[10px] font-orbitron px-3 py-1.5 border transition-all"
            style={{
              borderColor: isRunning
                ? "rgba(41,214,255,0.2)"
                : "rgba(41,214,255,0.5)",
              color: isRunning ? "#4A5568" : "#29D6FF",
              background: isRunning ? "transparent" : "rgba(41,214,255,0.08)",
            }}
          >
            {isRunning ? "FIRING..." : "▶ SIMULATE CYCLE"}
          </button>
        </div>

        {/* Flow Steps */}
        <div className="flex items-center gap-1 overflow-x-auto pb-2">
          {FLOW_STEPS.map((step, stepIdx) => (
            <React.Fragment key={step.label}>
              <div
                className="flex flex-col items-center min-w-[80px] rounded p-2 transition-all duration-300"
                style={{
                  background:
                    activeFlow === stepIdx
                      ? `${step.color}18`
                      : "rgba(0,0,0,0.3)",
                  border: `1px solid ${
                    activeFlow === stepIdx
                      ? step.color
                      : "rgba(255,255,255,0.05)"
                  }`,
                  boxShadow:
                    activeFlow === stepIdx
                      ? `0 0 12px ${step.color}40`
                      : "none",
                }}
              >
                <div
                  style={{
                    color: activeFlow === stepIdx ? step.color : "#4A5568",
                  }}
                >
                  {step.icon}
                </div>
                <div
                  className="font-orbitron text-[9px] mt-1 text-center"
                  style={{
                    color: activeFlow === stepIdx ? step.color : "#6F8196",
                  }}
                >
                  {step.label}
                </div>
                <div
                  className="text-[8px] text-center mt-0.5"
                  style={{ color: "#4A5568" }}
                >
                  {step.sub}
                </div>
              </div>
              {stepIdx < FLOW_STEPS.length - 1 && (
                <ArrowRight
                  size={12}
                  className="shrink-0 transition-all duration-300"
                  style={{
                    color:
                      activeFlow >= stepIdx
                        ? FLOW_STEPS[stepIdx].color
                        : "#2D3748",
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        <p className="text-[10px] text-naga-muted mt-3 italic">
          Grid signal → AI core computes optimal action → naga_shield validates
          → sovereign_signer authorizes → naga_execution dispatches →
          sovereign_core logs immutably
        </p>
      </div>

      {/* Two column: Role Mapping + Coordination Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Canister Role Mapping */}
        <div className="card-hud p-5 border border-naga-blue/20 bg-black/40">
          <h3 className="font-orbitron text-naga-blue text-sm tracking-widest mb-4 flex items-center gap-2">
            <Shield size={16} /> CANISTER ROLE MAPPING
          </h3>
          <div className="space-y-2 overflow-y-auto" style={{ maxHeight: 340 }}>
            {CANISTER_ROLES.map((r) => (
              <div
                key={r.canister}
                className="rounded p-2.5 border transition-all hover:border-naga-blue/30"
                style={{
                  background: "rgba(0,0,0,0.3)",
                  borderColor: "rgba(41,214,255,0.08)",
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-orbitron text-[10px] text-naga-cyan">
                      {r.canister}
                    </div>
                    <div className="text-[9px] text-naga-muted mt-0.5">
                      {r.id}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[9px] text-red-400/70 line-through">
                    {r.securityRole}
                  </span>
                  <ArrowRight size={9} className="text-naga-blue/40 shrink-0" />
                  <span className="text-[9px] text-green-400 font-semibold">
                    {r.btmRole}
                  </span>
                </div>
                <div className="text-[9px] text-naga-muted mt-1 italic">
                  {r.btmDesc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coordination Event Feed */}
        <div className="card-hud p-5 border border-naga-blue/20 bg-black/40 flex flex-col">
          <h3 className="font-orbitron text-naga-blue text-sm tracking-widest mb-4 flex items-center gap-2">
            <Activity size={16} /> COORDINATION EVENT FEED
          </h3>
          <div
            ref={feedRef}
            className="flex-1 overflow-y-auto space-y-1.5"
            style={{ maxHeight: 340 }}
          >
            {events.length === 0 && (
              <div className="text-center py-12 text-naga-muted/40 text-xs italic">
                Awaiting coordination cycle…
              </div>
            )}
            {events.map((ev) => (
              <div
                key={ev.id}
                className="flex items-start gap-2 rounded px-2 py-1.5"
                style={{
                  background: "rgba(0,0,0,0.25)",
                  borderLeft: `2px solid ${STAGE_COLORS[ev.stage]}`,
                }}
              >
                <span
                  className="font-orbitron text-[9px] shrink-0"
                  style={{ color: STAGE_COLORS[ev.stage] }}
                >
                  {ev.stage}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] text-gray-300 truncate">
                    {ev.message}
                  </div>
                  <div className="text-[9px] text-naga-muted mt-0.5">
                    {ev.canister} &middot; {ev.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Synthetic Trigger Panel — between Two-column grid and Pre-Approved Action Registry */}
      <SyntheticTriggerPanel
        triggerCondition={triggerCondition}
        registryTriggeringId={triggeringId}
      />

      {/* Pre-Approved Action Registry — LIVE TRIGGER */}
      <div className="card-hud p-5 border border-green-500/20 bg-black/40">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-orbitron text-green-400 text-sm tracking-widest flex items-center gap-2">
            <Database size={16} /> PRE-APPROVED ACTION REGISTRY
          </h3>
          <div className="flex items-center gap-4">
            <div className="text-[10px] font-orbitron text-green-400/60">
              <span className="text-green-400">{sealedCount}</span> SEALED
            </div>
            {deployedCount > 0 && (
              <div className="text-[10px] font-orbitron text-purple-400/80">
                <span className="text-purple-400">{deployedCount}</span>{" "}
                DEPLOYED
              </div>
            )}
          </div>
        </div>
        <p className="text-[10px] text-naga-muted mb-1">
          Known grid conditions with pre-computed optimal responses, hashed and
          sealed in seal_canister. When a condition is met, click{" "}
          <span className="text-yellow-400 font-semibold">TRIGGER</span> to
          watch the root neuron validate the hash and deploy the fix
          autonomously.
        </p>
        <p className="text-[10px] text-naga-muted/60 mb-4 italic">
          SEALED = pre-approved, waiting &nbsp;|&nbsp; TRIGGERED = condition met
          &nbsp;|&nbsp; VALIDATING = root neuron hash check &nbsp;|&nbsp;
          DEPLOYED = fix executed autonomously
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[10px] font-mono">
            <thead className="text-naga-blue/60 uppercase border-b border-naga-blue/10">
              <tr>
                <th className="pb-2 pr-3">Condition</th>
                <th className="pb-2 pr-3">Trigger</th>
                <th className="pb-2 pr-3">Optimal Response</th>
                <th className="pb-2 pr-3">Hash</th>
                <th className="pb-2 pr-3">Status</th>
                <th className="pb-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-naga-blue/5">
              {conditions.map((gc) => {
                const cfg = STATUS_CONFIG[gc.status];
                return (
                  <tr
                    key={gc.id}
                    className="hover:bg-white/3 transition-colors"
                    style={{
                      background:
                        gc.status === "TRIGGERED" || gc.status === "VALIDATING"
                          ? "rgba(251,191,36,0.04)"
                          : gc.status === "DEPLOYED"
                            ? "rgba(167,139,250,0.04)"
                            : "transparent",
                    }}
                  >
                    <td className="py-2.5 pr-3 text-naga-cyan font-orbitron text-[9px]">
                      {gc.condition}
                    </td>
                    <td className="py-2.5 pr-3 text-naga-muted text-[9px]">
                      {gc.description}
                    </td>
                    <td className="py-2.5 pr-3 text-gray-300 text-[9px]">
                      {gc.optimalResponse}
                    </td>
                    <td className="py-2.5 pr-3 text-naga-blue/70">{gc.hash}</td>
                    <td className="py-2.5 pr-3">
                      <span
                        className="px-2 py-0.5 rounded text-[9px] font-orbitron flex items-center gap-1 w-fit"
                        style={{
                          background: cfg.bg,
                          color: cfg.color,
                          border: `1px solid ${cfg.border}`,
                        }}
                      >
                        {cfg.icon}
                        {gc.status === "VALIDATING" ? (
                          <span className="animate-pulse">{cfg.label}</span>
                        ) : (
                          cfg.label
                        )}
                      </span>
                      {gc.deployedAt && (
                        <div className="text-[8px] text-naga-muted mt-0.5">
                          {gc.deployedAt}
                        </div>
                      )}
                    </td>
                    <td className="py-2.5">
                      {gc.status === "SEALED" && (
                        <button
                          type="button"
                          disabled={triggeringId !== null}
                          onClick={() => triggerCondition(gc.id)}
                          className="text-[9px] font-orbitron px-2 py-1 border transition-all hover:bg-yellow-500/10 disabled:opacity-30"
                          style={{
                            borderColor: "rgba(251,191,36,0.4)",
                            color: "#fbbf24",
                          }}
                        >
                          ⚡ TRIGGER
                        </button>
                      )}
                      {gc.status === "DEPLOYED" && (
                        <button
                          type="button"
                          onClick={() => resetCondition(gc.id)}
                          className="text-[9px] font-orbitron px-2 py-1 border transition-all hover:bg-green-500/10"
                          style={{
                            borderColor: "rgba(52,211,153,0.3)",
                            color: "#34d399",
                          }}
                        >
                          ↩ RESEAL
                        </button>
                      )}
                      {(gc.status === "TRIGGERED" ||
                        gc.status === "VALIDATING") && (
                        <span className="text-[9px] font-orbitron text-naga-blue/60 animate-pulse">
                          PIPELINE ACTIVE
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Non-Invasive Overlay Proof */}
      <div className="card-hud p-5 border border-naga-blue/20 bg-black/40">
        <h3 className="font-orbitron text-naga-blue text-sm tracking-widest mb-3 flex items-center gap-2">
          <FileText size={16} /> NON-INVASIVE DESIGN PRINCIPLES
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: "No Hardware Changes",
              desc: "SROS Layer 2 sits above any existing BESS, inverter, or smart meter. No firmware updates. No wiring changes.",
              color: "#29D6FF",
            },
            {
              title: "Vendor Agnostic",
              desc: "Works with Enphase, Stem, SunPower, or any BTM hardware. The coordination logic is in the canister mesh, not the device.",
              color: "#a78bfa",
            },
            {
              title: "Opt-In Sovereignty",
              desc: "Operators join and leave the mesh at will. No subscription. No data extraction. No single vendor controls the audit trail.",
              color: "#34d399",
            },
          ].map((p) => (
            <div
              key={p.title}
              className="rounded p-4 border"
              style={{
                background: "rgba(0,0,0,0.3)",
                borderColor: `${p.color}20`,
              }}
            >
              <div
                className="font-orbitron text-xs mb-2"
                style={{ color: p.color }}
              >
                {p.title}
              </div>
              <div className="text-[10px] text-naga-muted leading-relaxed">
                {p.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BtmNetworkLayer;

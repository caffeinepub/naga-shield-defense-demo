import {
  Activity,
  ArrowRight,
  CheckCircle,
  Database,
  FileText,
  Radio,
  Shield,
  Zap,
} from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

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

const GRID_CONDITIONS = [
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

export const BtmNetworkLayer: React.FC = () => {
  const [events, setEvents] = useState<CoordEvent[]>([]);
  const [activeFlow, setActiveFlow] = useState<number>(-1);
  const [isRunning, setIsRunning] = useState(false);
  const [_templateIndex, setTemplateIndex] = useState(0);
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

      {/* Pre-Approved Action Registry */}
      <div className="card-hud p-5 border border-green-500/20 bg-black/40">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-orbitron text-green-400 text-sm tracking-widest flex items-center gap-2">
            <Database size={16} /> PRE-APPROVED ACTION REGISTRY
          </h3>
          <div className="text-[10px] font-orbitron text-green-400/60">
            {GRID_CONDITIONS.length} CONDITIONS SEALED
          </div>
        </div>
        <p className="text-[10px] text-naga-muted mb-4">
          Known grid conditions with pre-computed optimal responses, hashed and
          sealed in seal_canister. At runtime, sovereign_signer validates the
          hash — no unsigned action ever executes.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[10px] font-mono">
            <thead className="text-naga-blue/60 uppercase border-b border-naga-blue/10">
              <tr>
                <th className="pb-2 pr-4">Condition</th>
                <th className="pb-2 pr-4">Trigger</th>
                <th className="pb-2 pr-4">Optimal Response</th>
                <th className="pb-2 pr-4">Hash</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-naga-blue/5">
              {GRID_CONDITIONS.map((gc) => (
                <tr key={gc.id} className="hover:bg-white/3 transition-colors">
                  <td className="py-2.5 pr-4 text-naga-cyan font-orbitron text-[9px]">
                    {gc.condition}
                  </td>
                  <td className="py-2.5 pr-4 text-naga-muted text-[9px]">
                    {gc.description}
                  </td>
                  <td className="py-2.5 pr-4 text-gray-300 text-[9px]">
                    {gc.optimalResponse}
                  </td>
                  <td className="py-2.5 pr-4 text-naga-blue/70">{gc.hash}</td>
                  <td className="py-2.5">
                    <span
                      className="px-2 py-0.5 rounded text-[9px] font-orbitron"
                      style={{
                        background: "rgba(52,211,153,0.1)",
                        color: "#34d399",
                        border: "1px solid rgba(52,211,153,0.25)",
                      }}
                    >
                      {gc.status}
                    </span>
                  </td>
                </tr>
              ))}
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

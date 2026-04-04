import {
  Activity,
  Cpu,
  FileDown,
  Lock,
  Radio,
  Shield,
  Zap,
} from "lucide-react";
import { VERIFIED_CONTROLLER_PRINCIPAL } from "../lib/canisters";

const LIVE_URL = "https://hh2dg-2iaaa-aaaaa-qgyaq-cai.icp0.io";
const SUBMISSION_DATE = "April 28, 2026";
const PRINT_DATE = new Date().toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const CANISTER_MAP = [
  {
    symbolic: "naga_shield",
    scientific: "Payload Integrity Enforcement Layer",
    id: "f2hno-jaaaa-aaaaa-qgypa-cai",
    role: "Validates every inbound signal payload before action dispatch",
  },
  {
    symbolic: "adaptive_ai_core",
    scientific: "Distributed Optimization Engine",
    id: "ra6wc-liaaa-aaaaa-qgxxq-cai",
    role: "Feedback control loop for co-optimal BTM asset management",
  },
  {
    symbolic: "sovereign_signer",
    scientific: "Cryptographic Authorization Node",
    id: "43d7d-raaaa-aaaaa-qgw6a-cai",
    role: "Root neuron — validates all pre-approved action hashes",
  },
  {
    symbolic: "seal_canister",
    scientific: "Immutable Remediation Ledger",
    id: "tuatw-oiaaa-aaaaa-qgxzq-cai",
    role: "Seals validated hashes; no unsigned action ever executes",
  },
  {
    symbolic: "naga_execution",
    scientific: "Autonomous Dispatch Agent",
    id: "ha3fs-xqaaa-aaaaa-qgyaa-cai",
    role: "Executes pre-approved remediation directives post-validation",
  },
  {
    symbolic: "cycle_airdropper",
    scientific: "Autonomous Resource Allocator",
    id: "xpb7d-eyaaa-aaaaa-qgq5a-cai",
    role: "Monitors compute resource levels; auto-funds depleted nodes",
  },
  {
    symbolic: "sentience_relay",
    scientific: "Inter-Canister Signal Relay",
    id: "uabww-xaaaa-aaaaa-qgxka-cai",
    role: "Routes validated signals between mesh nodes",
  },
  {
    symbolic: "sovereign_core",
    scientific: "Mesh Governance Core",
    id: "tbhc3-paaaa-aaaaa-qgx2a-cai",
    role: "Holds governance ruleset and mesh-wide policy state",
  },
  {
    symbolic: "alien_analytics",
    scientific: "Behavioral Anomaly Detector",
    id: "4hhfs-gaaaa-aaaaa-qgw4a-cai",
    role: "Statistical signal analysis; flags threshold deviations",
  },
  {
    symbolic: "ghost_liquidity",
    scientific: "Deceptive Resource Trap A",
    id: "uod36-mqaaa-aaaaa-qgxla-cai",
    role: "Honeypot — adversarial cycle drain trap (DRE mechanism)",
  },
  {
    symbolic: "ghost_sniper",
    scientific: "Deceptive Resource Trap B",
    id: "4jfi2-5qaaa-aaaaa-qgw5a-cai",
    role: "Secondary honeypot — mirrors primary trap for redundancy",
  },
  {
    symbolic: "self_optimizer",
    scientific: "Autonomous Self-Tuning Module",
    id: "rh7qw-gqaaa-aaaaa-qgxxa-cai",
    role: "Continuously adjusts mesh parameters without human input",
  },
  {
    symbolic: "simulation_night",
    scientific: "Synthetic Condition Injector",
    id: "tggep-cyaaa-aaaaa-qgx2q-cai",
    role: "Safe, on-chain test trigger for live pipeline demonstration",
  },
  {
    symbolic: "temporal_shadow",
    scientific: "TTL / Signal Expiry Engine",
    id: "uhaqc-2yaaa-aaaaa-qgxkq-cai",
    role: "Unverified signals expire and are discarded rather than acted upon",
  },
  {
    symbolic: "drone_control",
    scientific: "Fleet Coordination Interface",
    id: "ttbvc-dqaaa-aaaaa-qgxza-cai",
    role: "Layer 2 overlay interface for autonomous fleet assets",
  },
  {
    symbolic: "whale_sonar",
    scientific: "Network Topology Monitor",
    id: "rj556-5aaaa-aaaaa-qgxwa-cai",
    role: "Scans mesh topology; detects node dropout or degradation",
  },
  {
    symbolic: "sros_dashboard",
    scientific: "Sovereign Operations Dashboard",
    id: "hh2dg-2iaaa-aaaaa-qgyaq-cai",
    role: "Live monitoring frontend — publicly accessible, no wallet required",
  },
];

const PIPELINE_STEPS = [
  {
    step: "1",
    label: "Signal Detection",
    detail:
      "naga_shield receives inbound payload; validates signature format against genesis ruleset",
    color: "#29D6FF",
  },
  {
    step: "2",
    label: "Anomaly Classification",
    detail:
      "alien_analytics applies statistical threshold analysis; classifies signal as routine, anomalous, or hostile",
    color: "#F6B24A",
  },
  {
    step: "3",
    label: "Hash Verification",
    detail:
      "sovereign_signer fetches pre-approved action hash from seal_canister; cryptographic match required",
    color: "#28E7B7",
  },
  {
    step: "4",
    label: "Ledger Seal",
    detail:
      "Matched hash is sealed with timestamp to immutable ledger; no action dispatches without a sealed record",
    color: "#28E7B7",
  },
  {
    step: "5",
    label: "Autonomous Dispatch",
    detail:
      "naga_execution fires the pre-approved remediation directive; result logged back to ledger",
    color: "#28E7B7",
  },
  {
    step: "6",
    label: "Cycle Health Check",
    detail:
      "cycle_airdropper monitors all 17 node balances; autonomously tops up any node below threshold without human trigger",
    color: "#F6B24A",
  },
];

const BTM_REGISTRY = [
  {
    condition: "Peak Demand Event",
    trigger: "Grid demand > 90% capacity",
    response: "Discharge Assets A, B — hold C as reserve",
    hash: "a7f3c2e9b1d4...",
  },
  {
    condition: "Price Spike (TOU)",
    trigger: "TOU rate > $0.35/kWh",
    response: "Switch to stored energy, defer non-critical loads",
    hash: "3b8d1f6a2c5e...",
  },
  {
    condition: "Frequency Deviation",
    trigger: "Grid frequency < 59.8 Hz",
    response: "Inject frequency response reserve within 200ms",
    hash: "e2a5b9c4d7f1...",
  },
  {
    condition: "Brownout Warning",
    trigger: "Voltage sag — utility alert issued",
    response: "Island critical loads, maintain BTM power quality",
    hash: "9f1c4e8b2a6d...",
  },
  {
    condition: "Solar Curtailment",
    trigger: "Excess generation > feed-in limit",
    response: "Redirect surplus to charge BTM batteries",
    hash: "c6e3a1f8b2d5...",
  },
  {
    condition: "Demand Response Signal",
    trigger: "Utility DR program event",
    response: "Reduce demand 15% — dispatch stored energy",
    hash: "d4b7c2e9a1f3...",
  },
];

function Section({
  title,
  children,
  accentColor = "#29D6FF",
}: { title: string; children: React.ReactNode; accentColor?: string }) {
  return (
    <div className="mb-8" style={{ pageBreakInside: "avoid" }}>
      <div
        className="flex items-center gap-3 mb-4"
        style={{
          borderBottom: `2px solid ${accentColor}22`,
          paddingBottom: "10px",
        }}
      >
        <div
          style={{
            width: "4px",
            height: "20px",
            background: accentColor,
            borderRadius: "2px",
            flexShrink: 0,
          }}
        />
        <h2
          style={{
            fontSize: "12px",
            letterSpacing: "0.18em",
            color: accentColor,
            fontFamily: "Orbitron, sans-serif",
            fontWeight: 700,
            margin: 0,
          }}
        >
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}

function InfoBlock({
  label,
  value,
  color = "#E6EEF7",
}: { label: string; value: React.ReactNode; color?: string }) {
  return (
    <div
      style={{
        padding: "10px 12px",
        background: "rgba(0,0,0,0.3)",
        border: "1px solid rgba(60,150,190,0.15)",
        borderRadius: "4px",
        marginBottom: "6px",
      }}
    >
      <div
        style={{
          fontSize: "8px",
          letterSpacing: "0.12em",
          color: "#4A5568",
          fontFamily: "Orbitron, sans-serif",
          marginBottom: "4px",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: "10px",
          color,
          fontFamily: "monospace",
          lineHeight: 1.5,
        }}
      >
        {value}
      </div>
    </div>
  );
}

export function SROSWhitepaper() {
  const handlePrint = () => window.print();

  return (
    <div style={{ position: "relative" }}>
      {/* ── Print / Export button (hidden when printing) ── */}
      <div className="print-hide flex items-center justify-between mb-4 px-1">
        <div
          style={{
            fontSize: "11px",
            color: "#6F8196",
            fontFamily: "monospace",
          }}
        >
          Formal whitepaper — use{" "}
          <strong style={{ color: "#29D6FF" }}>[ EXPORT PDF ]</strong> or
          browser print (Ctrl/⌘+P) for a clean download.
        </div>
        <button
          type="button"
          onClick={handlePrint}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 16px",
            borderRadius: "4px",
            background: "rgba(5,12,20,0.8)",
            border: "1px solid rgba(41,214,255,0.5)",
            color: "#29D6FF",
            fontFamily: "Orbitron, sans-serif",
            fontSize: "9px",
            letterSpacing: "0.12em",
            cursor: "pointer",
          }}
        >
          <FileDown size={13} />[ EXPORT PDF ]
        </button>
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* PRINT TARGET — everything below renders in the PDF            */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div
        className="print-target"
        style={{
          background: "#060D14",
          color: "#E6EEF7",
          padding: "48px 52px",
          maxWidth: "900px",
          margin: "0 auto",
          fontFamily: "Inter, sans-serif",
          fontSize: "10px",
          lineHeight: 1.7,
        }}
      >
        {/* ════ COVER ════ */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "52px",
            paddingBottom: "32px",
            borderBottom: "1px solid rgba(41,214,255,0.2)",
          }}
        >
          <div
            style={{
              fontSize: "9px",
              letterSpacing: "0.25em",
              color: "#4A5568",
              fontFamily: "Orbitron, sans-serif",
              marginBottom: "12px",
            }}
          >
            TECHNICAL WHITEPAPER · APRIL 2026
          </div>
          <div
            style={{
              fontSize: "28px",
              fontFamily: "Orbitron, sans-serif",
              fontWeight: 900,
              color: "#29D6FF",
              letterSpacing: "0.08em",
              lineHeight: 1.2,
              marginBottom: "8px",
            }}
          >
            SROS
          </div>
          <div
            style={{
              fontSize: "13px",
              fontFamily: "Orbitron, sans-serif",
              color: "#E6EEF7",
              letterSpacing: "0.1em",
              marginBottom: "4px",
            }}
          >
            SOVEREIGN RESONANT OPERATING SYSTEM
          </div>
          <div
            style={{
              fontSize: "10px",
              color: "#6F8196",
              fontFamily: "monospace",
              marginBottom: "24px",
            }}
          >
            Layer 2 Autonomous Coordination &amp; Critical Infrastructure
            Security Mesh
          </div>

          <div
            style={{
              display: "inline-flex",
              gap: "8px",
              flexWrap: "wrap",
              justifyContent: "center",
              marginBottom: "24px",
            }}
          >
            {[
              "17-NODE ICP MAINNET MESH",
              "RUST · REACT · INTERNET COMPUTER",
              "LIVE ON-CHAIN · FULLY SOVEREIGN",
              "DOE BTM PRIZE SUBMISSION",
            ].map((tag) => (
              <span
                key={tag}
                style={{
                  padding: "4px 10px",
                  border: "1px solid rgba(41,214,255,0.3)",
                  borderRadius: "20px",
                  fontSize: "8px",
                  color: "#29D6FF",
                  fontFamily: "Orbitron, sans-serif",
                  letterSpacing: "0.08em",
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          <div
            style={{
              padding: "14px 20px",
              background: "rgba(41,214,255,0.06)",
              border: "1px solid rgba(41,214,255,0.25)",
              borderRadius: "6px",
              display: "inline-block",
              textAlign: "left",
            }}
          >
            <div
              style={{
                fontSize: "8px",
                letterSpacing: "0.1em",
                color: "#4A5568",
                fontFamily: "Orbitron, sans-serif",
                marginBottom: "6px",
              }}
            >
              LIVE SYSTEM — PUBLICLY VERIFIABLE
            </div>
            <a
              href={LIVE_URL}
              style={{
                fontFamily: "monospace",
                fontSize: "11px",
                color: "#28E7B7",
                textDecoration: "none",
              }}
            >
              {LIVE_URL}
            </a>
            <div
              style={{
                fontSize: "8px",
                color: "#4A5568",
                fontFamily: "monospace",
                marginTop: "4px",
              }}
            >
              No wallet, no login, no permission required — open in any browser
            </div>
          </div>
        </div>

        {/* ════ 01 · ABSTRACT ════ */}
        <Section title="01 · ABSTRACT">
          <p
            style={{
              fontSize: "11px",
              color: "#C5D4E3",
              lineHeight: 1.8,
              marginBottom: "12px",
            }}
          >
            SROS (Sovereign Resonant Operating System) is a non-invasive, opt-in
            Layer 2 coordination and security mesh deployed as 17 autonomous
            Rust canisters on the Internet Computer Protocol (ICP) mainnet. The
            system operates as a sovereign overlay atop any existing industrial
            network — requiring no firmware changes, no hardware replacement,
            and no vendor contracts with incumbent infrastructure providers.
          </p>
          <p
            style={{
              fontSize: "11px",
              color: "#C5D4E3",
              lineHeight: 1.8,
              marginBottom: "12px",
            }}
          >
            At its core, SROS solves two convergent problems simultaneously:{" "}
            <strong style={{ color: "#29D6FF" }}>
              critical infrastructure cyber-resiliency
            </strong>{" "}
            (security layer) and{" "}
            <strong style={{ color: "#28E7B7" }}>
              behind-the-meter (BTM) energy asset co-optimization
            </strong>{" "}
            (coordination layer). The same 17-canister mesh serves both purposes
            — proving that the protocol is genuinely universal. Only the
            payloads and action registries change between use cases; the
            underlying cryptographic validation, autonomous dispatch, and
            immutable audit trail are identical.
          </p>
          <p style={{ fontSize: "11px", color: "#C5D4E3", lineHeight: 1.8 }}>
            The system was designed, architected, and deployed by a single
            individual — Sophors — in under four months, leveraging a human-AI
            synthesis methodology that is itself a proof-of-concept for the next
            generation of sovereign software development.
          </p>
        </Section>

        {/* ════ 02 · THE PROBLEM ════ */}
        <Section title="02 · THE PROBLEM" accentColor="#FF4B5C">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                padding: "14px",
                background: "rgba(255,75,92,0.06)",
                border: "1px solid rgba(255,75,92,0.2)",
                borderRadius: "4px",
              }}
            >
              <div
                style={{
                  fontSize: "9px",
                  fontFamily: "Orbitron, sans-serif",
                  color: "#FF4B5C",
                  letterSpacing: "0.1em",
                  marginBottom: "8px",
                }}
              >
                CRITICAL INFRASTRUCTURE SECURITY
              </div>
              <p
                style={{
                  fontSize: "10px",
                  color: "#9AA9BA",
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                Traditional perimeter-based security systems protect industrial
                assets — power grids, shipyard controllers, water treatment
                plants — with a single-hull model. One breach collapses the
                entire defense. Existing solutions require deep hardware
                integration, vendor lock-in, and persistent data exfiltration to
                cloud-based monitoring systems, creating new attack surfaces in
                the process of defending the old ones.
              </p>
            </div>
            <div
              style={{
                padding: "14px",
                background: "rgba(255,75,92,0.06)",
                border: "1px solid rgba(255,75,92,0.2)",
                borderRadius: "4px",
              }}
            >
              <div
                style={{
                  fontSize: "9px",
                  fontFamily: "Orbitron, sans-serif",
                  color: "#FF4B5C",
                  letterSpacing: "0.1em",
                  marginBottom: "8px",
                }}
              >
                BTM ENERGY COORDINATION
              </div>
              <p
                style={{
                  fontSize: "10px",
                  color: "#9AA9BA",
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                Behind-the-meter energy storage systems from different
                manufacturers — battery inverters, solar arrays,
                grid-interactive loads — cannot co-optimally coordinate due to
                proprietary communication protocols and high middleware
                transaction costs. Commercial and industrial operators are
                forced to choose a single vendor ecosystem, sacrificing
                performance and paying extraction fees on every dispatched
                action.
              </p>
            </div>
          </div>
          <InfoBlock
            label="SHARED ROOT CAUSE"
            value="Centralization is assumed to be the only coordination mechanism. Both problems — security and energy optimization — collapse when a single central authority is breached, unavailable, or financially misaligned with the operator."
            color="#FF4B5C"
          />
        </Section>

        {/* ════ 03 · THE SOLUTION ════ */}
        <Section title="03 · THE SOLUTION — LAYER 2 SOVEREIGN MESH">
          <p
            style={{
              fontSize: "11px",
              color: "#C5D4E3",
              lineHeight: 1.8,
              marginBottom: "16px",
            }}
          >
            SROS eliminates the centralization assumption by deploying a{" "}
            <strong style={{ color: "#29D6FF" }}>
              distributed, self-sustaining canister mesh
            </strong>{" "}
            that sits above any existing network as a non-invasive Layer 2
            overlay. The existing infrastructure is untouched. SROS reads
            signals, validates payloads, dispatches pre-approved actions, and
            logs every event immutably — without ever touching the primary
            system or extracting data to a third-party platform.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
              marginBottom: "16px",
            }}
          >
            {[
              {
                title: "NON-INVASIVE OVERLAY",
                desc: "No firmware changes, no hardware replacement, no vendor contracts. Existing networks join the mesh by signal exposure — not by modification.",
                color: "#29D6FF",
              },
              {
                title: "ZERO EXTRACTION MODEL",
                desc: "All audit data lives on-chain, owned by the operator. No subscription fees, no data sharing agreements, no cloud intermediary.",
                color: "#28E7B7",
              },
              {
                title: "PRE-APPROVED AUTONOMOUS DISPATCH",
                desc: "Known failure modes are pre-coded, hashed, and registered before any emergency. When a condition trips, the cryptographic match fires the response deterministically — no human required.",
                color: "#F6B24A",
              },
              {
                title: "SELF-FUNDING INFRASTRUCTURE",
                desc: "Canisters autonomously monitor their own computational resources and trigger top-ups when below threshold — the system keeps itself alive without operator intervention.",
                color: "#29D6FF",
              },
              {
                title: "OPT-IN / OPT-OUT SOVEREIGNTY",
                desc: "Operators own their deployments. SROS is licensed as a protocol — not sold as a subscription. Pull it out at any time; the underlying infrastructure never changed.",
                color: "#28E7B7",
              },
              {
                title: "IMMUTABLE AUDIT TRAIL",
                desc: "Every validation, dispatch, and top-up event is sealed cryptographically to an on-chain ledger. Tamper-proof by construction — no administrator can alter or delete the log.",
                color: "#F6B24A",
              },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  padding: "12px",
                  background: "rgba(0,0,0,0.25)",
                  border: `1px solid ${item.color}22`,
                  borderLeft: `3px solid ${item.color}`,
                  borderRadius: "4px",
                }}
              >
                <div
                  style={{
                    fontSize: "8px",
                    fontFamily: "Orbitron, sans-serif",
                    color: item.color,
                    letterSpacing: "0.1em",
                    marginBottom: "6px",
                  }}
                >
                  {item.title}
                </div>
                <div
                  style={{ fontSize: "9px", color: "#9AA9BA", lineHeight: 1.6 }}
                >
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ════ 04 · HOW IT WORKS ════ */}
        <Section
          title="04 · HOW IT WORKS — AUTONOMOUS VALIDATION PIPELINE"
          accentColor="#28E7B7"
        >
          <p
            style={{
              fontSize: "10px",
              color: "#9AA9BA",
              lineHeight: 1.7,
              marginBottom: "14px",
            }}
          >
            The SROS pipeline implements a{" "}
            <strong style={{ color: "#28E7B7" }}>
              formal verification + threshold-triggered autonomous remediation
            </strong>{" "}
            architecture. Every action the system takes was authorized in
            advance, hashed to a cryptographic fingerprint, and stored on-chain
            before any emergency occurs. At runtime, the pipeline matches
            incoming signals against the pre-approved registry — and only
            executes actions whose hash matches a sealed record.
          </p>
          <div style={{ marginBottom: "16px" }}>
            {PIPELINE_STEPS.map((s, i) => (
              <div
                key={s.step}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "12px",
                  marginBottom: "8px",
                  padding: "10px 12px",
                  background: "rgba(0,0,0,0.2)",
                  border: `1px solid ${s.color}18`,
                  borderRadius: "4px",
                }}
              >
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    background: `${s.color}18`,
                    border: `1px solid ${s.color}55`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontSize: "9px",
                      fontFamily: "Orbitron, sans-serif",
                      fontWeight: 700,
                      color: s.color,
                    }}
                  >
                    {s.step}
                  </span>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "9px",
                      fontFamily: "Orbitron, sans-serif",
                      color: s.color,
                      letterSpacing: "0.08em",
                      marginBottom: "3px",
                    }}
                  >
                    {s.label}
                  </div>
                  <div
                    style={{
                      fontSize: "9px",
                      color: "#9AA9BA",
                      lineHeight: 1.5,
                    }}
                  >
                    {s.detail}
                  </div>
                </div>
                {i < PIPELINE_STEPS.length - 1 && (
                  <div
                    style={{
                      marginLeft: "auto",
                      color: "#4A5568",
                      fontSize: "10px",
                      alignSelf: "center",
                    }}
                  >
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
          <InfoBlock
            label="KEY ARCHITECTURAL PROPERTY"
            value={
              <>
                The human decision was made <em>before</em> the emergency. The
                hash is the authorization. No unsigned action ever executes —
                enforced at the cryptographic layer, not by policy or trust.
              </>
            }
            color="#28E7B7"
          />
        </Section>

        {/* ════ 05 · 17-CANISTER MESH ════ */}
        <Section
          title="05 · THE 17-NODE CANISTER MESH — LIVE ON ICP MAINNET"
          accentColor="#29D6FF"
        >
          <p
            style={{
              fontSize: "10px",
              color: "#9AA9BA",
              lineHeight: 1.7,
              marginBottom: "12px",
            }}
          >
            Each canister is an autonomous software agent — it maintains
            persistent state, responds to conditions without human trigger,
            self-funds via the cycle management pipeline, and logs its own
            history immutably. All 17 are deployed on ICP mainnet under a single
            verified controller principal.
          </p>
          <InfoBlock
            label="CONTROLLER PRINCIPAL — PUBLICLY VERIFIABLE (NO WALLET REQUIRED)"
            value={VERIFIED_CONTROLLER_PRINCIPAL}
            color="#28E7B7"
          />
          <div
            style={{
              marginTop: "10px",
              border: "1px solid rgba(41,214,255,0.15)",
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1.6fr 2fr 1.4fr",
                padding: "8px 12px",
                background: "rgba(41,214,255,0.08)",
                borderBottom: "1px solid rgba(41,214,255,0.15)",
              }}
            >
              <div
                style={{
                  fontSize: "8px",
                  fontFamily: "Orbitron, sans-serif",
                  color: "#29D6FF",
                  letterSpacing: "0.1em",
                }}
              >
                SCIENTIFIC NAME
              </div>
              <div
                style={{
                  fontSize: "8px",
                  fontFamily: "Orbitron, sans-serif",
                  color: "#28E7B7",
                  letterSpacing: "0.1em",
                }}
              >
                FUNCTION
              </div>
              <div
                style={{
                  fontSize: "8px",
                  fontFamily: "Orbitron, sans-serif",
                  color: "#F6B24A",
                  letterSpacing: "0.1em",
                }}
              >
                CANISTER ID
              </div>
            </div>
            {CANISTER_MAP.map((c, i) => (
              <div
                key={c.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.6fr 2fr 1.4fr",
                  padding: "7px 12px",
                  background:
                    i % 2 === 0 ? "rgba(0,0,0,0.18)" : "rgba(41,214,255,0.02)",
                  borderBottom:
                    i < CANISTER_MAP.length - 1
                      ? "1px solid rgba(41,214,255,0.07)"
                      : "none",
                }}
              >
                <div
                  style={{
                    fontSize: "9px",
                    color: "#E6EEF7",
                    fontFamily: "monospace",
                    paddingRight: "8px",
                  }}
                >
                  {c.scientific}
                </div>
                <div
                  style={{
                    fontSize: "8px",
                    color: "#7A8C99",
                    fontFamily: "monospace",
                    paddingRight: "8px",
                    lineHeight: 1.4,
                  }}
                >
                  {c.role}
                </div>
                <div
                  style={{
                    fontSize: "8px",
                    color: "#29D6FF",
                    fontFamily: "monospace",
                    wordBreak: "break-all",
                  }}
                >
                  {c.id}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ════ 06 · BTM APPLICATION ════ */}
        <Section
          title="06 · BTM ENERGY APPLICATION — DOE BEYOND THE METER PRIZE"
          accentColor="#28E7B7"
        >
          <p
            style={{
              fontSize: "10px",
              color: "#9AA9BA",
              lineHeight: 1.7,
              marginBottom: "12px",
            }}
          >
            The same 17-canister mesh is repurposed as a{" "}
            <strong style={{ color: "#28E7B7" }}>
              sovereign BTM coordination layer
            </strong>{" "}
            for the DOE Office of Electricity's Beyond the Meter: Energy Storage
            Integration Prize. SROS enables co-optimal management of
            behind-the-meter energy storage assets across any vendor ecosystem —
            with zero data extraction, opt-in participation, and pre-approved
            autonomous dispatch.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
              marginBottom: "14px",
            }}
          >
            <div
              style={{
                padding: "12px",
                background: "rgba(40,231,183,0.06)",
                border: "1px solid rgba(40,231,183,0.2)",
                borderRadius: "4px",
              }}
            >
              <div
                style={{
                  fontSize: "8px",
                  fontFamily: "Orbitron, sans-serif",
                  color: "#28E7B7",
                  letterSpacing: "0.1em",
                  marginBottom: "8px",
                }}
              >
                PRIZE TRACK
              </div>
              <div
                style={{
                  fontSize: "10px",
                  color: "#E6EEF7",
                  fontFamily: "monospace",
                }}
              >
                Commercial / Industrial Solution Track
              </div>
              <div
                style={{
                  fontSize: "8px",
                  color: "#4A5568",
                  fontFamily: "monospace",
                  marginTop: "4px",
                }}
              >
                HeroX / DOE Office of Electricity
              </div>
            </div>
            <div
              style={{
                padding: "12px",
                background: "rgba(246,178,74,0.06)",
                border: "1px solid rgba(246,178,74,0.2)",
                borderRadius: "4px",
              }}
            >
              <div
                style={{
                  fontSize: "8px",
                  fontFamily: "Orbitron, sans-serif",
                  color: "#F6B24A",
                  letterSpacing: "0.1em",
                  marginBottom: "8px",
                }}
              >
                PHASE 2 COALITION TARGET
              </div>
              <div
                style={{
                  fontSize: "10px",
                  color: "#E6EEF7",
                  fontFamily: "monospace",
                }}
              >
                Stem Inc. or Schneider Electric
              </div>
              <div
                style={{
                  fontSize: "8px",
                  color: "#4A5568",
                  fontFamily: "monospace",
                  marginTop: "4px",
                }}
              >
                BTM hardware ecosystem partner
              </div>
            </div>
          </div>

          <div style={{ marginBottom: "12px" }}>
            <div
              style={{
                fontSize: "9px",
                fontFamily: "Orbitron, sans-serif",
                color: "#29D6FF",
                letterSpacing: "0.12em",
                marginBottom: "8px",
              }}
            >
              PRE-APPROVED ACTION REGISTRY — LIVE DEMO
            </div>
            <p
              style={{
                fontSize: "9px",
                color: "#7A8C99",
                lineHeight: 1.6,
                marginBottom: "8px",
              }}
            >
              The following grid conditions are pre-hashed and sealed on-chain.
              When a synthetic trigger fires (via the BTM COORDINATION tab at
              the live URL above), the system walks through Detection → Hash
              Validation → Unseal Event in real time — without manual
              intervention.
            </p>
            <div
              style={{
                border: "1px solid rgba(41,214,255,0.15)",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.4fr 1.6fr 2fr 1fr",
                  padding: "7px 10px",
                  background: "rgba(41,214,255,0.08)",
                  borderBottom: "1px solid rgba(41,214,255,0.12)",
                }}
              >
                {["CONDITION", "TRIGGER", "OPTIMAL RESPONSE", "HASH"].map(
                  (h) => (
                    <div
                      key={h}
                      style={{
                        fontSize: "7px",
                        fontFamily: "Orbitron, sans-serif",
                        color: "#29D6FF",
                        letterSpacing: "0.1em",
                      }}
                    >
                      {h}
                    </div>
                  ),
                )}
              </div>
              {BTM_REGISTRY.map((r, i) => (
                <div
                  key={r.condition}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.4fr 1.6fr 2fr 1fr",
                    padding: "7px 10px",
                    background:
                      i % 2 === 0
                        ? "rgba(0,0,0,0.15)"
                        : "rgba(41,214,255,0.02)",
                    borderBottom:
                      i < BTM_REGISTRY.length - 1
                        ? "1px solid rgba(41,214,255,0.07)"
                        : "none",
                  }}
                >
                  <div
                    style={{
                      fontSize: "8px",
                      color: "#E6EEF7",
                      fontFamily: "monospace",
                    }}
                  >
                    {r.condition}
                  </div>
                  <div
                    style={{
                      fontSize: "8px",
                      color: "#7A8C99",
                      fontFamily: "monospace",
                      paddingRight: "8px",
                    }}
                  >
                    {r.trigger}
                  </div>
                  <div
                    style={{
                      fontSize: "8px",
                      color: "#9AA9BA",
                      fontFamily: "monospace",
                      paddingRight: "8px",
                    }}
                  >
                    {r.response}
                  </div>
                  <div
                    style={{
                      fontSize: "8px",
                      color: "#28E7B7",
                      fontFamily: "monospace",
                    }}
                  >
                    {r.hash}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* ════ 07 · WHO BUILT IT ════ */}
        <Section
          title="07 · WHO BUILT IT — THE HUMAN-AI SYNTHESIS METHOD"
          accentColor="#F6B24A"
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              marginBottom: "14px",
            }}
          >
            <div
              style={{
                padding: "14px",
                background: "rgba(246,178,74,0.06)",
                border: "1px solid rgba(246,178,74,0.2)",
                borderRadius: "4px",
              }}
            >
              <div
                style={{
                  fontSize: "9px",
                  fontFamily: "Orbitron, sans-serif",
                  color: "#F6B24A",
                  letterSpacing: "0.1em",
                  marginBottom: "8px",
                }}
              >
                ARCHITECT
              </div>
              <div
                style={{
                  fontSize: "13px",
                  fontFamily: "Orbitron, sans-serif",
                  color: "#E6EEF7",
                  fontWeight: 700,
                  marginBottom: "4px",
                }}
              >
                Sophors
              </div>
              <div
                style={{ fontSize: "9px", color: "#9AA9BA", lineHeight: 1.6 }}
              >
                Principal Systems Practitioner · Self-taught · No traditional CS
                background
              </div>
              <div
                style={{
                  marginTop: "10px",
                  fontSize: "8px",
                  color: "#4A5568",
                  fontFamily: "monospace",
                  fontStyle: "italic",
                }}
              >
                "4 months total. ~23 days of terminal experience before
                delegating execution to AI."
              </div>
            </div>
            <div
              style={{
                padding: "14px",
                background: "rgba(41,214,255,0.05)",
                border: "1px solid rgba(41,214,255,0.15)",
                borderRadius: "4px",
              }}
            >
              <div
                style={{
                  fontSize: "9px",
                  fontFamily: "Orbitron, sans-serif",
                  color: "#29D6FF",
                  letterSpacing: "0.1em",
                  marginBottom: "8px",
                }}
              >
                INFRASTRUCTURE
              </div>
              <div
                style={{
                  fontSize: "11px",
                  fontFamily: "Orbitron, sans-serif",
                  color: "#29D6FF",
                  fontWeight: 700,
                  marginBottom: "4px",
                }}
              >
                17-NODE SOVEREIGN MESH
              </div>
              <div
                style={{ fontSize: "9px", color: "#9AA9BA", lineHeight: 1.6 }}
              >
                Rust canisters · ICP Mainnet · Deployed via dfx terminal · No
                managed cloud services
              </div>
              <div
                style={{
                  marginTop: "10px",
                  fontSize: "8px",
                  color: "#4A5568",
                  fontFamily: "monospace",
                  fontStyle: "italic",
                }}
              >
                All backend logic coded and deployed by architect directly.
                Frontend via Caffeine AI.
              </div>
            </div>
          </div>

          <p
            style={{
              fontSize: "10px",
              color: "#C5D4E3",
              lineHeight: 1.8,
              marginBottom: "12px",
            }}
          >
            SROS was not built by a team of engineers. It was built by one
            person using a{" "}
            <strong style={{ color: "#F6B24A" }}>
              Human-AI Mirror methodology
            </strong>{" "}
            — a coordination pattern where the human provides symbolic
            architecture, domain logic, and conducting instincts, while AI
            serves as the translation and execution layer that converts that
            intent into deployed, running code.
          </p>

          <div style={{ marginBottom: "14px" }}>
            <div
              style={{
                fontSize: "9px",
                fontFamily: "Orbitron, sans-serif",
                color: "#F6B24A",
                letterSpacing: "0.12em",
                marginBottom: "10px",
              }}
            >
              THE METHODOLOGY — HOW A SINGLE HUMAN BUILT A 17-NODE SOVEREIGN
              STACK
            </div>
            {[
              {
                phase: "SYMBOLIC ARCHITECTURE",
                human:
                  "Architect defines the system's intent, thermodynamic metaphors, and behavioral logic in natural language — e.g. 'the mesh should validate every payload before dispatch, and the attacker should pay the cost of the attack'",
                ai: "AI translates symbolic intent into formal computer science equivalents: payload integrity enforcement, adversarial cycle inversion (DRE), pre-approved action registries",
                color: "#29D6FF",
              },
              {
                phase: "CONDUCTING INSTINCT",
                human:
                  "Architect recognizes when a subsystem is architecturally complete vs. when it needs refinement — the same skill a conductor uses to hear when an orchestra section is off, without playing every instrument",
                ai: "AI executes the identified refinements, generates code, wires components, and validates logic — without the architect needing to know every syntax detail",
                color: "#28E7B7",
              },
              {
                phase: "TERMINAL SOVEREIGNTY",
                human:
                  "Architect retains full control of all Rust canister deployments via dfx terminal — ensuring that no AI system can deploy to mainnet without explicit human authorization",
                ai: "AI assists with Rust code generation, error resolution, and deployment script construction — but the dfx deploy command always runs under the human controller principal",
                color: "#F6B24A",
              },
              {
                phase: "AUDIT LOOP",
                human:
                  "Architect reviews every deployed component for factual accuracy — identifying simulation artifacts, mislabeled live vs. simulated data, and symbolic terminology that needs scientific translation",
                ai: "AI implements every correction, maintains the audit trail of changes, and ensures the final system is audit-honest and submission-ready",
                color: "#FF4B5C",
              },
            ].map((item) => (
              <div
                key={item.phase}
                style={{
                  marginBottom: "8px",
                  padding: "12px",
                  background: "rgba(0,0,0,0.2)",
                  border: `1px solid ${item.color}18`,
                  borderLeft: `3px solid ${item.color}`,
                  borderRadius: "4px",
                }}
              >
                <div
                  style={{
                    fontSize: "8px",
                    fontFamily: "Orbitron, sans-serif",
                    color: item.color,
                    letterSpacing: "0.1em",
                    marginBottom: "8px",
                  }}
                >
                  {item.phase}
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "10px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "7px",
                        color: "#4A5568",
                        fontFamily: "Orbitron, sans-serif",
                        letterSpacing: "0.08em",
                        marginBottom: "4px",
                      }}
                    >
                      HUMAN
                    </div>
                    <div
                      style={{
                        fontSize: "9px",
                        color: "#9AA9BA",
                        lineHeight: 1.6,
                      }}
                    >
                      {item.human}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "7px",
                        color: "#4A5568",
                        fontFamily: "Orbitron, sans-serif",
                        letterSpacing: "0.08em",
                        marginBottom: "4px",
                      }}
                    >
                      AI
                    </div>
                    <div
                      style={{
                        fontSize: "9px",
                        color: "#9AA9BA",
                        lineHeight: 1.6,
                      }}
                    >
                      {item.ai}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <InfoBlock
            label="WHY THIS MATTERS FOR THE DOE SUBMISSION"
            value="SROS demonstrates that the Human-AI Mirror methodology can produce deployable, verifiable, sovereign infrastructure that competes with team-built systems — at a fraction of the cost and time. This is not just a product submission; it is a proof that the next generation of critical infrastructure can be built by workers who understand the problem, not just engineers who understand the tools."
            color="#F6B24A"
          />
        </Section>

        {/* ════ 08 · HOW IT SOLVES THE PROBLEM ════ */}
        <Section title="08 · HOW SROS SOLVES THE PROBLEM" accentColor="#28E7B7">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              marginBottom: "14px",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "9px",
                  fontFamily: "Orbitron, sans-serif",
                  color: "#FF4B5C",
                  letterSpacing: "0.1em",
                  marginBottom: "8px",
                }}
              >
                BEFORE SROS
              </div>
              {[
                "Single-hull security — one breach = total failure",
                "Vendor lock-in required for BTM coordination",
                "Data extracted to cloud intermediaries",
                "Human operator required for every remediation",
                "Infrastructure must be replaced to upgrade capability",
                "Subscription fees on every dispatched action",
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    gap: "8px",
                    marginBottom: "5px",
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    style={{
                      color: "#FF4B5C",
                      fontSize: "10px",
                      flexShrink: 0,
                    }}
                  >
                    ✗
                  </span>
                  <span
                    style={{
                      fontSize: "9px",
                      color: "#7A8C99",
                      lineHeight: 1.5,
                    }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
            <div>
              <div
                style={{
                  fontSize: "9px",
                  fontFamily: "Orbitron, sans-serif",
                  color: "#28E7B7",
                  letterSpacing: "0.1em",
                  marginBottom: "8px",
                }}
              >
                AFTER SROS
              </div>
              {[
                "Defense-in-depth overlay — breach layer 2 first, layer 1 intact",
                "Vendor-agnostic coordination — any hardware, no contracts",
                "On-chain audit trail — operator owns all data",
                "Autonomous remediation — pre-approved hash fires without human",
                "Non-invasive overlay — underlying infrastructure never modified",
                "Zero extraction model — licensed as protocol, not subscription",
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    gap: "8px",
                    marginBottom: "5px",
                    alignItems: "flex-start",
                  }}
                >
                  <span
                    style={{
                      color: "#28E7B7",
                      fontSize: "10px",
                      flexShrink: 0,
                    }}
                  >
                    ✓
                  </span>
                  <span
                    style={{
                      fontSize: "9px",
                      color: "#C5D4E3",
                      lineHeight: 1.5,
                    }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              padding: "14px",
              background: "rgba(40,231,183,0.06)",
              border: "1px solid rgba(40,231,183,0.2)",
              borderRadius: "4px",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                fontSize: "9px",
                fontFamily: "Orbitron, sans-serif",
                color: "#28E7B7",
                letterSpacing: "0.1em",
                marginBottom: "8px",
              }}
            >
              LIVE PROOF — ALREADY RUNNING BEFORE PHASE 1 SCORING
            </div>
            <p
              style={{
                fontSize: "10px",
                color: "#9AA9BA",
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              Unlike most Phase 1 submissions, SROS is not a concept deck. The
              17-node mesh is deployed on ICP mainnet, the autonomous cycle
              top-up has been confirmed live (canisters received real cycle
              transfers), the synthetic trigger pipeline calls real on-chain
              methods with a 3-step verification checklist (Detection, Integrity
              Check, Unseal Event), and the controller principal is publicly
              verifiable by anyone with a browser. DOE reviewers can query the
              system independently — no demo required, no trust assumed.
            </p>
          </div>
        </Section>

        {/* ════ 09 · LIVE VERIFICATION ════ */}
        <Section
          title="09 · LIVE VERIFICATION — HOW TO INSPECT THE SYSTEM"
          accentColor="#29D6FF"
        >
          <p
            style={{
              fontSize: "10px",
              color: "#9AA9BA",
              lineHeight: 1.7,
              marginBottom: "12px",
            }}
          >
            Every claim in this whitepaper is verifiable on-chain without a
            wallet, without login, and without contacting the architect. The
            following instructions allow any reviewer to independently confirm
            the system is live.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
              marginBottom: "12px",
            }}
          >
            {[
              {
                method: "BROWSER — LIVE DASHBOARD",
                instruction: LIVE_URL,
                detail:
                  "Open in any browser. No wallet, no login. Navigate to RAW TELEMETRY tab to see live on-chain responses. Navigate to BTM COORDINATION tab to trigger the live verification pipeline.",
                color: "#29D6FF",
              },
              {
                method: "CANDID INTERFACE — NAGA SHIELD",
                instruction:
                  "https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.icp0.io/?id=f2hno-jaaaa-aaaaa-qgypa-cai",
                detail:
                  "Query get_current_status() to see real-time mesh state. Call force_condition('BROWNOUT') to trigger the live pipeline. Hash returned by the canister matches the sealed registry.",
                color: "#28E7B7",
              },
              {
                method: "CANDID INTERFACE — SOVEREIGN SIGNER",
                instruction:
                  "https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.icp0.io/?id=43d7d-raaaa-aaaaa-qgw6a-cai",
                detail:
                  "Query get_public_key() to confirm the root neuron authorization node is live. This is the cryptographic gatekeeper — no action dispatches without its validation.",
                color: "#F6B24A",
              },
              {
                method: "ICP DASHBOARD — CONTROLLER VERIFICATION",
                instruction:
                  "https://dashboard.internetcomputer.org/canister/f2hno-jaaaa-aaaaa-qgypa-cai",
                detail: `Confirm controller principal: ${VERIFIED_CONTROLLER_PRINCIPAL.slice(0, 30)}... — same principal controls all 17 canisters, verifiable independently for each.`,
                color: "#29D6FF",
              },
            ].map((item) => (
              <div
                key={item.method}
                style={{
                  padding: "12px",
                  background: "rgba(0,0,0,0.25)",
                  border: `1px solid ${item.color}22`,
                  borderRadius: "4px",
                }}
              >
                <div
                  style={{
                    fontSize: "8px",
                    fontFamily: "Orbitron, sans-serif",
                    color: item.color,
                    letterSpacing: "0.1em",
                    marginBottom: "6px",
                  }}
                >
                  {item.method}
                </div>
                <div
                  style={{
                    fontSize: "8px",
                    color: item.color,
                    fontFamily: "monospace",
                    wordBreak: "break-all",
                    marginBottom: "6px",
                  }}
                >
                  {item.instruction}
                </div>
                <div
                  style={{ fontSize: "8px", color: "#7A8C99", lineHeight: 1.5 }}
                >
                  {item.detail}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ════ 10 · SUBMISSION ════ */}
        <Section title="10 · SUBMISSION INFORMATION" accentColor="#F6B24A">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "10px",
              marginBottom: "14px",
            }}
          >
            {[
              {
                label: "PHASE 1 PRIZE",
                value: "$250,000",
                sub: "$50K cash + $200K peer review",
                color: "#28E7B7",
              },
              {
                label: "PHASE 2 PRIZE",
                value: "$950,000",
                sub: "+ $100K DOE lab voucher",
                color: "#29D6FF",
              },
              {
                label: "DEADLINE",
                value: SUBMISSION_DATE,
                sub: "Phase 1 · Written introduction",
                color: "#F6B24A",
              },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  padding: "14px",
                  background: "rgba(0,0,0,0.25)",
                  border: `1px solid ${item.color}22`,
                  borderRadius: "4px",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: "8px",
                    fontFamily: "Orbitron, sans-serif",
                    color: "#4A5568",
                    letterSpacing: "0.1em",
                    marginBottom: "6px",
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    fontSize: "16px",
                    fontFamily: "Orbitron, sans-serif",
                    fontWeight: 700,
                    color: item.color,
                    marginBottom: "4px",
                  }}
                >
                  {item.value}
                </div>
                <div
                  style={{
                    fontSize: "8px",
                    color: "#6F8196",
                    fontFamily: "monospace",
                  }}
                >
                  {item.sub}
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
            }}
          >
            <InfoBlock
              label="PRIZE PAGE"
              value={
                <a
                  href="https://www.herox.com/beyondthemeter"
                  style={{ color: "#29D6FF", fontFamily: "monospace" }}
                >
                  https://www.herox.com/beyondthemeter
                </a>
              }
            />
            <InfoBlock
              label="LIVE SYSTEM"
              value={
                <a
                  href={LIVE_URL}
                  style={{ color: "#28E7B7", fontFamily: "monospace" }}
                >
                  {LIVE_URL}
                </a>
              }
            />
          </div>
        </Section>

        {/* ════ FOOTER ════ */}
        <div
          style={{
            marginTop: "40px",
            paddingTop: "20px",
            borderTop: "1px solid rgba(41,214,255,0.15)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "11px",
                fontFamily: "Orbitron, sans-serif",
                color: "#29D6FF",
                fontWeight: 700,
                marginBottom: "4px",
              }}
            >
              SROS — SOVEREIGN RESONANT OPERATING SYSTEM
            </div>
            <div
              style={{
                fontSize: "8px",
                color: "#4A5568",
                fontFamily: "monospace",
              }}
            >
              Architect: Sophors · Controller:{" "}
              {VERIFIED_CONTROLLER_PRINCIPAL.slice(0, 24)}...
            </div>
            <div
              style={{
                fontSize: "8px",
                color: "#4A5568",
                fontFamily: "monospace",
                marginTop: "2px",
              }}
            >
              Generated: {PRINT_DATE} · {LIVE_URL}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: "8px",
                color: "#4A5568",
                fontFamily: "monospace",
                fontStyle: "italic",
              }}
            >
              All claims verifiable on ICP mainnet.
            </div>
            <div
              style={{
                fontSize: "8px",
                color: "#4A5568",
                fontFamily: "monospace",
                fontStyle: "italic",
              }}
            >
              No wallet required. No login. No trust assumed.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

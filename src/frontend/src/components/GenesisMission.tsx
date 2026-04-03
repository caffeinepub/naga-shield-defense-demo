import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  FileDown,
  Radio,
  Shield,
} from "lucide-react";
import { useState } from "react";
import type { LiveCanisterData } from "../hooks/useLiveCanisters";
import { VERIFIED_CONTROLLER_PRINCIPAL } from "../lib/canisters";

interface Objective {
  id: string;
  label: string;
  status: string;
  statusColor: string;
}

const OBJECTIVES: Objective[] = [
  {
    id: "obj-overlay",
    label: "Non-invasive canister-level security overlay deployed",
    status: "VERIFIED",
    statusColor: "#28E7B7",
  },
  {
    id: "obj-dre",
    label: "Deceptive resource exhaustion (DRE) trap system active",
    status: "OPERATIONAL",
    statusColor: "#29D6FF",
  },
  {
    id: "obj-integrity",
    label: "Distributed ledger network integrity confirmed",
    status: "VALIDATED",
    statusColor: "#28E7B7",
  },
  {
    id: "obj-mesh",
    label: "Protocol-layer enforcement mesh enabled",
    status: "NOMINAL",
    statusColor: "#29D6FF",
  },
  {
    id: "obj-auth",
    label: "NNS principal authentication and access control confirmed",
    status: "AUTHORIZED",
    statusColor: "#28E7B7",
  },
  {
    id: "obj-cluster",
    label: "17-node ICP canister cluster under active monitoring",
    status: "LIVE",
    statusColor: "#29D6FF",
  },
];

const BTM_SOLUTION_MAP = [
  {
    capability: "Non-Invasive Layer 2 Overlay",
    subtitle: undefined as string | undefined,
    requirement: "No infrastructure replacement required",
  },
  {
    capability: "Zero Extraction Model",
    subtitle: undefined as string | undefined,
    requirement: "Eliminates vendor middleware transaction costs",
  },
  {
    capability: "Adaptive AI Core \u2014 Equilibrium Loop",
    subtitle: "(Feedback Control Loop)",
    requirement: "Co-optimal BTM asset management in real time",
  },
  {
    capability: "Sovereign Ledger (On-Chain Audit Trail)",
    subtitle: undefined as string | undefined,
    requirement: "Immutable, tamper-proof transaction record",
  },
  {
    capability: "Opt-In / Opt-Out Architecture",
    subtitle: undefined as string | undefined,
    requirement: "Consumer control and demand response participation",
  },
];

interface GenesisMissionProps {
  sovereignMetrics?: string | null;
  isControllerAuthenticated?: boolean;
  sovereignSignerKey?: LiveCanisterData["sovereignSignerKey"];
}

/** Small formal-term subtitle rendered below a heading */
function FormalSubtitle({ text }: { text: string }) {
  return (
    <div
      style={{
        fontSize: "9px",
        color: "#4A5568",
        fontFamily: "monospace",
        fontStyle: "italic",
        marginTop: "1px",
        letterSpacing: "0.04em",
      }}
    >
      {text}
    </div>
  );
}

/** Architecture term card with name, formal subtitle, and description */
function TermCard({
  name,
  subtitle,
  description,
  color,
}: {
  name: string;
  subtitle: string;
  description: string;
  color: string;
}) {
  return (
    <div
      className="p-2 rounded"
      style={{
        background: "rgba(0,0,0,0.2)",
        border: "1px solid rgba(60,150,190,0.15)",
      }}
    >
      <div
        className="font-orbitron font-bold"
        style={{ fontSize: "9px", letterSpacing: "0.08em", color }}
      >
        {name}
      </div>
      <FormalSubtitle text={subtitle} />
      <div
        className="text-naga-muted mt-1"
        style={{ fontSize: "8px", lineHeight: 1.4 }}
      >
        {description}
      </div>
    </div>
  );
}

export function GenesisMission({
  sovereignMetrics,
  isControllerAuthenticated = false,
}: GenesisMissionProps = {}) {
  const [btmExpanded, setBtmExpanded] = useState(true);

  const printDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleExport = () => {
    window.print();
  };

  return (
    <div
      className="print-target card-hud p-5 h-full"
      data-print-date={printDate}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 mb-4 pb-3"
        style={{ borderBottom: "1px solid rgba(60,150,190,0.2)" }}
      >
        <div
          className="flex items-center justify-center rounded"
          style={{
            width: "36px",
            height: "36px",
            background: "rgba(41,214,255,0.1)",
            border: "1px solid rgba(41,214,255,0.3)",
          }}
        >
          <Shield size={18} style={{ color: "#29D6FF" }} />
        </div>
        <div>
          <div
            className="font-orbitron font-bold text-naga-cyan"
            style={{ fontSize: "13px", letterSpacing: "0.12em" }}
          >
            DISTRIBUTED SECURITY ARCHITECTURE
          </div>
          <div className="text-naga-muted" style={{ fontSize: "9px" }}>
            INTERNET COMPUTER PROTOCOL \u2014 LAYER 2 ENFORCEMENT FRAMEWORK
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {/* PDF Export button */}
          <button
            type="button"
            data-ocid="genesis.export_pdf.button"
            onClick={handleExport}
            className="print-hide flex items-center gap-1.5 px-3 py-1.5 rounded font-orbitron"
            style={{
              fontSize: "9px",
              letterSpacing: "0.1em",
              background: "rgba(5,12,20,0.8)",
              border: "1px solid rgba(41,214,255,0.4)",
              color: "#29D6FF",
              cursor: "pointer",
              transition: "background 0.2s, border-color 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(41,214,255,0.1)";
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "rgba(41,214,255,0.7)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(5,12,20,0.8)";
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "rgba(41,214,255,0.4)";
            }}
          >
            <FileDown size={10} />
            <span>[ EXPORT PDF ]</span>
          </button>
          <div
            className="flex items-center gap-1.5 px-3 py-1 rounded-full"
            style={{
              background: "rgba(40,231,183,0.1)",
              border: "1px solid rgba(40,231,183,0.3)",
            }}
          >
            <div className="status-dot status-dot-green" />
            <span
              className="font-orbitron text-naga-green"
              style={{ fontSize: "9px", letterSpacing: "0.1em" }}
            >
              ACTIVE
            </span>
          </div>
        </div>
      </div>

      {/* Security objectives */}
      <div className="mb-4">
        <div
          className="font-orbitron text-naga-muted mb-2"
          style={{ fontSize: "9px", letterSpacing: "0.15em" }}
        >
          SECURITY OBJECTIVES
        </div>
        <div className="space-y-2">
          {OBJECTIVES.map((obj, idx) => (
            <div
              key={obj.id}
              data-ocid={`poc.item.${idx + 1}`}
              className="flex items-center justify-between py-2 px-3 rounded"
              style={{
                background: "rgba(0,0,0,0.2)",
                border: "1px solid rgba(60,150,190,0.15)",
              }}
            >
              <div className="flex items-center gap-2">
                <CheckCircle
                  size={12}
                  style={{ color: obj.statusColor, flexShrink: 0 }}
                />
                <span style={{ fontSize: "11px", color: "#E6EEF7" }}>
                  {obj.label}
                </span>
              </div>
              <span
                className="font-orbitron font-bold"
                style={{
                  fontSize: "9px",
                  color: obj.statusColor,
                  letterSpacing: "0.1em",
                  whiteSpace: "nowrap",
                }}
              >
                {obj.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Classification & submission status */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div
          className="p-3 rounded"
          style={{
            background: "rgba(41,214,255,0.06)",
            border: "1px solid rgba(41,214,255,0.2)",
          }}
        >
          <div className="text-naga-muted mb-1" style={{ fontSize: "8px" }}>
            CLASSIFICATION
          </div>
          <div
            className="font-orbitron font-bold text-naga-cyan"
            style={{ fontSize: "11px", letterSpacing: "0.1em" }}
          >
            RESTRICTED
          </div>
        </div>
        <div
          className="p-3 rounded"
          style={{
            background: "rgba(40,231,183,0.06)",
            border: "1px solid rgba(40,231,183,0.2)",
          }}
        >
          <div className="text-naga-muted mb-1" style={{ fontSize: "8px" }}>
            SUBMISSION STATUS
          </div>
          <div
            className="font-orbitron font-bold text-naga-green"
            style={{ fontSize: "11px", letterSpacing: "0.1em" }}
          >
            PROOF OF CONCEPT
          </div>
        </div>
      </div>

      {/* Architect Identity \u2014 public on-chain verification (no wallet required) */}
      <div
        className="p-3 rounded mb-4"
        style={{
          background: isControllerAuthenticated
            ? "rgba(40,231,183,0.06)"
            : "rgba(246,178,74,0.06)",
          border: `1px solid ${
            isControllerAuthenticated
              ? "rgba(40,231,183,0.4)"
              : "rgba(246,178,74,0.3)"
          }`,
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Radio size={10} style={{ color: "#29D6FF" }} />
            <span
              className="font-orbitron text-naga-muted"
              style={{ fontSize: "8px", letterSpacing: "0.1em" }}
            >
              ARCHITECT IDENTITY
            </span>
          </div>
          <span
            className="font-orbitron font-bold px-1.5 py-0.5 rounded"
            style={{
              fontSize: "7px",
              letterSpacing: "0.08em",
              color: isControllerAuthenticated ? "#28E7B7" : "#F6B24A",
              background: isControllerAuthenticated
                ? "rgba(40,231,183,0.12)"
                : "rgba(246,178,74,0.12)",
              border: `1px solid ${
                isControllerAuthenticated
                  ? "rgba(40,231,183,0.3)"
                  : "rgba(246,178,74,0.3)"
              }`,
            }}
          >
            {isControllerAuthenticated
              ? "VERIFIED ON-CHAIN (Sovereign Principal)"
              : "QUERYING ON-CHAIN..."}
          </span>
        </div>
        {isControllerAuthenticated && (
          <div
            className="font-orbitron mb-1"
            style={{
              fontSize: "9px",
              color: "#28E7B7",
              letterSpacing: "0.06em",
            }}
          >
            ARCHITECT IDENTITY: VERIFIED ON-CHAIN
          </div>
        )}
        <span
          style={{
            fontFamily: "monospace",
            fontSize: "10px",
            color: "#E6EEF7",
            wordBreak: "break-all",
          }}
        >
          {VERIFIED_CONTROLLER_PRINCIPAL}
        </span>
        <div
          style={{
            fontFamily: "monospace",
            fontSize: "8px",
            color: "#4A5568",
            marginTop: "4px",
          }}
        >
          Verified via sovereign_signer (43d7d\u2026) \u2014 no wallet required
        </div>
      </div>

      {/* Canister Cluster summary */}
      <div
        className="p-3 rounded mb-4"
        style={{
          background: "rgba(41,214,255,0.04)",
          border: "1px solid rgba(41,214,255,0.18)",
        }}
      >
        <div
          className="font-orbitron text-naga-muted mb-2"
          style={{ fontSize: "8px", letterSpacing: "0.15em" }}
        >
          CANISTER CLUSTER
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center">
            <div
              className="font-orbitron font-bold text-naga-cyan"
              style={{ fontSize: "16px" }}
            >
              17
            </div>
            <div className="text-naga-muted" style={{ fontSize: "8px" }}>
              TOTAL NODES
            </div>
          </div>
          <div className="text-center">
            <div
              className="font-orbitron font-bold text-naga-green"
              style={{ fontSize: "16px" }}
            >
              17
            </div>
            <div className="text-naga-muted" style={{ fontSize: "8px" }}>
              LIVE-POLLED
            </div>
          </div>
          <div className="text-center">
            <div
              className="font-orbitron font-bold"
              style={{ fontSize: "10px", color: "#F6B24A", paddingTop: "3px" }}
            >
              ICP MAINNET
            </div>
            <div className="text-naga-muted" style={{ fontSize: "8px" }}>
              PROTOCOL
            </div>
          </div>
        </div>
      </div>

      {/* Core Metrics Telemetry */}
      {sovereignMetrics && (
        <div
          className="p-3 rounded mb-4"
          style={{
            background: "rgba(40,231,183,0.04)",
            border: "1px solid rgba(40,231,183,0.2)",
          }}
        >
          <div
            className="font-orbitron text-naga-muted mb-2"
            style={{ fontSize: "8px", letterSpacing: "0.12em" }}
          >
            CORE METRICS TELEMETRY
          </div>
          <pre
            style={{
              fontFamily: "monospace",
              fontSize: "9px",
              color: "#28E7B7",
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            {sovereignMetrics}
          </pre>
        </div>
      )}

      {/* SROS Executive Summary */}
      <div
        className="p-4 rounded mb-4"
        style={{
          background: "rgba(0,0,0,0.25)",
          border: "1px solid rgba(41,214,255,0.2)",
        }}
      >
        <div
          className="font-orbitron text-naga-cyan mb-3"
          style={{ fontSize: "9px", letterSpacing: "0.15em" }}
        >
          SROS LAYER 2 SECURITY MESH \u2014 EXECUTIVE SUMMARY
        </div>

        {/* Architect / Infra row */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div
            className="p-2 rounded"
            style={{
              background: "rgba(41,214,255,0.05)",
              border: "1px solid rgba(41,214,255,0.15)",
            }}
          >
            <div
              className="text-naga-muted mb-0.5"
              style={{
                fontSize: "7px",
                fontFamily: "Orbitron, sans-serif",
                letterSpacing: "0.1em",
              }}
            >
              ARCHITECT
            </div>
            <div style={{ fontSize: "10px", color: "#E6EEF7" }}>Sophors</div>
            <div className="text-naga-muted" style={{ fontSize: "8px" }}>
              Principal Systems Practitioner
            </div>
          </div>
          <div
            className="p-2 rounded"
            style={{
              background: "rgba(41,214,255,0.05)",
              border: "1px solid rgba(41,214,255,0.15)",
            }}
          >
            <div
              className="text-naga-muted mb-0.5"
              style={{
                fontSize: "7px",
                fontFamily: "Orbitron, sans-serif",
                letterSpacing: "0.1em",
              }}
            >
              INFRASTRUCTURE
            </div>
            <div
              className="font-orbitron font-bold text-naga-cyan"
              style={{ fontSize: "11px" }}
            >
              17-NODE MESH
            </div>
            <div className="text-naga-muted" style={{ fontSize: "8px" }}>
              ICP Mainnet \u00b7 Distributed
            </div>
          </div>
        </div>

        {/* Mission */}
        <div
          className="mb-3 p-2 rounded"
          style={{
            background: "rgba(40,231,183,0.05)",
            border: "1px solid rgba(40,231,183,0.15)",
          }}
        >
          <div
            className="text-naga-muted mb-1"
            style={{
              fontSize: "7px",
              fontFamily: "Orbitron, sans-serif",
              letterSpacing: "0.1em",
            }}
          >
            MISSION
          </div>
          <div style={{ fontSize: "10px", color: "#28E7B7", lineHeight: 1.5 }}>
            Critical Infrastructure Protection &amp; Sovereign Resilience
          </div>
        </div>

        {/* Core Problem */}
        <div
          className="mb-2"
          style={{ fontSize: "9px", color: "#9AA9BA", lineHeight: 1.6 }}
        >
          <span
            className="font-orbitron"
            style={{
              fontSize: "8px",
              color: "#29D6FF",
              letterSpacing: "0.08em",
            }}
          >
            THE PROBLEM:{" "}
          </span>
          Traditional perimeter defense exposes industrial assets \u2014 power
          grids, shipyard controllers, water systems \u2014 on a single hull
          breach. A single intrusion is not a data leak; it is a physical
          infrastructure failure.
        </div>

        {/* Solution */}
        <div
          className="mb-3"
          style={{ fontSize: "9px", color: "#9AA9BA", lineHeight: 1.6 }}
        >
          <span
            className="font-orbitron"
            style={{
              fontSize: "8px",
              color: "#28E7B7",
              letterSpacing: "0.08em",
            }}
          >
            THE SOLUTION:{" "}
          </span>
          SROS deploys a{" "}
          <span className="text-naga-cyan" style={{ fontWeight: 600 }}>
            Second Hull
          </span>{" "}
          <span
            style={{
              fontSize: "8px",
              color: "#4A5568",
              fontFamily: "monospace",
              fontStyle: "italic",
            }}
          >
            (Defense-in-Depth Architecture)
          </span>{" "}
          overlay \u2014 non-invasive on top of existing infrastructure. Naga
          Shield validates every payload signature. The{" "}
          <span className="text-naga-cyan" style={{ fontWeight: 600 }}>
            DRE
          </span>{" "}
          <span
            style={{
              fontSize: "8px",
              color: "#4A5568",
              fontFamily: "monospace",
              fontStyle: "italic",
            }}
          >
            (Deceptive Resource Exhaustion)
          </span>{" "}
          mechanism engages the{" "}
          <span className="text-naga-amber" style={{ fontWeight: 600 }}>
            Reverse Gas Model
          </span>{" "}
          <span
            style={{
              fontSize: "8px",
              color: "#4A5568",
              fontFamily: "monospace",
              fontStyle: "italic",
            }}
          >
            (Adversarial Cycle Inversion)
          </span>{" "}
          \u2014 redirecting hostile signatures into instrumented honeypots,
          exhausting adversary cycles without touching the primary grid.
        </div>

        {/* Universal Intent */}
        <div
          className="mb-3"
          style={{ fontSize: "9px", color: "#9AA9BA", lineHeight: 1.6 }}
        >
          <span
            className="font-orbitron"
            style={{
              fontSize: "8px",
              color: "#F6B24A",
              letterSpacing: "0.08em",
            }}
          >
            UNIVERSAL INTENT:{" "}
          </span>
          Any nation or industry with aging, vulnerable infrastructure can
          deploy the SROS Mesh for immediate, high-grade cyber-resiliency
          without a total hardware overhaul.
        </div>

        {/* Genesis Mission deadline badge */}
        <div
          className="flex items-center justify-between p-2 rounded"
          style={{
            background: "rgba(246,178,74,0.08)",
            border: "1px solid rgba(246,178,74,0.3)",
          }}
        >
          <div>
            <div
              className="font-orbitron font-bold"
              style={{
                fontSize: "9px",
                color: "#F6B24A",
                letterSpacing: "0.12em",
              }}
            >
              GENESIS MISSION \u2014 APRIL 28, 2026
            </div>
            <div style={{ fontSize: "8px", color: "#9AA9BA" }}>
              DoE Proof of Concept Submission Deadline
            </div>
          </div>
          <div
            className="status-dot"
            style={{ backgroundColor: "#F6B24A", boxShadow: "0 0 8px #F6B24A" }}
          />
        </div>
      </div>

      {/* \u2500\u2500\u2500 ADAPTIVE AI CORE \u2014 ARCHITECTURE TERM GLOSSARY \u2500\u2500\u2500 */}
      <div
        className="p-4 rounded mb-4"
        style={{
          background: "rgba(41,214,255,0.03)",
          border: "1px solid rgba(41,214,255,0.15)",
        }}
      >
        <div
          className="font-orbitron text-naga-cyan mb-3"
          style={{ fontSize: "9px", letterSpacing: "0.15em" }}
        >
          ADAPTIVE AI CORE \u2014 SIGNAL PROCESSING ARCHITECTURE
        </div>
        <div className="grid grid-cols-2 gap-3">
          <TermCard
            name="Entropy Cleansing"
            subtitle="(Signal Sanitization)"
            description="Filters corrupted or malicious data before it enters the processing layer"
            color="#29D6FF"
          />
          <TermCard
            name="Life-Decay Logic"
            subtitle="(TTL / Signal Expiry)"
            description="Unverified signals expire and are discarded rather than acted upon"
            color="#29D6FF"
          />
          <TermCard
            name="Equilibrium Loop"
            subtitle="(Feedback Control Loop)"
            description="Continuously monitors output and adjusts input processing accordingly"
            color="#28E7B7"
          />
          <TermCard
            name="Sovereign Symbolic Compiler"
            subtitle="(Policy Enforcement Engine)"
            description="Translates validated signals into authorized executable directives"
            color="#28E7B7"
          />
          <TermCard
            name="Genesis Protocol"
            subtitle="(Governance Ruleset v1.1)"
            description="The versioned ruleset that governs all permitted system actions"
            color="#F6B24A"
          />
          <TermCard
            name="Second Hull"
            subtitle="(Defense-in-Depth Architecture)"
            description="Secondary protective overlay; must be breached before primary asset is exposed"
            color="#F6B24A"
          />
          <TermCard
            name="DRE"
            subtitle="(Deceptive Resource Exhaustion)"
            description="Redirects attackers into honeypots that drain adversary computational resources"
            color="#FF4B5C"
          />
          <TermCard
            name="Reverse Gas Model"
            subtitle="(Adversarial Cycle Inversion)"
            description="Attacker pays the cost of the attack \u2014 not the defender"
            color="#FF4B5C"
          />
        </div>
      </div>

      {/* \u2500\u2500\u2500 BEYOND THE METER \u2014 DOE ENERGY PRIZE \u2500\u2500\u2500 */}
      <div
        className="rounded"
        style={{
          background: "linear-gradient(135deg, #0e1a10 0%, #0a1208 100%)",
          border: "1px solid rgba(41,214,255,0.25)",
          overflow: "hidden",
        }}
      >
        {/* Section header (always visible) */}
        <div
          className="flex items-start justify-between p-4"
          style={{
            borderBottom: btmExpanded
              ? "1px solid rgba(41,214,255,0.15)"
              : "none",
          }}
        >
          <div className="flex-1">
            <div
              className="font-orbitron font-bold text-naga-cyan mb-1"
              style={{ fontSize: "10px", letterSpacing: "0.12em" }}
            >
              BEYOND THE METER \u2014 DOE ENERGY PRIZE
            </div>
            <div
              className="text-naga-muted mb-2"
              style={{ fontSize: "9px", letterSpacing: "0.06em" }}
            >
              HERO\u0425 / DOE OFFICE OF ELECTRICITY \u00b7
              Commercial/Industrial Solution Track
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="flex items-center gap-1.5 px-2 py-0.5 rounded font-orbitron"
                style={{
                  fontSize: "8px",
                  color: "#F6B24A",
                  background: "rgba(246,178,74,0.1)",
                  border: "1px solid rgba(246,178,74,0.35)",
                  letterSpacing: "0.08em",
                }}
              >
                <span
                  className="status-dot"
                  style={{
                    width: "6px",
                    height: "6px",
                    backgroundColor: "#F6B24A",
                    boxShadow: "0 0 4px #F6B24A",
                  }}
                />
                PHASE 1 OPEN
              </span>
              <span
                className="px-2 py-0.5 rounded font-orbitron"
                style={{
                  fontSize: "8px",
                  color: "#FF4B5C",
                  background: "rgba(255,75,92,0.1)",
                  border: "1px solid rgba(255,75,92,0.35)",
                  letterSpacing: "0.08em",
                }}
              >
                28 DAYS REMAINING
              </span>
            </div>
          </div>
          {/* Collapse / Expand toggle */}
          <button
            type="button"
            data-ocid="btm_prize.toggle"
            onClick={() => setBtmExpanded((v) => !v)}
            className="print-hide flex items-center gap-1 px-2 py-1 rounded font-orbitron ml-3 shrink-0"
            style={{
              fontSize: "8px",
              color: "#29D6FF",
              background: "rgba(41,214,255,0.06)",
              border: "1px solid rgba(41,214,255,0.25)",
              cursor: "pointer",
              letterSpacing: "0.08em",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(41,214,255,0.12)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "rgba(41,214,255,0.06)";
            }}
          >
            {btmExpanded ? (
              <>
                <ChevronUp size={10} />
                [COLLAPSE]
              </>
            ) : (
              <>
                <ChevronDown size={10} />
                [EXPAND]
              </>
            )}
          </button>
        </div>

        {/* Collapsible body */}
        {btmExpanded && (
          <div className="p-4 space-y-4">
            {/* Prize pool \u2014 3 columns */}
            <div className="grid grid-cols-3 gap-3">
              <div
                className="p-3 rounded text-center"
                style={{
                  background: "rgba(40,231,183,0.06)",
                  border: "1px solid rgba(40,231,183,0.2)",
                }}
              >
                <div
                  className="font-orbitron font-bold text-naga-green"
                  style={{ fontSize: "14px" }}
                >
                  $250,000
                </div>
                <div
                  className="text-naga-muted mt-1"
                  style={{ fontSize: "7px", letterSpacing: "0.06em" }}
                >
                  PHASE 1
                </div>
                <div
                  style={{
                    fontSize: "7px",
                    color: "#6f8196",
                    marginTop: "2px",
                    fontFamily: "monospace",
                  }}
                >
                  cash \u00b7 awarded on selection
                </div>
              </div>
              <div
                className="p-3 rounded text-center"
                style={{
                  background: "rgba(41,214,255,0.06)",
                  border: "1px solid rgba(41,214,255,0.2)",
                }}
              >
                <div
                  className="font-orbitron font-bold text-naga-cyan"
                  style={{ fontSize: "14px" }}
                >
                  $950,000
                </div>
                <div
                  className="text-naga-muted mt-1"
                  style={{ fontSize: "7px", letterSpacing: "0.06em" }}
                >
                  PHASE 2
                </div>
                <div
                  style={{
                    fontSize: "7px",
                    color: "#6f8196",
                    marginTop: "2px",
                    fontFamily: "monospace",
                  }}
                >
                  cash \u00b7 summer 2027 peer review
                </div>
              </div>
              <div
                className="p-3 rounded text-center"
                style={{
                  background: "rgba(246,178,74,0.06)",
                  border: "1px solid rgba(246,178,74,0.2)",
                }}
              >
                <div
                  className="font-orbitron font-bold text-naga-amber"
                  style={{ fontSize: "14px" }}
                >
                  $100,000
                </div>
                <div
                  className="text-naga-muted mt-1"
                  style={{ fontSize: "7px", letterSpacing: "0.06em" }}
                >
                  LAB VOUCHER
                </div>
                <div
                  style={{
                    fontSize: "7px",
                    color: "#6f8196",
                    marginTop: "2px",
                    fontFamily: "monospace",
                  }}
                >
                  DOE national laboratory access
                </div>
              </div>
            </div>

            {/* Problem statement */}
            <div
              className="p-3 rounded"
              style={{
                background: "rgba(0,0,0,0.25)",
                border: "1px solid rgba(60,150,190,0.15)",
              }}
            >
              <div
                className="font-orbitron text-naga-muted mb-2"
                style={{ fontSize: "8px", letterSpacing: "0.12em" }}
              >
                PROBLEM STATEMENT
              </div>
              <p
                style={{
                  fontSize: "9px",
                  color: "#9AA9BA",
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                Behind-the-meter energy storage systems from different vendors
                cannot co-optimally coordinate due to interoperability gaps and
                high transaction costs. DOE seeks sovereign, vendor-agnostic
                coordination solutions that reduce consumer costs without
                replacing existing infrastructure.
              </p>
            </div>

            {/* Solution mapping table */}
            <div>
              <div
                className="font-orbitron text-naga-muted mb-2"
                style={{ fontSize: "8px", letterSpacing: "0.12em" }}
              >
                SROS CAPABILITY MAPPING
              </div>
              <div
                className="rounded overflow-hidden"
                style={{ border: "1px solid rgba(41,214,255,0.15)" }}
              >
                {/* Table header */}
                <div
                  className="grid grid-cols-2 px-3 py-2"
                  style={{ background: "rgba(41,214,255,0.08)" }}
                >
                  <div
                    className="font-orbitron text-naga-cyan"
                    style={{ fontSize: "8px", letterSpacing: "0.1em" }}
                  >
                    SROS CAPABILITY
                  </div>
                  <div
                    className="font-orbitron text-naga-green"
                    style={{ fontSize: "8px", letterSpacing: "0.1em" }}
                  >
                    DOE REQUIREMENT
                  </div>
                </div>
                {BTM_SOLUTION_MAP.map((row, i) => (
                  <div
                    key={row.capability}
                    data-ocid={`btm_prize.item.${i + 1}`}
                    className="grid grid-cols-2 px-3 py-2"
                    style={{
                      background:
                        i % 2 === 0
                          ? "rgba(0,0,0,0.15)"
                          : "rgba(41,214,255,0.03)",
                      borderTop: "1px solid rgba(41,214,255,0.08)",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: "9px",
                          color: "#E6EEF7",
                          fontFamily: "monospace",
                        }}
                      >
                        {row.capability}
                      </div>
                      {row.subtitle && (
                        <div
                          style={{
                            fontSize: "8px",
                            color: "#4A5568",
                            fontStyle: "italic",
                            fontFamily: "monospace",
                          }}
                        >
                          {row.subtitle}
                        </div>
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: "9px",
                        color: "#9AA9BA",
                        fontFamily: "monospace",
                      }}
                    >
                      {row.requirement}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Coalition strategy */}
            <div
              className="p-3 rounded"
              style={{
                background: "rgba(246,178,74,0.05)",
                border: "1px solid rgba(246,178,74,0.2)",
              }}
            >
              <div
                className="font-orbitron text-naga-amber mb-2"
                style={{ fontSize: "8px", letterSpacing: "0.12em" }}
              >
                PHASE 2 COALITION TARGET
              </div>
              <div
                style={{
                  fontSize: "9px",
                  color: "#E6EEF7",
                  fontFamily: "monospace",
                  marginBottom: "4px",
                }}
              >
                Stem Inc. (AI-driven BTM storage) or Schneider Electric
                (Commercial/Industrial BTM)
              </div>
              <div
                style={{ fontSize: "8px", color: "#6f8196", lineHeight: 1.5 }}
              >
                SROS provides the sovereign coordination layer; coalition
                partner provides the BTM hardware ecosystem.
              </div>
            </div>

            {/* Footer */}
            <div
              className="flex items-center justify-between pt-2"
              style={{ borderTop: "1px solid rgba(41,214,255,0.1)" }}
            >
              <div>
                <div
                  className="text-naga-muted mb-0.5"
                  style={{ fontSize: "7px", fontFamily: "monospace" }}
                >
                  SUBMISSION
                </div>
                <a
                  href="https://www.herox.com/beyondthemeter"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    fontSize: "9px",
                    color: "#29D6FF",
                    fontFamily: "monospace",
                    textDecoration: "none",
                  }}
                >
                  https://www.herox.com/beyondthemeter
                </a>
              </div>
              <div
                style={{
                  fontSize: "7px",
                  color: "#4A5568",
                  fontFamily: "monospace",
                  fontStyle: "italic",
                  textAlign: "right",
                  maxWidth: "160px",
                }}
              >
                This panel is included in PDF export for submission reference.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

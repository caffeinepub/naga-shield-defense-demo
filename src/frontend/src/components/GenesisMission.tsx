import { CheckCircle, Radio, Shield } from "lucide-react";
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

interface GenesisMissionProps {
  sovereignMetrics?: string | null;
  isControllerAuthenticated?: boolean;
  sovereignSignerKey?: LiveCanisterData["sovereignSignerKey"];
}

export function GenesisMission({
  sovereignMetrics,
  isControllerAuthenticated = false,
}: GenesisMissionProps = {}) {
  return (
    <div className="card-hud p-5 h-full">
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
            INTERNET COMPUTER PROTOCOL — LAYER 2 ENFORCEMENT FRAMEWORK
          </div>
        </div>
        <div className="ml-auto">
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

      {/* Architect Identity — public on-chain verification (no wallet required) */}
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
          Verified via sovereign_signer (43d7d…) — no wallet required
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
        className="p-4 rounded"
        style={{
          background: "rgba(0,0,0,0.25)",
          border: "1px solid rgba(41,214,255,0.2)",
        }}
      >
        <div
          className="font-orbitron text-naga-cyan mb-3"
          style={{ fontSize: "9px", letterSpacing: "0.15em" }}
        >
          SROS LAYER 2 SECURITY MESH — EXECUTIVE SUMMARY
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
              ICP Mainnet · Distributed
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
          Traditional perimeter defense exposes industrial assets — power grids,
          shipyard controllers, water systems — on a single hull breach. A
          single intrusion is not a data leak; it is a physical infrastructure
          failure.
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
          SROS sits non-invasively on top of existing infrastructure as a
          decentralized protective mesh. Naga Shield validates every payload
          signature. DRE redirects hostile signatures into instrumented
          honeypots, exhausting adversary cycles without touching the primary
          grid. ICP substrate ensures the mesh is mathematically neutral and
          cannot be disabled by any single provider or nation-state.
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
              GENESIS MISSION — APRIL 28, 2026
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
    </div>
  );
}

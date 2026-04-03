import { AlertTriangle, ChevronDown, ChevronUp, Zap } from "lucide-react";
import type React from "react";
import { useState } from "react";

export interface FailureScenario {
  id: string;
  signature: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM";
  domain: string;
  description: string;
  symptoms: string;
  fixPayload: string;
}

const SCENARIOS: FailureScenario[] = [
  {
    id: "fs-001",
    signature: "REENTRANCY_ATTACK_V1",
    severity: "CRITICAL",
    domain: "Smart Contract Security",
    description:
      "A reentrant call exploits incomplete state update before external call returns, enabling recursive fund drain.",
    symptoms:
      "Unexpected balance depletion; repeated execution logs from single transaction origin.",
    fixPayload: `// Fix: Checks-Effects-Interactions pattern\nfn safe_transfer(to: Principal, amount: u64) {\n    assert!(self.balances[caller] >= amount, "insufficient");\n    // 1. EFFECT: update state first\n    self.balances[caller] -= amount;\n    self.balances[to] += amount;\n    // 2. INTERACT: external call after state is settled\n    emit Transfer { from: caller, to, amount };\n}`,
  },
  {
    id: "fs-002",
    signature: "CYCLE_DRAIN_ATTACK_V1",
    severity: "CRITICAL",
    domain: "ICP Cycle Management",
    description:
      "Adversarial message flooding exhausts canister cycles, causing the node to go offline and drop mesh coordination.",
    symptoms:
      "Rapid cycle depletion; canister enters frozen state; mesh resonance drops below threshold.",
    fixPayload: `// Fix: Rate limiting + cycle threshold guard\nconst MIN_CYCLES_BUFFER: u64 = 500_000_000_000;\nconst MAX_MSG_PER_BLOCK: u32 = 50;\n\nfn accept_message() {\n    if ic_cdk::api::canister_balance() < MIN_CYCLES_BUFFER {\n        ic_cdk::api::call::reject("LOW_CYCLES");\n        return;\n    }\n    if self.msg_count_this_block > MAX_MSG_PER_BLOCK {\n        ic_cdk::api::call::reject("RATE_LIMIT");\n        return;\n    }\n    // proceed\n}`,
  },
  {
    id: "fs-003",
    signature: "SIGNAL_SPOOFING_V1",
    severity: "HIGH",
    domain: "Grid Signal Integrity",
    description:
      "Malicious actor injects false grid price or frequency signals, causing the optimization engine to dispatch incorrect BTM actions.",
    symptoms:
      "Energy dispatch events inconsistent with utility reports; hash mismatch on incoming signal payloads.",
    fixPayload: `// Fix: Signal source authentication + hash verification\nfn ingest_grid_signal(payload: GridSignal, sig: Vec<u8>) -> Result<(), String> {\n    // Verify signal originates from registered source\n    let expected_hash = sha256(&payload.encode());\n    if !verify_signature(&sig, &expected_hash, &TRUSTED_ORACLE_KEY) {\n        return Err("INVALID_SIGNAL_SOURCE");\n    }\n    // Replay protection\n    if self.seen_nonces.contains(&payload.nonce) {\n        return Err("REPLAY_DETECTED");\n    }\n    self.seen_nonces.insert(payload.nonce);\n    self.process_signal(payload)\n}`,
  },
  {
    id: "fs-004",
    signature: "UNAUTHORIZED_DISPATCH_V1",
    severity: "CRITICAL",
    domain: "Autonomous Action Authorization",
    description:
      "An unsigned or unvalidated execution payload bypasses the root neuron gate, triggering unauthorized hardware commands.",
    symptoms:
      "Dispatch events with no corresponding ledger seal; execution log shows unsigned payload hash.",
    fixPayload: `// Fix: Mandatory hash-gate before any dispatch\nfn dispatch_action(payload: ActionPayload) -> Result<(), String> {\n    let hash = sha256(&payload.encode());\n    // Root neuron gate: hash must exist in seal_canister\n    if !seal_canister::is_sealed(&hash).await? {\n        return Err("HASH_NOT_IN_REGISTRY — dispatch blocked");\n    }\n    // Root neuron signature required\n    sovereign_signer::validate(&hash).await?;\n    // Only now execute\n    naga_execution::fire(payload).await\n}`,
  },
  {
    id: "fs-005",
    signature: "THRESHOLD_BREACH_V1",
    severity: "HIGH",
    domain: "BTM Energy Coordination",
    description:
      "Battery state-of-charge drops below safe operating threshold due to missed dispatch coordination, risking hardware damage.",
    symptoms:
      "SOC < 10% on critical BESS assets; missed demand response events; customer load not served.",
    fixPayload:
      "// Fix: Emergency reserve floor with priority re-dispatch\nconst SOC_FLOOR: f64 = 0.15; // 15% reserve floor\n\nfn compute_dispatch(battery: &BatteryAsset, grid: &GridSignal) -> DispatchAction {\n    if battery.soc <= SOC_FLOOR {\n        // Override: stop all discharge immediately\n        return DispatchAction::HoldCharge { priority: Priority::Emergency };\n    }\n    // Normal optimization\n    self.optimizer.compute(battery, grid)\n}",
  },
  {
    id: "fs-006",
    signature: "NODE_DROPOUT_V1",
    severity: "HIGH",
    domain: "Mesh Resilience",
    description:
      "A coordination node goes offline mid-pipeline, orphaning in-flight actions and breaking the validation chain.",
    symptoms:
      "Pipeline stalls at VALIDATE or SIGN stage; partial ledger entries; timeout errors from sovereign_signer.",
    fixPayload:
      "// Fix: Circuit breaker + fallback node promotion\nconst TIMEOUT_MS: u64 = 5000;\nconst FALLBACK_NODES: [Principal; 3] = [BACKUP_SIGNER_1, BACKUP_SIGNER_2, BACKUP_SIGNER_3];\n\nasync fn validate_with_fallback(hash: &[u8]) -> Result<Signature, Error> {\n    for node in &[PRIMARY_SIGNER].iter().chain(FALLBACK_NODES.iter()) {\n        match timeout(TIMEOUT_MS, node.validate(hash)).await {\n            Ok(sig) => return Ok(sig),\n            Err(_) => continue, // node timed out, try next\n        }\n    }\n    Err(Error::AllNodesFailed)\n}",
  },
  {
    id: "fs-007",
    signature: "HASH_MISMATCH_V1",
    severity: "MEDIUM",
    domain: "Formal Verification",
    description:
      "Recomputed SHA-256 of deployed fix payload does not match the sealed registry hash, indicating tampering or corruption.",
    symptoms:
      "seal_canister.verify() returns false; sovereign_signer rejects validation; deployment blocked.",
    fixPayload:
      "// Fix: Pre-deployment integrity check with rollback\nfn deploy_fix(payload: &[u8], expected_hash: &[u8; 32]) -> Result<(), Error> {\n    let actual_hash = sha256(payload);\n    if actual_hash != *expected_hash {\n        // Log the discrepancy immutably\n        ledger::record_integrity_failure(&actual_hash, expected_hash);\n        return Err(Error::HashMismatch {\n            expected: hex::encode(expected_hash),\n            actual: hex::encode(&actual_hash),\n        });\n    }\n    // Hash confirmed — safe to deploy\n    execution::apply(payload)\n}",
  },
  {
    id: "fs-008",
    signature: "LEDGER_DESYNC_V1",
    severity: "MEDIUM",
    domain: "Audit Trail Integrity",
    description:
      "Secondary ledger entries fall out of sequence due to concurrent writes, creating gaps in the immutable audit trail.",
    symptoms:
      "Missing sequence numbers in ledger; duplicate nonces; audit gaps visible in RAW TELEMETRY.",
    fixPayload:
      "// Fix: Atomic append-only writes with sequence lock\nstruct LedgerEntry {\n    seq: u64,\n    timestamp: u64,\n    hash: [u8; 32],\n    data: Vec<u8>,\n}\n\nfn append(entry_data: Vec<u8>, hash: [u8; 32]) -> u64 {\n    // Atomic: read-increment-write under canister lock\n    let seq = self.next_seq;\n    self.next_seq += 1;\n    self.entries.push(LedgerEntry {\n        seq, timestamp: ic_cdk::api::time(), hash, data: entry_data,\n    });\n    seq // return sequence number for caller confirmation\n}",
  },
];

const SEVERITY_STYLE: Record<
  FailureScenario["severity"],
  { color: string; bg: string }
> = {
  CRITICAL: { color: "#f87171", bg: "rgba(248,113,113,0.1)" },
  HIGH: { color: "#fbbf24", bg: "rgba(251,191,36,0.08)" },
  MEDIUM: { color: "#60a5fa", bg: "rgba(96,165,250,0.08)" },
};

interface Props {
  onLoad: (signature: string, fixPayload: string) => void;
}

export const FailureScenarioLibrary: React.FC<Props> = ({ onLoad }) => {
  const [expanded, setExpanded] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="card-hud border border-red-500/20 bg-black/40 backdrop-blur-md">
      <button
        type="button"
        className="w-full flex items-center justify-between px-5 py-4"
        onClick={() => setExpanded((e) => !e)}
      >
        <div className="flex items-center gap-2">
          <AlertTriangle size={18} className="text-red-400" />
          <span className="font-orbitron text-sm text-red-400 tracking-widest">
            FAILURE SCENARIO LIBRARY
          </span>
          <span
            className="text-[10px] font-orbitron px-2 py-0.5 rounded"
            style={{
              background: "rgba(248,113,113,0.1)",
              color: "#f87171",
              border: "1px solid rgba(248,113,113,0.2)",
            }}
          >
            {SCENARIOS.length} SCENARIOS
          </span>
        </div>
        {expanded ? (
          <ChevronUp size={16} className="text-naga-muted" />
        ) : (
          <ChevronDown size={16} className="text-naga-muted" />
        )}
      </button>

      {expanded && (
        <div className="px-5 pb-5">
          <p className="text-[10px] text-naga-muted mb-4">
            Pre-coded failure modes with autonomous fix payloads. Select a
            scenario to load it into the Hash Simulator, compute its SHA-256
            hash, commit to the Secondary Ledger, and simulate root neuron
            deployment.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {SCENARIOS.map((sc) => {
              const style = SEVERITY_STYLE[sc.severity];
              const isSelected = selected === sc.id;
              return (
                <button
                  key={sc.id}
                  type="button"
                  className="rounded border p-3 transition-all cursor-pointer text-left w-full"
                  style={{
                    background: isSelected
                      ? `${style.color}12`
                      : "rgba(0,0,0,0.3)",
                    borderColor: isSelected
                      ? style.color
                      : "rgba(255,255,255,0.06)",
                  }}
                  onClick={() => setSelected(isSelected ? null : sc.id)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div
                        className="font-orbitron text-[10px]"
                        style={{ color: style.color }}
                      >
                        {sc.signature}
                      </div>
                      <div className="text-[9px] text-naga-muted mt-0.5">
                        {sc.domain}
                      </div>
                    </div>
                    <span
                      className="shrink-0 text-[9px] font-orbitron px-1.5 py-0.5 rounded"
                      style={{
                        background: style.bg,
                        color: style.color,
                        border: `1px solid ${style.color}30`,
                      }}
                    >
                      {sc.severity}
                    </span>
                  </div>
                  <p className="text-[9px] text-gray-400 mt-2 leading-relaxed">
                    {sc.description}
                  </p>

                  {isSelected && (
                    <div className="mt-3 space-y-2">
                      <div className="text-[9px] text-naga-muted">
                        <span className="text-yellow-400/80">Symptoms: </span>
                        {sc.symptoms}
                      </div>
                      <pre
                        className="text-[9px] text-green-400/90 bg-black/50 rounded p-2 overflow-x-auto"
                        style={{
                          border: "1px solid rgba(52,211,153,0.15)",
                          maxHeight: 160,
                          fontFamily: "monospace",
                        }}
                      >
                        {sc.fixPayload}
                      </pre>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onLoad(sc.signature, sc.fixPayload);
                        }}
                        className="flex items-center gap-1.5 text-[10px] font-orbitron px-3 py-1.5 rounded transition-all"
                        style={{
                          background: "rgba(41,214,255,0.12)",
                          border: "1px solid rgba(41,214,255,0.4)",
                          color: "#29D6FF",
                        }}
                      >
                        <Zap size={12} /> LOAD INTO HASH SIMULATOR
                      </button>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FailureScenarioLibrary;

import { Database, Shield, Zap } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { FailureScenarioLibrary } from "./FailureScenarioLibrary";

interface LedgerEntry {
  id: string;
  problemSignature: string;
  solutionHash: string;
  status: "PENDING" | "VALIDATED" | "SEALED" | "DEPLOYED";
  timestamp: string;
}

const RootNeuron: React.FC = () => {
  const [logicInput, setLogicInput] = useState("");
  const [problemLabel, setProblemLabel] = useState("");
  const [currentHash, setCurrentHash] = useState("");
  const [ledger, setLedger] = useState<LedgerEntry[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [committed, setCommitted] = useState(false);

  // SHA-256 Client-side computation
  const computeHash = async () => {
    if (!logicInput) return;
    const msgUint8 = new TextEncoder().encode(logicInput);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    setCurrentHash(hashHex);
  };

  // Called when FailureScenarioLibrary loads a scenario
  const handleLoadScenario = (signature: string, fixPayload: string) => {
    setProblemLabel(signature);
    setLogicInput(fixPayload);
    setCurrentHash("");
    setCommitted(false);
    // Scroll to hash simulator
    setTimeout(() => {
      document
        .getElementById("hash-simulator-anchor")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const addToLedger = () => {
    if (!currentHash || !problemLabel) return;
    const newEntry: LedgerEntry = {
      id: Math.random().toString(36).substr(2, 9),
      problemSignature: problemLabel,
      solutionHash: currentHash,
      status: "PENDING",
      timestamp: new Date().toLocaleTimeString(),
    };
    setLedger([newEntry, ...ledger]);
    setLogicInput("");
    setProblemLabel("");
    setCurrentHash("");
    // Flash committed
    setCommitted(true);
    setTimeout(() => setCommitted(false), 1500);
  };

  const simulateDeployment = async (id: string) => {
    setIsSimulating(true);
    const updateStatus = (status: LedgerEntry["status"]) => {
      setLedger((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status } : e)),
      );
    };

    // Phase 1: Root Neuron Validation
    await new Promise((r) => setTimeout(r, 1000));
    updateStatus("VALIDATED");

    // Phase 2: Ledger Sealing
    await new Promise((r) => setTimeout(r, 1000));
    updateStatus("SEALED");

    // Phase 3: Autonomous Deploy
    await new Promise((r) => setTimeout(r, 1000));
    updateStatus("DEPLOYED");
    setIsSimulating(false);
  };

  const canCommit = !!(currentHash && problemLabel);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Failure Scenario Library */}
      <FailureScenarioLibrary onLoad={handleLoadScenario} />

      {/* Hash Simulator Section */}
      <div
        id="hash-simulator-anchor"
        className="card-hud p-6 border border-naga-blue/30 bg-black/40 backdrop-blur-md"
      >
        <h3 className="text-xl font-orbitron text-naga-blue mb-1 flex items-center gap-2">
          <Shield size={20} /> SHA-256 PAYLOAD INTEGRITY SIMULATOR
        </h3>
        <p className="text-[10px] text-naga-muted mb-4">
          Load a failure scenario above, or paste your own fix payload. Compute
          the SHA-256 hash, commit it to the Secondary Ledger, and simulate the
          full root neuron autonomous deployment pipeline.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Problem Identifier (e.g., REENTRANCY_V1)"
              className="w-full bg-black/60 border border-naga-blue/20 p-2 text-sm text-teal-400 font-mono rounded"
              value={problemLabel}
              onChange={(e) => {
                setProblemLabel(e.target.value);
                setCurrentHash("");
              }}
            />
            <textarea
              placeholder="Paste Fix Logic or Code Payload..."
              className="w-full h-32 bg-black/60 border border-naga-blue/20 p-2 text-xs text-green-400 font-mono rounded"
              value={logicInput}
              onChange={(e) => {
                setLogicInput(e.target.value);
                setCurrentHash("");
              }}
            />
            <button
              type="button"
              onClick={computeHash}
              disabled={!logicInput}
              className="w-full py-2 transition-all font-orbitron text-xs tracking-widest rounded"
              style={{
                background: logicInput
                  ? "rgba(41,214,255,0.15)"
                  : "rgba(41,214,255,0.03)",
                border: `1px solid ${
                  logicInput ? "rgba(41,214,255,0.5)" : "rgba(41,214,255,0.1)"
                }`,
                color: logicInput ? "#29D6FF" : "#4A5568",
                cursor: logicInput ? "pointer" : "not-allowed",
              }}
            >
              COMPUTE SHA-256 HASH
            </button>
          </div>

          <div className="flex flex-col justify-center items-center border border-dashed border-naga-blue/20 rounded p-4">
            <span className="text-[10px] text-naga-blue/60 mb-2 uppercase tracking-tighter">
              Derived SHA-256 Root Hash
            </span>
            <div className="break-all font-mono text-sm text-center text-teal-300">
              {currentHash ||
                "0x0000000000000000000000000000000000000000000000000000000000000000"}
            </div>

            {currentHash && (
              <div className="mt-4 w-full">
                {!problemLabel && (
                  <p className="text-[10px] text-yellow-400/80 text-center mb-2">
                    Fill in a Problem Identifier above to enable registration.
                  </p>
                )}
                <button
                  type="button"
                  onClick={addToLedger}
                  disabled={!canCommit}
                  className="w-full text-[10px] font-orbitron py-2 rounded transition-all"
                  style={{
                    background: committed
                      ? "rgba(52,211,153,0.3)"
                      : canCommit
                        ? "rgba(52,211,153,0.15)"
                        : "rgba(52,211,153,0.04)",
                    border: `1px solid ${
                      committed
                        ? "#34d399"
                        : canCommit
                          ? "rgba(52,211,153,0.5)"
                          : "rgba(52,211,153,0.1)"
                    }`,
                    color: committed
                      ? "#34d399"
                      : canCommit
                        ? "#34d399"
                        : "#4A5568",
                    cursor: canCommit ? "pointer" : "not-allowed",
                  }}
                >
                  {committed
                    ? "✓ REGISTERED"
                    : "REGISTER TO REMEDIATION LEDGER"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Secondary Ledger Section */}
      <div className="card-hud p-6 border border-teal-500/30 bg-black/40">
        <h3 className="text-xl font-orbitron text-teal-400 mb-4 flex items-center gap-2">
          <Database size={20} /> REMEDIATION AUDIT LEDGER{" "}
          <span className="text-xs text-teal-400/50 ml-1">(SESSION)</span>
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[11px] font-mono">
            <thead className="text-naga-blue/60 uppercase border-b border-naga-blue/20">
              <tr>
                <th className="pb-2 pr-4">Problem Identifier</th>
                <th className="pb-2 pr-4">Payload Hash (SHA-256)</th>
                <th className="pb-2 pr-4">Validation Pipeline</th>
                <th className="pb-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-naga-blue/10">
              {ledger.map((entry) => (
                <tr key={entry.id} className="group hover:bg-white/5">
                  <td className="py-3 pr-4 text-teal-500">
                    {entry.problemSignature}
                  </td>
                  <td className="py-3 pr-4 text-naga-blue/80">
                    {entry.solutionHash.substring(0, 12)}...
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <span
                        className="px-2 py-0.5 rounded text-[10px] font-orbitron"
                        style={{
                          background:
                            entry.status === "DEPLOYED"
                              ? "rgba(52,211,153,0.15)"
                              : "rgba(251,191,36,0.08)",
                          color:
                            entry.status === "DEPLOYED" ? "#34d399" : "#fbbf24",
                        }}
                      >
                        {entry.status}
                      </span>
                      <div className="flex gap-1">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            entry.status !== "PENDING"
                              ? "bg-green-500"
                              : "bg-gray-700"
                          }`}
                          title="Validated"
                        />
                        <div
                          className={`w-2 h-2 rounded-full ${
                            ["SEALED", "DEPLOYED"].includes(entry.status)
                              ? "bg-green-500"
                              : "bg-gray-700"
                          }`}
                          title="Sealed"
                        />
                        <div
                          className={`w-2 h-2 rounded-full ${
                            entry.status === "DEPLOYED"
                              ? "bg-blue-500 animate-pulse"
                              : "bg-gray-700"
                          }`}
                          title="Deployed"
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    {entry.status === "PENDING" && (
                      <button
                        type="button"
                        disabled={isSimulating}
                        onClick={() => simulateDeployment(entry.id)}
                        className="flex items-center gap-1 text-blue-400 hover:text-blue-200 transition-colors font-orbitron text-[10px]"
                      >
                        <Zap size={13} /> INITIATE PIPELINE
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {ledger.length === 0 && (
            <div className="text-center py-10 text-naga-blue/40 italic text-xs">
              No entries registered to the remediation ledger.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RootNeuron;

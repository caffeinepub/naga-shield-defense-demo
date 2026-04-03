import { useState } from "react";
import type { RawResult } from "../hooks/useLiveCanisters";

interface RawTelemetryProps {
  rawResults: Record<string, RawResult>;
  lastFetched: Date | null;
  meshResonanceScore: number;
  isLoading: boolean;
}

function formatTimestamp(d: Date): string {
  return `${d.toISOString().replace("T", " ").slice(0, 23)} UTC`;
}

export function RawTelemetry({
  rawResults,
  lastFetched,
  meshResonanceScore,
  isLoading,
}: RawTelemetryProps) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const entries = Object.entries(rawResults);
  const fulfilledCount = entries.filter(
    ([, r]) => r.status === "fulfilled",
  ).length;

  const toggleExpand = (key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div
      style={{
        background: "#050C14",
        border: "1px solid rgba(41,214,255,0.3)",
        borderRadius: "6px",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid rgba(41,214,255,0.2)",
          background:
            "linear-gradient(180deg, rgba(41,214,255,0.06) 0%, transparent 100%)",
        }}
      >
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <div
              className="font-orbitron font-bold"
              style={{
                fontSize: "14px",
                color: "#29D6FF",
                letterSpacing: "0.15em",
              }}
            >
              RAW TELEMETRY INSPECTOR
            </div>
            <div
              style={{
                fontFamily: "monospace",
                fontSize: "10px",
                color: "#4A5568",
                marginTop: "4px",
              }}
            >
              ICP MAINNET &mdash; Live on-chain response data. Zero simulation.
              Audit-verifiable.
            </div>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <div
              style={{
                padding: "6px 12px",
                background:
                  meshResonanceScore === 100
                    ? "rgba(40,231,183,0.1)"
                    : meshResonanceScore >= 80
                      ? "rgba(246,178,74,0.1)"
                      : "rgba(255,75,92,0.1)",
                border: `1px solid ${
                  meshResonanceScore === 100
                    ? "rgba(40,231,183,0.3)"
                    : meshResonanceScore >= 80
                      ? "rgba(246,178,74,0.3)"
                      : "rgba(255,75,92,0.3)"
                }`,
                borderRadius: "4px",
              }}
            >
              <div
                className="font-orbitron"
                style={{
                  fontSize: "8px",
                  color: "#4A5568",
                  letterSpacing: "0.12em",
                }}
              >
                MESH RESONANCE
              </div>
              <div
                className="font-orbitron font-bold"
                style={{
                  fontSize: "22px",
                  lineHeight: 1,
                  color:
                    meshResonanceScore === 100
                      ? "#28E7B7"
                      : meshResonanceScore >= 80
                        ? "#F6B24A"
                        : "#FF4B5C",
                }}
              >
                {isLoading ? "--" : `${meshResonanceScore}%`}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                className="font-orbitron"
                style={{
                  fontSize: "8px",
                  color: "#4A5568",
                  letterSpacing: "0.1em",
                }}
              >
                LAST SYNC
              </div>
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: "9px",
                  color: "#29D6FF",
                }}
              >
                {lastFetched ? formatTimestamp(lastFetched) : "PENDING..."}
              </div>
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: "9px",
                  color: "#4A5568",
                  marginTop: "2px",
                }}
              >
                {fulfilledCount}/{entries.length} CANISTERS RESPONDING
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Column headers */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: "130px 200px 180px 1fr 70px",
          padding: "8px 20px",
          borderBottom: "1px solid rgba(41,214,255,0.1)",
          gap: "12px",
        }}
      >
        {["CANISTER", "CANISTER ID", "METHOD", "RAW RESPONSE", ""].map((h) => (
          <div
            key={h}
            className="font-orbitron"
            style={{
              fontSize: "7px",
              color: "#4A5568",
              letterSpacing: "0.12em",
            }}
          >
            {h}
          </div>
        ))}
      </div>

      {/* Rows */}
      <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
        {isLoading && entries.length === 0 ? (
          <div
            style={{
              padding: "40px",
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: "12px",
              color: "#F6B24A",
            }}
          >
            QUERYING ICP MAINNET...
          </div>
        ) : entries.length === 0 ? (
          <div
            style={{
              padding: "40px",
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: "12px",
              color: "#4A5568",
            }}
          >
            AWAITING FIRST POLL CYCLE
          </div>
        ) : (
          entries.map(([key, r]) => {
            const isExpanded = expanded[key];
            const isLive = r.status === "fulfilled";
            const truncatedValue =
              r.rawValue.length > 120
                ? `${r.rawValue.slice(0, 120)}...`
                : r.rawValue;

            return (
              <div
                key={key}
                style={{
                  borderBottom: "1px solid rgba(41,214,255,0.07)",
                  transition: "background 0.15s",
                }}
              >
                <div
                  className="grid"
                  style={{
                    gridTemplateColumns: "130px 200px 180px 1fr 70px",
                    padding: "10px 20px",
                    gap: "12px",
                    alignItems: "flex-start",
                  }}
                >
                  {/* Status + Canister name */}
                  <div className="flex items-start gap-2">
                    <div
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        backgroundColor: isLive ? "#28E7B7" : "#FF4B5C",
                        boxShadow: `0 0 6px ${isLive ? "#28E7B7" : "#FF4B5C"}`,
                        flexShrink: 0,
                        marginTop: "3px",
                      }}
                    />
                    <span
                      className="font-orbitron"
                      style={{
                        fontSize: "9px",
                        color: isLive ? "#29D6FF" : "#FF4B5C",
                        letterSpacing: "0.06em",
                        wordBreak: "break-all",
                      }}
                    >
                      {key.toUpperCase()}
                    </span>
                  </div>

                  {/* Canister ID */}
                  <div
                    style={{
                      fontFamily: "monospace",
                      fontSize: "8px",
                      color: "#4A5568",
                      wordBreak: "break-all",
                    }}
                  >
                    {r.canisterId}
                  </div>

                  {/* Method */}
                  <div
                    style={{
                      fontFamily: "monospace",
                      fontSize: "8px",
                      color: "#F6B24A",
                      wordBreak: "break-all",
                    }}
                  >
                    {r.method}
                  </div>

                  {/* Raw value */}
                  <div
                    style={{
                      fontFamily: "monospace",
                      fontSize: "9px",
                      color: isLive ? "#E6EEF7" : "#FF4B5C",
                      lineHeight: 1.5,
                      wordBreak: "break-all",
                    }}
                  >
                    {isExpanded ? r.rawValue : truncatedValue}
                  </div>

                  {/* Expand toggle */}
                  <div className="flex justify-end">
                    {r.rawValue.length > 120 && (
                      <button
                        type="button"
                        onClick={() => toggleExpand(key)}
                        className="font-orbitron"
                        style={{
                          fontSize: "7px",
                          color: "#29D6FF",
                          background: "rgba(41,214,255,0.08)",
                          border: "1px solid rgba(41,214,255,0.25)",
                          borderRadius: "3px",
                          padding: "3px 6px",
                          cursor: "pointer",
                          letterSpacing: "0.1em",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {isExpanded ? "COLLAPSE" : "EXPAND"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer summary */}
      <div
        style={{
          padding: "10px 20px",
          borderTop: "1px solid rgba(41,214,255,0.15)",
          background: "rgba(0,0,0,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{ fontFamily: "monospace", fontSize: "9px", color: "#4A5568" }}
        >
          {fulfilledCount}/{entries.length} CANISTERS RESPONDING &mdash; MESH
          RESONANCE:{" "}
          <span
            style={{
              color:
                meshResonanceScore === 100
                  ? "#28E7B7"
                  : meshResonanceScore >= 80
                    ? "#F6B24A"
                    : "#FF4B5C",
              fontWeight: "bold",
            }}
          >
            {meshResonanceScore}%
          </span>
        </div>
        <div
          className="font-orbitron"
          style={{ fontSize: "7px", color: "#4A5568", letterSpacing: "0.1em" }}
        >
          ICP MAINNET &bull; QUERY EVERY 30s
        </div>
      </div>
    </div>
  );
}

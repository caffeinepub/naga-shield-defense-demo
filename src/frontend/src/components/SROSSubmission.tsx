import {
  CheckCircle,
  Cpu,
  ExternalLink,
  Globe,
  Lock,
  Printer,
  Shield,
} from "lucide-react";
import type React from "react";

export const SROSSubmission: React.FC = () => {
  const handleExport = () => {
    window.print();
  };

  return (
    <>
      {/* Print-only styles */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #submission-doc, #submission-doc * { visibility: visible !important; }
          #submission-doc { position: fixed; inset: 0; overflow: visible; }
          .no-print { display: none !important; }
          .page-break { page-break-before: always; }
          @page { margin: 1.2cm 1.4cm; size: A4; }
        }
        @media screen {
          .submission-wrapper {
            background: #f8f9fa;
            padding: 24px 16px;
            min-height: 100%;
          }
        }
      `}</style>

      <div className="submission-wrapper">
        {/* Export Button — screen only */}
        <div
          className="no-print flex justify-end mb-4"
          data-ocid="submission.primary_button"
        >
          <button
            type="button"
            onClick={handleExport}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "#1a365d",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              padding: "10px 20px",
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              fontWeight: 600,
              fontSize: "13px",
              letterSpacing: "0.04em",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(26,54,93,0.25)",
            }}
          >
            <Printer size={15} />
            EXPORT PDF
          </button>
        </div>

        {/* Document */}
        <div
          id="submission-doc"
          style={{
            maxWidth: "860px",
            margin: "0 auto",
            background: "#ffffff",
            boxShadow: "0 2px 24px rgba(0,0,0,0.10)",
            borderRadius: "4px",
            fontFamily: "'Plus Jakarta Sans', 'DM Sans', system-ui, sans-serif",
            color: "#1a202c",
            lineHeight: 1.65,
          }}
        >
          {/* ─── SECTION 1: COVER ─────────────────────────────── */}
          <div
            style={{
              padding: "56px 60px 48px",
              borderBottom: "3px solid #1a365d",
              background: "linear-gradient(135deg, #f0f4f8 0%, #e8f0fe 100%)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "28px",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "8px",
                  background: "#1a365d",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Shield size={20} color="#63b3ed" />
              </div>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#4a5568",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                }}
              >
                DOE SUBMISSION — PHASE 1
              </span>
            </div>

            <h1
              style={{
                fontSize: "30px",
                fontWeight: 800,
                color: "#1a365d",
                lineHeight: 1.2,
                marginBottom: "8px",
                letterSpacing: "-0.02em",
              }}
            >
              SROS — Sovereign Resonant Operating System
            </h1>
            <h2
              style={{
                fontSize: "16px",
                fontWeight: 500,
                color: "#2b6cb0",
                marginBottom: "28px",
                letterSpacing: "0.01em",
              }}
            >
              Layer 2 BTM Energy Coordination Network
            </h2>

            <div
              style={{
                display: "inline-block",
                background: "#ebf8ff",
                border: "1px solid #90cdf4",
                borderRadius: "6px",
                padding: "8px 16px",
                fontSize: "12px",
                color: "#2c5282",
                fontWeight: 600,
                marginBottom: "32px",
              }}
            >
              DOE Beyond the Meter: Energy Storage Integration Prize —
              Commercial/Industrial Solution Track
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
              }}
            >
              <MetaRow label="Submission Date" value="April 2026" />
              <MetaRow label="Track" value="Commercial / Industrial" />
              <MetaRow
                label="Live System URL"
                value="https://sros.icp0.io"
                href="https://sros.icp0.io"
              />
              <MetaRow
                label="Infrastructure"
                value="ICP Mainnet — 17 Live Canisters"
              />
              <div style={{ gridColumn: "1 / -1" }}>
                <MetaRow
                  label="Controller Principal (On-Chain Proof)"
                  value="lvbkk-rrmnk-by44n-wqcwf-iyzhk-jj2bs-hz7wq-f4uiv-4r2z6-lotjl-bqe"
                  mono
                />
              </div>
            </div>
          </div>

          <div style={{ padding: "48px 60px" }}>
            {/* ─── SECTION 2: TEAM ──────────────────────────────── */}
            <SectionHeader number="1" title="Team Introduction" />

            <TwoColGrid>
              <div>
                <FieldLabel>Builder</FieldLabel>
                <p
                  style={{
                    fontSize: "15px",
                    fontWeight: 700,
                    color: "#1a365d",
                    marginBottom: "4px",
                  }}
                >
                  Sophors — Solo Architect
                </p>
                <p style={{ fontSize: "13px", color: "#4a5568" }}>
                  Independent sovereign systems architect. Full-stack ownership:
                  architecture, Rust canister development, ICP mainnet
                  deployment, and frontend engineering.
                </p>
              </div>
              <div>
                <FieldLabel>Methodology</FieldLabel>
                <p style={{ fontSize: "13px", color: "#2d3748" }}>
                  <strong>Human-AI Synthesis.</strong> The system was
                  architected from first principles by a single human engineer
                  using symbolic logic and pattern-based system design, then
                  translated and executed via a coordinated AI layer (Caffeine
                  AI, Claude, Grok). This methodology proves that a single
                  sovereign operator can build, deploy, and own critical
                  infrastructure without institutional resources.
                </p>
              </div>
              <div>
                <FieldLabel>Background</FieldLabel>
                <p style={{ fontSize: "13px", color: "#2d3748" }}>
                  No traditional computer science degree. 17 live Rust canisters
                  deployed on ICP mainnet within 4 months, including autonomous
                  cycle management confirmed live via terminal in April 2026.
                </p>
              </div>
              <div>
                <FieldLabel>Ownership Model</FieldLabel>
                <p style={{ fontSize: "13px", color: "#2d3748" }}>
                  Full sovereignty. All canisters deployed under a single
                  controller principal. No vendor contracts, no cloud
                  dependencies, no data extraction. Verifiable on-chain without
                  a wallet or login.
                </p>
              </div>
            </TwoColGrid>

            <Divider />

            {/* ─── SECTION 3: PRODUCT ───────────────────────────── */}
            <SectionHeader number="2" title="Product Description" />

            <CalloutBox>
              SROS is a non-invasive Layer 2 coordination mesh for
              behind-the-meter (BTM) energy storage assets. It operates as a
              sovereign, autonomous network layer that sits above existing fleet
              infrastructure without requiring hardware changes, firmware
              modifications, or vendor contracts.
            </CalloutBox>

            <TwoColGrid>
              <InfoCard icon={<Globe size={16} />} title="What It Does">
                Monitors grid signals, computes optimal BTM responses in real
                time, validates dispatch actions through a cryptographic root
                neuron gate, executes pre-approved actions autonomously, and
                logs every event to an immutable on-chain audit ledger.
              </InfoCard>
              <InfoCard
                icon={<Lock size={16} />}
                title="What Makes It Different"
              >
                Most BTM coordination platforms require a cloud subscription,
                data sharing agreements, or hardware replacement. SROS requires
                none of these. Operators opt in, own their deployment, and can
                opt out at any time. Zero extraction by design.
              </InfoCard>
              <InfoCard icon={<Cpu size={16} />} title="Current State">
                17 live Rust canisters on ICP mainnet. Autonomous cycle
                management confirmed live. Pre-approved action registry
                operational. Synthetic trigger pipeline demonstrated with live
                on-chain verification.
              </InfoCard>
              <InfoCard
                icon={<CheckCircle size={16} />}
                title="Deployment Model"
              >
                Internet Computer Protocol (ICP) — fully decentralized compute.
                No cloud landlord, no server, no single point of failure. The
                mesh persists as long as cycles remain funded.
              </InfoCard>
            </TwoColGrid>

            <p
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "#2d3748",
                marginTop: "20px",
                marginBottom: "10px",
              }}
            >
              Key Capabilities
            </p>
            <CapabilityList
              items={[
                [
                  "Non-invasive overlay",
                  "No firmware or hardware changes required",
                ],
                ["Vendor-agnostic", "Works with any BTM hardware ecosystem"],
                [
                  "Autonomous dispatch",
                  "Pre-approved actions fire without human intervention",
                ],
                [
                  "Cryptographic validation",
                  "Every action signed and hash-verified before execution",
                ],
                [
                  "Immutable audit trail",
                  "All events logged on-chain, tamper-proof",
                ],
                [
                  "Self-sustaining",
                  "Autonomous cycle management keeps the mesh alive without human monitoring",
                ],
              ]}
            />

            <Divider />

            {/* ─── SECTION 4: STRATEGIC PLAN ────────────────────── */}
            <SectionHeader number="3" title="Strategic Plan" />

            <PhaseBlock
              phase="Phase 1"
              label="Proof of Coordination Layer — Current"
              color="#276749"
              bg="#f0fff4"
              border="#9ae6b4"
            >
              SROS is already deployed and operational on ICP mainnet. The
              system demonstrates a live autonomous coordination pipeline: grid
              signal detection → AI optimization → cryptographic validation →
              autonomous dispatch → immutable audit log. All components are
              verifiable on-chain by any reviewer using the published controller
              principal.
            </PhaseBlock>

            <PhaseBlock
              phase="Phase 2"
              label="Coalition Integration with Stem Inc."
              color="#2b6cb0"
              bg="#ebf8ff"
              border="#90cdf4"
            >
              Stem Inc. operates one of the largest AI-driven BTM energy storage
              fleets in North America. Their hardware ecosystem currently lacks
              a sovereign, vendor-agnostic coordination layer. SROS is the
              missing piece. In Phase 2, SROS would integrate with Stem Inc.'s
              fleet as a non-invasive overlay, demonstrating co-optimal dispatch
              across a commercial-scale BTM deployment.
            </PhaseBlock>

            <PhaseBlock
              phase="Licensing"
              label="Protocol License Model"
              color="#6b46c1"
              bg="#faf5ff"
              border="#d6bcfa"
            >
              SROS is licensed as a coordination protocol, not sold as a
              product. Operators license the right to deploy the mesh over their
              existing infrastructure. They own their deployment. The protocol
              remains sovereign. No subscription, no data extraction, no vendor
              lock-in.
            </PhaseBlock>

            <PhaseBlock
              phase="Vision"
              label="Universal Coordination Layer"
              color="#975a16"
              bg="#fffaf0"
              border="#fbd38d"
            >
              Universal opt-in coordination layer for any fleet: BTM energy,
              naval assets, water treatment, industrial manufacturing. Same
              17-canister mesh, different payload registry per sector.
            </PhaseBlock>

            <Divider />

            {/* ─── SECTION 5: COALITION ─────────────────────────── */}
            <SectionHeader number="4" title="Coalition Partner Statement" />

            <div
              style={{
                background: "#f7fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                padding: "24px",
                marginBottom: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "16px",
                  flexWrap: "wrap",
                  gap: "8px",
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: "17px",
                      fontWeight: 800,
                      color: "#1a365d",
                      marginBottom: "2px",
                    }}
                  >
                    Target Partner: Stem Inc.
                  </p>
                  <a
                    href="https://www.stem.com"
                    style={{
                      fontSize: "12px",
                      color: "#2b6cb0",
                      textDecoration: "none",
                    }}
                  >
                    https://www.stem.com{" "}
                    <ExternalLink
                      size={10}
                      style={{ display: "inline", marginLeft: "2px" }}
                    />
                  </a>
                </div>
                <span
                  style={{
                    background: "#ebf8ff",
                    color: "#2c5282",
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "11px",
                    fontWeight: 700,
                    border: "1px solid #90cdf4",
                  }}
                >
                  Phase 2 Coalition Target
                </span>
              </div>

              <p
                style={{
                  fontSize: "13px",
                  color: "#2d3748",
                  marginBottom: "12px",
                }}
              >
                Stem Inc. is the leading provider of AI-driven behind-the-meter
                energy storage optimization, managing over 2.6 GWh of storage
                assets across commercial and industrial customers. Their Athena
                AI platform optimizes individual BESS units but operates within
                a centralized, vendor-controlled architecture.
              </p>
              <p
                style={{
                  fontSize: "13px",
                  color: "#2d3748",
                  marginBottom: "12px",
                }}
              >
                SROS proposes a non-invasive coordination overlay that would
                allow Stem Inc.'s fleet to participate in a sovereign mesh —
                enabling co-optimal dispatch across multiple assets and vendor
                ecosystems without modifying Stem's existing infrastructure or
                data model.
              </p>
              <p
                style={{
                  fontSize: "13px",
                  color: "#2d3748",
                  marginBottom: "16px",
                }}
              >
                For Phase 2, SROS would operate as an independent coordination
                layer above Stem's Athena platform: reading published grid
                signals, computing cross-asset optimal responses, and
                dispatching pre-approved actions through the cryptographic
                validation pipeline. All coordination events would be logged to
                the SROS immutable ledger, providing Stem and their customers
                with an independent, tamper-proof audit trail.
              </p>

              <div
                style={{
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "6px",
                  padding: "12px 16px",
                  fontSize: "12px",
                  color: "#276749",
                  fontWeight: 600,
                }}
              >
                ✓ No data sharing agreement required &nbsp;·&nbsp; ✓ No API
                contract required &nbsp;·&nbsp; ✓ No infrastructure change from
                Stem Inc. — purely additive coordination layer
              </div>
            </div>

            <Divider />

            {/* ─── SECTION 6: LIVE VERIFICATION ─────────────────── */}
            <SectionHeader number="5" title="Live Verification" />

            <p
              style={{
                fontSize: "13px",
                color: "#4a5568",
                marginBottom: "16px",
              }}
            >
              Any reviewer can independently verify the SROS system without a
              wallet, login, or special tools.
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                marginBottom: "8px",
              }}
            >
              {[
                {
                  n: "1",
                  title: "Query the controller principal",
                  body: "Visit the ICP dashboard and search ",
                  code: "lvbkk-rrmnk-by44n-wqcwf-iyzhk-jj2bs-hz7wq-f4uiv-4r2z6-lotjl-bqe",
                  suffix: " to see all 17 canisters owned by this principal.",
                },
                {
                  n: "2",
                  title: "Query naga_shield live",
                  body: "Open the Candid interface at ",
                  code: "https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.icp0.io/?id=f2hno-jaaaa-aaaaa-qgypa-cai",
                  suffix:
                    " and call get_current_status(). The canister will return its current operational state.",
                },
                {
                  n: "3",
                  title: "Query sovereign_signer (Root Neuron Gate)",
                  body: "Open the Candid interface at ",
                  code: "https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.icp0.io/?id=43d7d-raaaa-aaaaa-qgw6a-cai",
                  suffix:
                    " and call get_public_key(). This is the cryptographic root neuron gate.",
                },
                {
                  n: "4",
                  title: "View the live dashboard",
                  body: "Navigate to the live system URL. All tabs are publicly accessible. The BTM COORDINATION tab shows the pre-approved action registry and synthetic trigger pipeline. The CYCLES tab shows real-time canister health. The RAW TELEMETRY tab shows live on-chain responses.",
                  code: "",
                  suffix: "",
                },
                {
                  n: "5",
                  title: "Verify the deployment timestamp",
                  body: "All canisters carry on-chain creation timestamps proving the system predates this submission. The controller principal and canister IDs are static and immutable.",
                  code: "",
                  suffix: "",
                },
              ].map((item) => (
                <div
                  key={item.n}
                  style={{
                    display: "flex",
                    gap: "14px",
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                    padding: "12px 16px",
                  }}
                >
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      background: "#1a365d",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: "11px",
                      flexShrink: 0,
                    }}
                  >
                    {item.n}
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: "13px",
                        fontWeight: 700,
                        color: "#2d3748",
                        marginBottom: "2px",
                      }}
                    >
                      {item.title}
                    </p>
                    <p style={{ fontSize: "12px", color: "#4a5568" }}>
                      {item.body}
                      {item.code && (
                        <code
                          style={{
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: "11px",
                            background: "#edf2f7",
                            padding: "1px 5px",
                            borderRadius: "3px",
                            wordBreak: "break-all",
                          }}
                        >
                          {item.code}
                        </code>
                      )}
                      {item.suffix}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Divider />

            {/* ─── SECTION 7: GLOSSARY ──────────────────────────── */}
            <SectionHeader number="6" title="Scientific Terminology Glossary" />

            <p
              style={{
                fontSize: "13px",
                color: "#4a5568",
                marginBottom: "16px",
              }}
            >
              The following table maps SROS internal terminology to
              industry-standard scientific equivalents for reviewer clarity.
            </p>

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "12px",
                marginBottom: "8px",
              }}
            >
              <thead>
                <tr style={{ background: "#1a365d" }}>
                  <th
                    style={{
                      padding: "10px 16px",
                      textAlign: "left",
                      color: "#fff",
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      width: "40%",
                    }}
                  >
                    SROS Term
                  </th>
                  <th
                    style={{
                      padding: "10px 16px",
                      textAlign: "left",
                      color: "#63b3ed",
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                    }}
                  >
                    Industry / Scientific Equivalent
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Root Neuron", "Threshold Validation Gateway"],
                  ["Sovereign Signer", "Cryptographic Authorization Node"],
                  ["Naga Shield", "Payload Integrity Enforcement Layer"],
                  ["Mesh Resonance", "Distributed Consensus Health Index"],
                  ["Living Code", "Autonomous Self-Sustaining Software Agent"],
                  ["Secondary Ledger", "Immutable Remediation Audit Log"],
                  [
                    "Cycle Top-Up Pipeline",
                    "Autonomous Resource Allocation Protocol",
                  ],
                  ["Seal Canister", "Pre-Approved Action Hash Registry"],
                  [
                    "Force Condition",
                    "Synthetic Telemetry Injection (Test Mode)",
                  ],
                  ["Adaptive AI Core", "Real-Time Optimization Engine"],
                  ["Naga Execution", "Autonomous Dispatch Node"],
                  ["Sovereign Core", "Distributed State Registry"],
                ].map(([term, equiv], i) => (
                  <tr
                    key={term}
                    style={{ background: i % 2 === 0 ? "#f7fafc" : "#fff" }}
                  >
                    <td
                      style={{
                        padding: "9px 16px",
                        color: "#2d3748",
                        fontFamily: "'JetBrains Mono', monospace",
                        fontWeight: 600,
                        fontSize: "11.5px",
                        borderBottom: "1px solid #e2e8f0",
                      }}
                    >
                      {term}
                    </td>
                    <td
                      style={{
                        padding: "9px 16px",
                        color: "#2b6cb0",
                        fontWeight: 500,
                        borderBottom: "1px solid #e2e8f0",
                      }}
                    >
                      {equiv}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Divider />

            {/* ─── FOOTER ───────────────────────────────────────── */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: "12px",
                borderTop: "1px solid #e2e8f0",
                fontSize: "11px",
                color: "#718096",
                flexWrap: "wrap",
                gap: "8px",
              }}
            >
              <span>
                SROS — Sovereign Resonant Operating System &nbsp;·&nbsp; Phase 1
                Submission &nbsp;·&nbsp; April 2026
              </span>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "10px",
                  color: "#a0aec0",
                }}
              >
                lvbkk-rrmnk-by44n-wqcwf-iyzhk-jj2bs-hz7wq-f4uiv-4r2z6-lotjl-bqe
              </span>
            </div>
          </div>
          {/* end padded body */}
        </div>
        {/* end #submission-doc */}

        {/* Caffeine footer — screen only */}
        <div
          className="no-print"
          style={{
            maxWidth: "860px",
            margin: "12px auto 0",
            textAlign: "center",
            fontSize: "11px",
            color: "#718096",
          }}
        >
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
            style={{ color: "#2b6cb0" }}
          >
            caffeine.ai
          </a>
        </div>
      </div>
    </>
  );
};

export default SROSSubmission;

// ─── Sub-components ─────────────────────────────────────────────────────────

const SectionHeader: React.FC<{ number: string; title: string }> = ({
  number,
  title,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "12px",
      marginBottom: "20px",
    }}
  >
    <div
      style={{
        width: "28px",
        height: "28px",
        background: "#1a365d",
        borderRadius: "6px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#63b3ed",
        fontWeight: 800,
        fontSize: "12px",
        flexShrink: 0,
      }}
    >
      {number}
    </div>
    <h2
      style={{
        fontSize: "17px",
        fontWeight: 800,
        color: "#1a365d",
        letterSpacing: "-0.01em",
        margin: 0,
      }}
    >
      {title}
    </h2>
  </div>
);

const Divider: React.FC = () => (
  <div style={{ borderTop: "1px solid #e2e8f0", margin: "32px 0" }} />
);

const FieldLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p
    style={{
      fontSize: "10px",
      fontWeight: 700,
      color: "#718096",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      marginBottom: "4px",
    }}
  >
    {children as React.ReactNode}
  </p>
);

const TwoColGrid: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "20px",
      marginBottom: "20px",
    }}
  >
    {children}
  </div>
);

const MetaRow: React.FC<{
  label: string;
  value: string;
  href?: string;
  mono?: boolean;
}> = ({ label, value, href, mono }) => (
  <div>
    <FieldLabel>{label}</FieldLabel>
    {href ? (
      <a
        href={href}
        style={{
          fontSize: "13px",
          fontWeight: 600,
          color: "#2b6cb0",
          textDecoration: "none",
          fontFamily: mono ? "'JetBrains Mono', monospace" : undefined,
          wordBreak: "break-all",
        }}
      >
        {value}
      </a>
    ) : (
      <p
        style={{
          fontSize: mono ? "11px" : "13px",
          fontWeight: 600,
          color: "#2d3748",
          fontFamily: mono ? "'JetBrains Mono', monospace" : undefined,
          wordBreak: "break-all",
          margin: 0,
        }}
      >
        {value}
      </p>
    )}
  </div>
);

const CalloutBox: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      background: "#ebf8ff",
      border: "1px solid #90cdf4",
      borderLeft: "4px solid #2b6cb0",
      borderRadius: "0 6px 6px 0",
      padding: "14px 18px",
      fontSize: "13px",
      color: "#2c5282",
      lineHeight: 1.7,
      marginBottom: "20px",
    }}
  >
    {children}
  </div>
);

const InfoCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}> = ({ icon, title, children }) => (
  <div
    style={{
      background: "#f8fafc",
      border: "1px solid #e2e8f0",
      borderRadius: "8px",
      padding: "16px",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "8px",
      }}
    >
      <span style={{ color: "#2b6cb0" }}>{icon}</span>
      <p
        style={{
          fontSize: "12px",
          fontWeight: 700,
          color: "#2d3748",
          margin: 0,
        }}
      >
        {title}
      </p>
    </div>
    <p
      style={{
        fontSize: "12px",
        color: "#4a5568",
        margin: 0,
        lineHeight: 1.65,
      }}
    >
      {children as React.ReactNode}
    </p>
  </div>
);

const CapabilityList: React.FC<{ items: [string, string][] }> = ({ items }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
    {items.map(([title, desc]) => (
      <div
        key={title}
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "10px",
          fontSize: "12px",
        }}
      >
        <span style={{ color: "#276749", marginTop: "2px", flexShrink: 0 }}>
          ✓
        </span>
        <span>
          <strong style={{ color: "#2d3748" }}>{title}</strong>
          <span style={{ color: "#718096" }}> — {desc}</span>
        </span>
      </div>
    ))}
  </div>
);

const PhaseBlock: React.FC<{
  phase: string;
  label: string;
  color: string;
  bg: string;
  border: string;
  children: React.ReactNode;
}> = ({ phase, label, color, bg, border, children }) => (
  <div
    style={{
      background: bg,
      border: `1px solid ${border}`,
      borderLeft: `4px solid ${color}`,
      borderRadius: "0 8px 8px 0",
      padding: "16px 20px",
      marginBottom: "12px",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "6px",
      }}
    >
      <span
        style={{
          fontSize: "10px",
          fontWeight: 800,
          color,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}
      >
        {phase}
      </span>
      <span style={{ fontSize: "13px", fontWeight: 700, color: "#2d3748" }}>
        {label}
      </span>
    </div>
    <p
      style={{
        fontSize: "12.5px",
        color: "#4a5568",
        margin: 0,
        lineHeight: 1.7,
      }}
    >
      {children as React.ReactNode}
    </p>
  </div>
);

# Naga Shield Defense Demo — Scientific Terminology Update

## Current State
The dashboard uses a mix of symbolic/invented terminology and scientific terminology. Several key labels, panel titles, tab names, and metric names use invented or informal terms that are not immediately legible to DOE reviewers, coalition partners (Stem Inc., Schneider Electric), or technical evaluators. A full audit has been completed across all components.

## Requested Changes (Diff)

### Add
- Scientific subtitle annotations under any remaining symbolic terms that cannot be fully renamed (e.g., internal canister names like `naga_shield` stay as identifiers but get formal function descriptions)
- Tooltip or sub-label on simulated metrics clarifying "PHASE 1 CONCEPTUAL DEMONSTRATION"

### Modify
All symbolic or informal labels replaced with scientific/industry-standard equivalents:

**App.tsx (header, tabs, KPI cards, sidebar, overview panels):**
- "NAGA SHIELD" in header subtitle → "LAYER 2 SECURITY DEFENSE SYSTEM" (already correct, keep)
- KPI card label "MESH RESONANCE" → "DISTRIBUTED CONSENSUS INDEX"
- KPI sub-label "LIVE CANISTER FULFILLMENT" → "LIVE NODE FULFILLMENT RATIO"
- KPI card label "CYCLES DRAINED" → "COMPUTE RESOURCE DELTA"
- KPI sub-label "LIVE CYCLE BURN DELTA" → "INTER-POLL CYCLE CONSUMPTION"
- Tab name "ROOT NEURON" → "THRESHOLD VALIDATION GATEWAY"
- Tab name "BTM NETWORK" → "BTM COORDINATION LAYER"
- "MESH INTEGRITY FEED" panel title → "DISTRIBUTED ENFORCEMENT TELEMETRY"
- "L2 ENFORCEMENT LAYER" cell label → "LAYER 2 PROTOCOL MESH" 
- "AI DEFENSE CORE" cell label → "ADAPTIVE OPTIMIZATION ENGINE"
- "HONEYPOT / ROSE GAS MODEL" tab heading → "DECEPTION LAYER / ATTACKER RESOURCE DRAIN"
- Tab sub-label "Attacker cycle drain engine" → "Threshold-triggered resource exhaustion model"
- Footer: "NAGA SHIELD v2.4.1 — ALL SYSTEMS OPERATIONAL" → "SROS v2.4.1 — ALL NODES OPERATIONAL"

**VaultIntegrity.tsx:**
- Panel label "NETWORK INTEGRITY METER" → already scientific, keep
- "SOVEREIGN CORE ASSETS" → "PROTECTED ASSET REGISTRY"
- "VAULT SEALED — INTEGRITY 100%" → "REGISTRY SEALED — INTEGRITY 100%"
- "⚠ BREACH DETECTED — INTEGRITY COMPROMISED" → "⚠ ANOMALY DETECTED — INTEGRITY DEGRADED"
- "UNTOUCHED" badge → "NOMINAL"
- "COMPROMISED" badge → "DEGRADED"

**DefenseScore.tsx:**
- Panel label "DEFENSE STRENGTH SCORE" → "NETWORK RESILIENCE INDEX"
- Inner gauge label "MESH RESONANCE" → "CONSENSUS HEALTH"
- Metric label "NAGA RESPONSE" → "ENFORCEMENT LATENCY"
- Metric label "SIGNATURES NEUTRALIZED" → keep (already scientific)
- Metric label "CYCLE BURN DELTA" → "RESOURCE CONSUMPTION DELTA"
- Metric label "MESH RESONANCE" (in metrics list) → "CONSENSUS INDEX"

**RootNeuron.tsx:**
- Section title "HASH SIMULATOR" → "SHA-256 PAYLOAD INTEGRITY SIMULATOR"
- Section description: update to use "Threshold Validation Gateway" instead of "root neuron"
- "COMMIT TO SECONDARY LEDGER" button → "REGISTER TO REMEDIATION LEDGER"
- "SECONDARY LEDGER (SESSION)" section title → "REMEDIATION AUDIT LEDGER (SESSION)"
- Empty state: "No entries committed to neuron memory" → "No entries registered to the remediation ledger"
- Ledger column "Signature" header → "Problem Identifier"
- Ledger column "Solution Hash" → "Payload Hash (SHA-256)"
- Ledger column "Pipeline Status" → "Validation Pipeline"
- Pipeline stage DEPLOY button text → "INITIATE PIPELINE"

**CycleManager.tsx:**
- Section title "CYCLE MONITOR" → "COMPUTE RESOURCE MONITOR"
- Section title "ROOT NEURON TOP-UP PIPELINE" → "THRESHOLD-TRIGGERED RESOURCE ALLOCATION PIPELINE"
- Pipeline description paragraph: replace "root neuron" with "threshold validation gateway", replace "sovereign_signer" with "cryptographic authorization node (sovereign_signer)"
- Pipeline phase label "ROOT NEURON VALIDATING" → "CRYPTOGRAPHIC GATEWAY VALIDATION"
- Info block title "AUTONOMOUS TOP-UP PROTOCOL" → "AUTONOMOUS RESOURCE ALLOCATION PROTOCOL"
- Info block "Root Neuron Gate" section title → "Cryptographic Authorization Gate"
- Info block "Dispatch Source" description: "cycle_airdropper.check_cycles() → airdrop" → keep (technical, correct)
- SVG diagram node label "Root Neuron Gate" → "Cryptographic Auth Gate"
- SVG legend entry "Root Neuron Gate (sovereign_signer)" → "Cryptographic Auth Gate (sovereign_signer)"
- SVG diagram title "Sovereign Resonant Mesh" in heading → "Distributed Node Mesh — Autonomous Resource Allocation Flow"

**FailureScenarioLibrary.tsx:**
- Section title "FAILURE SCENARIO LIBRARY" → "AUTONOMOUS REMEDIATION SCENARIO LIBRARY"
- Button "LOAD INTO HASH SIMULATOR" → "LOAD INTO INTEGRITY SIMULATOR"
- Description paragraph: replace "root neuron" with "threshold validation gateway"

**BtmNetworkLayer.tsx:**
- Header title "BTM NETWORK COORDINATION LAYER" → already correct, keep
- Canister role mapping: security roles shown with strikethrough → already fine, keep
- "NON-INVASIVE DESIGN PRINCIPLES" section → keep (already scientific)

**NagaShieldPanel (App.tsx inline):**
- Panel title "NAGA SHIELD — LIVE L2 ENFORCEMENT" → "PAYLOAD INTEGRITY ENFORCEMENT — LIVE LAYER 2"
- Panel subtitle (canister ID line) → keep as-is
- Status badge label uses `telemetry.meshIntegrity` (live data) → keep
- Metric cell "ENFORCEMENT STATE" → keep
- Metric cell "ACTIVE INTERCEPT TRAPS" → keep
- Metric cell "NEUTRALIZED SIGNATURES" → keep
- DRE proof section label "DRE PROOF" → "ON-CHAIN ENFORCEMENT PROOF"
- Button label "LIVE FIRE TEST" → "LIVE VALIDATION TEST"
- State label "HANDSHAKE ACCEPTED — SHIELD ACTIVE" → "HANDSHAKE ACCEPTED — ENFORCEMENT ACTIVE"
- State label "HANDSHAKE REJECTED — INTERCEPT TRIGGERED" → "HANDSHAKE REJECTED — ENFORCEMENT TRIGGERED"

### Remove
- Any remaining instances of "neuron memory" informal phrasing
- "Root Neuron" as a user-facing label (keep only as the technical internal concept note, not primary label)

## Implementation Plan
1. Update App.tsx: tab names, KPI card labels, panel titles, NagaShieldPanel labels, footer
2. Update VaultIntegrity.tsx: panel labels and status text
3. Update DefenseScore.tsx: panel label, gauge label, metric labels
4. Update RootNeuron.tsx: section titles, button text, ledger column headers, empty state
5. Update CycleManager.tsx: section titles, pipeline phase labels, info block titles, SVG diagram
6. Update FailureScenarioLibrary.tsx: section title, button text, description
7. Validate and build

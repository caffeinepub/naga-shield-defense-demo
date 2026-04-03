# Naga Shield Defense Demo — BTM Network Layer + Root Neuron Failure Sim

## Current State
The dashboard has 8 tabs: OVERVIEW, CANISTERS, HONEYPOT, THREAT LOG, POC OVERVIEW, RAW TELEMETRY, ROOT NEURON, CYCLES. The ROOT NEURON tab has a working Hash Simulator + Secondary Ledger pipeline (VALIDATED → SEALED → DEPLOYED). The CYCLES tab has live canister cycle monitoring with autonomous root neuron top-up pipeline.

## Requested Changes (Diff)

### Add
- **BTM NETWORK LAYER tab** (9th tab): Shows the 17-canister mesh reframed as a Layer 2 non-invasive BTM energy coordination overlay. Panels include: Coordination Flow diagram (grid signal → AI core → shield → signer → execution → ledger), Canister Role Mapping table (security role → BTM energy role), Pre-Approved Action Registry (simulated known grid conditions + pre-hashed responses), and a live Coordination Event Feed. This tab proves the architecture is universal — same mesh, different payload.
- **Failure Scenario Library in ROOT NEURON tab**: A collapsible panel above the Hash Simulator with pre-built failure mode templates. Each scenario includes: a problem signature label, a description of what can go wrong, and a pre-written fix payload. Clicking "Load Scenario" auto-populates the Hash Simulator fields. Scenarios cover: reentrancy attack, cycle drain, signal spoofing, unauthorized dispatch, threshold breach, node dropout, hash mismatch, ledger desync. User can compute hash, commit, and simulate autonomous deployment from any loaded scenario.

### Modify
- ROOT NEURON tab: Add Failure Scenario Library panel above the existing Hash Simulator.
- App.tsx tab list: Add "BTM NETWORK" as a new tab between CYCLES and RAW TELEMETRY (or at end).

### Remove
- Nothing removed.

## Implementation Plan
1. Create `src/frontend/src/components/FailureScenarioLibrary.tsx` — collapsible panel with 8 pre-coded failure scenarios, each with Load button that populates parent state.
2. Update `RootNeuron.tsx` — accept optional `onLoadScenario` callback and render FailureScenarioLibrary above the Hash Simulator, passing loaded scenario data into the hash simulator fields.
3. Create `src/frontend/src/components/BtmNetworkLayer.tsx` — full BTM Layer 2 tab with: coordination flow visualization, canister role mapping table, pre-approved action registry (simulated grid conditions), live coordination event feed (auto-scrolling simulated events showing the pipeline firing).
4. Update `App.tsx` — add "BTM NETWORK" to Tab type and tabs array, add render block for `<BtmNetworkLayer />`.

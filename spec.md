# SROS — Sovereign Resonant Operating System

## Current State

The app is a 9-tab dashboard (`OVERVIEW`, `CANISTERS`, `HONEYPOT`, `THREAT LOG`, `POC OVERVIEW`, `REMEDIATION GATEWAY`, `CYCLES`, `BTM COORDINATION`, `RAW TELEMETRY`) showing live ICP mainnet telemetry from a 17-node Rust canister mesh. A full audit identified the following issues before DOE submission:

1. **PDF export broken** — `GenesisMission.tsx` is imported but never rendered anywhere. The `[ EXPORT PDF ]` button inside it is unreachable.
2. **Sidebar only covers 5 of 9 tabs** — `REMEDIATION GATEWAY`, `CYCLES`, `BTM COORDINATION`, `RAW TELEMETRY` have no sidebar icon shortcuts on mobile/desktop sidebar.
3. **`SYSTEM INTEGRITY` misleading** — hardcoded 100% from simulation hook, displayed as if it's a live KPI with no label.
4. **`ACTIVE THREATS` misleading** — driven by random JavaScript timer, no real canister feed, displayed as a top-level real-time KPI.
5. **Cycle values are seeded estimates** — all canisters except `cycle_airdropper` fail `check_cycles()` and receive a character-code seeded estimate (1–8 TC). The `~` prefix is subtle; estimates should be clearly labeled or shown as UNKNOWN.
6. **`NAGA RESPONSE` label** — still uses symbolic product name in right sidebar; should use scientific equivalent.
7. **RootNeuron deploy pipeline** — `simulateDeployment()` uses only `setTimeout`, no live canister call. Should call `sovereign_signer.get_public_key()` as the root neuron gate step (same as `CycleManager` already does).
8. **BTM Coordination Feed** — auto-fires from hardcoded templates every 15s, no `[SIMULATION]` label on the feed itself.
9. **App title** — still "NAGA SHIELD" in header. Needs to be renamed to scientific/DOE-appropriate name.

## Requested Changes (Diff)

### Add
- Import and render `<GenesisMission>` in the `POC OVERVIEW` tab, passing `sovereignMetrics` from `liveData.sovereignCoreMetrics` and `isControllerAuthenticated` from `liveData.isControllerAuthenticated`.
- Sidebar icon entries for all 4 missing tabs: `REMEDIATION GATEWAY` (use `FlaskConical` or `Activity` icon), `CYCLES` (use `BatteryMedium`), `BTM COORDINATION` (use `Network`), `RAW TELEMETRY` (use `Terminal`).
- `[PHASE 1 CONCEPTUAL]` amber badge label next to `SYSTEM INTEGRITY` KPI card value.
- `[PHASE 1 CONCEPTUAL]` amber badge label next to `ACTIVE THREATS` KPI card value.
- `[SIMULATION]` small amber tag on the BTM Coordination Event Feed header in `BtmNetworkLayer.tsx`.
- Add a live `sovereign_signer.get_public_key()` call as Step 2 (Integrity Gate) in `RootNeuron.tsx` `simulateDeployment()` — same pattern as `CycleManager.tsx` `triggerTopUp()`. Show canister ID, result, and fallback if unreachable.

### Modify
- **App header title**: Change `NAGA SHIELD` → `SROS` and subtitle `LAYER 2 SECURITY DEFENSE SYSTEM` → `SOVEREIGN RESONANT OPERATING SYSTEM · ICP MAINNET`.
- **Right sidebar `NAGA RESPONSE` label**: Change to `DISPATCH LATENCY` with a `[SIM]` suffix tag in small muted text (value is simulated).
- **CycleManager**: Canisters that cannot be queried (error !== 'estimated from cycle_airdropper') should show status `UNKNOWN` with label `NO QUERY METHOD` instead of fabricated HEALTHY/LOW/CRITICAL from seeded values. Only `cycle_airdropper` should show a real bar; others should show gray `UNKNOWN` bars clearly labeled.
- **`POC OVERVIEW` tab header text**: Update from `PROOF OF CONCEPT — LAYER 2 SECURITY FRAMEWORK` to `SROS — SOVEREIGN COORDINATION MESH · PROOF OF CONCEPT` and subtitle to `ICP Mainnet · 17-Node Autonomous Canister Suite · DOE Phase 1 Submission`.

### Remove
- Nothing to remove — all existing components stay. Only labels and wiring change.

## Implementation Plan

1. **App.tsx**
   - Change header title strings
   - Change `NAGA RESPONSE` → `DISPATCH LATENCY [SIM]` in right sidebar
   - Expand `sidebarIcons` array to include all 9 tabs with appropriate Lucide icons (import `BatteryMedium`, `Network`, `Terminal`, `FlaskConical` or similar)
   - Add `[PHASE 1 CONCEPTUAL]` amber inline badge to SYSTEM INTEGRITY and ACTIVE THREATS KPI cards
   - Import `GenesisMission` and render it in `POC OVERVIEW` tab block, above or replacing the existing VaultIntegrity/DefenseScore grid
   - Update POC OVERVIEW tab header text

2. **RootNeuron.tsx**
   - In `simulateDeployment()`, add a real `sovereign_signer.get_public_key()` call using the same agent pattern from `canisters.ts`. If it resolves with Ok, show CONFIRMED [LIVE]; if it fails, show CONFIRMED [FALLBACK]. This replaces the first pure `setTimeout` step.

3. **CycleManager.tsx**
   - Change the seed/estimate fallback logic: instead of setting `error = 'estimated'` and assigning a fake TC value, set `status = 'UNKNOWN'` and `error = 'no query method'`. Remove the seeded cycles calculation. Show these canisters with a gray bar labeled `UNKNOWN — NO QUERY METHOD` instead of a colored health bar.

4. **BtmNetworkLayer.tsx**
   - Add a small `[SIMULATION]` amber badge to the Coordination Event Feed panel header.

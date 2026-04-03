# SROS BTM Network — Synthetic Trigger Panel

## Current State
BtmNetworkLayer.tsx has a Pre-Approved Action Registry with a TRIGGER button that runs a frontend-only simulation (client-side state transitions: SEALED → TRIGGERED → VALIDATING → DEPLOYED). The sovereign_signer call during VALIDATING is a fire-and-forget fetch that doesn't surface a real response.

The canisters.ts file has verified IDL factories and actor helpers for all 17 live canisters. `sovereign_signer` exposes `get_public_key()` as a live query.

## Requested Changes (Diff)

### Add
- **Synthetic Trigger Panel** — new section in BtmNetworkLayer.tsx, placed ABOVE the Pre-Approved Action Registry
- **Condition Selector** — dropdown with 5 options: PEAK_DEMAND, FREQUENCY_DEVIATION, BROWNOUT, PRICE_SPIKE, DEMAND_RESPONSE
- **[INJECT CONDITION] button** — calls `naga_shield.force_condition(condition)` if the method exists; falls back gracefully if not yet deployed (canister doesn't have the method yet)
- **3-Step Live Verification Checklist** — renders live as each step clears:
  1. DETECTION — threshold recognized (polls `naga_shield.get_status()` — already deployed)
  2. INTEGRITY CHECK — hash fetched and compared (calls `sovereign_signer.get_public_key()` live on-chain — already deployed)
  3. UNSEAL EVENT — registry transitions SEALED → ACTIVE (triggers the matching condition row in the registry below)
- **Per-step timestamps** — each step shows exact time it cleared, and which canister responded
- **Live on-chain response display** — step 2 shows the actual hex key returned from sovereign_signer (truncated)
- **Graceful fallback** — if `force_condition` method isn't deployed yet, steps 1 and 3 simulate while step 2 makes a real on-chain call to sovereign_signer
- **"PHASE 1 CONCEPTUAL" label** — clearly labels the synthetic trigger as a test harness for DOE reviewers

### Modify
- **triggerCondition function** — wire step 2 to actually call `getSovereignSignerActor().get_public_key()` and display the real response
- **Registry TRIGGER button** — when Synthetic Trigger fires a condition, it also auto-triggers the matching registry row to show the full pipeline

### Remove
- Nothing removed

## Implementation Plan
1. Add `SyntheticTriggerPanel` component inline in BtmNetworkLayer.tsx
2. State: `selectedCondition`, `isInjecting`, `checklistSteps` array (3 steps, each with status/timestamp/canisterResponse)
3. On INJECT: run 3 steps sequentially — step 1 calls naga_shield.get_status() live, step 2 calls sovereign_signer.get_public_key() live and shows raw response, step 3 auto-fires matching registry row
4. Show real on-chain response from sovereign_signer in step 2 (hex-encoded public key truncated to 24 chars)
5. Hash map: condition string → registry ID + expected hash (matches INITIAL_CONDITIONS)
6. Wire into BtmNetworkLayer — expose `triggerCondition` via useRef/callback so SyntheticPanel can call it

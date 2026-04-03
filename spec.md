# Naga Shield Defense Demo

## Current State
SROS Layer 2 Security Mesh dashboard with 17 live-polled ICP mainnet canisters. All method signatures previously verified except `naga_shield`, which was incorrectly calling `get_telemetry()` — a method that does not exist on the deployed canister. The live telemetry has been silently failing since integration.

## Requested Changes (Diff)

### Add
- `validate_handshake(text) -> bool` to the `naga_shield` IDL and actor interface
- `LiveFireTest` component: a button that calls `validate_handshake("SROS_PROBE_GENESIS_MISSION")` on the real mainnet canister and displays the live boolean result with timestamp — provides real, on-chain, demonstrable proof of the DRE enforcement mechanism
- `getNagaShieldActor` imported into `App.tsx` for the LiveFireTest component

### Modify
- `naga_shield` IDL: replace `get_telemetry()` (wrong method name, was silently failing) with verified `get_status() -> ShieldStatus` where ShieldStatus = `{ mesh_integrity: text, active_traps: nat64, neutralized_threats: nat64 }`
- `NagaShieldStatus` interface replaces `NagaShieldTelemetry` with correct fields: `mesh_integrity`, `active_traps`, `neutralized_threats`
- `NagaShieldActor` interface: updated methods to `get_status()` and `validate_handshake(text)`
- `useLiveCanisters`: calls `get_status()` instead of `get_telemetry()`; parses `meshIntegrity`, `activeTraps`, `neutralizedThreats`
- All field references across `App.tsx`, `CanisterGrid.tsx`: updated to new field names
- `NagaShieldPanel` now renders the `LiveFireTest` button below the metrics grid
- CALL_META entry for naga_shield updated to reflect `get_status()` in the Raw Telemetry tab

### Remove
- `NagaShieldTelemetry` type (replaced by `NagaShieldStatus`)
- Old `get_telemetry` IDL definition

## Implementation Plan
1. Fix `nagaShieldIDL` in `canisters.ts` to match verified Candid interface
2. Replace `NagaShieldTelemetry` with `NagaShieldStatus` type; update `NagaShieldActor`
3. Update `useLiveCanisters` to call `get_status()` and parse correct fields
4. Rename all field references in `App.tsx` and `CanisterGrid.tsx`
5. Add `LiveFireTest` stateful component to `App.tsx` (idle/firing/accepted/rejected/error states)
6. Wire `LiveFireTest` into `NagaShieldPanel` below the metrics row

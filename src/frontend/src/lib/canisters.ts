import { Actor, HttpAgent } from "@dfinity/agent";
import type { IDL } from "@dfinity/candid";

// Anonymous agent — no cert verification needed for dashboard reads
export const agent = new HttpAgent({
  host: "https://ic0.app",
  verifyQuerySignatures: false,
});

// ─── Verified Controller Principal ──────────────────────────────────────────
export const VERIFIED_CONTROLLER_PRINCIPAL =
  "lvbkk-rrmnk-by44n-wqcwf-iyzhk-jj2bs-hz7wq-f4uiv-4r2z6-lotjl-bqe";

// ─── Canister IDs (non-financial instruments only) ──────────────────────────
export const CANISTER_IDS = {
  adaptive_ai_core: "ra6wc-liaaa-aaaaa-qgxxq-cai",
  alien_analytics: "4hhfs-gaaaa-aaaaa-qgw4a-cai",
  cycle_airdropper: "xpb7d-eyaaa-aaaaa-qgq5a-cai",
  drone_control: "ttbvc-dqaaa-aaaaa-qgxza-cai",
  ghost_liquidity: "uod36-mqaaa-aaaaa-qgxla-cai",
  ghost_sniper: "4jfi2-5qaaa-aaaaa-qgw5a-cai",
  naga_execution: "ha3fs-xqaaa-aaaaa-qgyaa-cai",
  naga_shield: "f2hno-jaaaa-aaaaa-qgypa-cai",
  seal_canister: "tuatw-oiaaa-aaaaa-qgxzq-cai",
  self_optimizer: "rh7qw-gqaaa-aaaaa-qgxxa-cai",
  sentience_relay: "uabww-xaaaa-aaaaa-qgxka-cai",
  simulation_night: "tggep-cyaaa-aaaaa-qgx2q-cai",
  sovereign_core: "tbhc3-paaaa-aaaaa-qgx2a-cai",
  sovereign_signer: "43d7d-raaaa-aaaaa-qgw6a-cai",
  sros_dashboard: "hh2dg-2iaaa-aaaaa-qgyaq-cai",
  temporal_shadow: "uhaqc-2yaaa-aaaaa-qgxkq-cai",
  whale_sonar: "rj556-5aaaa-aaaaa-qgxwa-cai",
} as const;

// ─── IDL interface factories (ALL VERIFIED from candid:service metadata) ────

// adaptive_ai_core — VERIFIED
// sync_market_signals() -> text
const adaptiveAiCoreIDL: IDL.InterfaceFactory = ({ IDL: I }) =>
  I.Service({
    sync_market_signals: I.Func([], [I.Text], ["query"]),
  });

// alien_analytics — VERIFIED
// analyze_pattern(blob) -> text  [update call, requires input blob]
const alienAnalyticsIDL: IDL.InterfaceFactory = ({ IDL: I }) =>
  I.Service({
    analyze_pattern: I.Func([I.Vec(I.Nat8)], [I.Text], []),
  });

// cycle_airdropper — VERIFIED
// check_cycles() -> nat64
const cycleAirdropperIDL: IDL.InterfaceFactory = ({ IDL: I }) =>
  I.Service({
    check_cycles: I.Func([], [I.Nat64], ["query"]),
  });

// drone_control — VERIFIED
// status() -> text
const droneControlIDL: IDL.InterfaceFactory = ({ IDL: I }) =>
  I.Service({
    status: I.Func([], [I.Text], ["query"]),
  });

// ghost_liquidity — VERIFIED
// fragment_trade(nat64) -> vec nat64  [update call, requires input]
const ghostLiquidityIDL: IDL.InterfaceFactory = ({ IDL: I }) =>
  I.Service({
    fragment_trade: I.Func([I.Nat64], [I.Vec(I.Nat64)], []),
  });

// ghost_sniper — VERIFIED
// trigger_trade(text, nat64) -> text  [update call, requires input]
const ghostSniperIDL: IDL.InterfaceFactory = ({ IDL: I }) =>
  I.Service({
    trigger_trade: I.Func([I.Text, I.Nat64], [I.Text], []),
  });

// naga_execution — VERIFIED
// check_mesh_health() -> text  [query]
// system_autonomous_strike() -> text  [update — bonus method]
const nagaExecutionIDL: IDL.InterfaceFactory = ({ IDL: I }) =>
  I.Service({
    check_mesh_health: I.Func([], [I.Text], ["query"]),
    system_autonomous_strike: I.Func([], [I.Text], []),
  });

// naga_shield — VERIFIED (candid:service confirmed April 2026)
// get_status() -> ShieldStatus  [query]
// get_current_status() -> text  [query — returns e.g. "NORMAL" or "BROWNOUT"]
// validate_handshake(text) -> bool  [update — LIVE FIRE TEST]
// force_condition(text) -> variant { ok: text; err: text }  [update — SYNTHETIC TRIGGER]
const nagaShieldIDL: IDL.InterfaceFactory = ({ IDL: I }) => {
  const ShieldStatus = I.Record({
    mesh_integrity: I.Text,
    active_traps: I.Nat64,
    neutralized_threats: I.Nat64,
  });
  const ForceResult = I.Variant({ ok: I.Text, err: I.Text });
  return I.Service({
    get_status: I.Func([], [ShieldStatus], ["query"]),
    get_current_status: I.Func([], [I.Text], ["query"]),
    validate_handshake: I.Func([I.Text], [I.Bool], []),
    force_condition: I.Func([I.Text], [ForceResult], []),
  });
};

// seal_canister — VERIFIED
// verify_seal() -> bool
const sealCanisterIDL: IDL.InterfaceFactory = ({ IDL: I }) =>
  I.Service({
    verify_seal: I.Func([], [I.Bool], ["query"]),
  });

// self_optimizer — VERIFIED
// check() -> text
const selfOptimizerIDL: IDL.InterfaceFactory = ({ IDL: I }) =>
  I.Service({
    check: I.Func([], [I.Text], ["query"]),
  });

// sentience_relay — VERIFIED
// ingest_market_heartbeat() -> text  [update]
const sentienceRelayIDL: IDL.InterfaceFactory = ({ IDL: I }) =>
  I.Service({
    ingest_market_heartbeat: I.Func([], [I.Text], []),
  });

// simulation_night — VERIFIED
// get_night_status() -> text  [query]
// simulate_15m_close(blob) -> text  [update — bonus method, requires input]
const simulationNightIDL: IDL.InterfaceFactory = ({ IDL: I }) =>
  I.Service({
    get_night_status: I.Func([], [I.Text], ["query"]),
    simulate_15m_close: I.Func([I.Vec(I.Nat8)], [I.Text], []),
  });

// sovereign_core — VERIFIED
// get_core_metrics() -> text
const sovereignCoreIDL: IDL.InterfaceFactory = ({ IDL: I }) =>
  I.Service({
    get_core_metrics: I.Func([], [I.Text], ["query"]),
  });

// sovereign_signer — VERIFIED
// get_public_key() -> variant { Ok: blob; Err: text }
const sovereignSignerIDL: IDL.InterfaceFactory = ({ IDL: I }) => {
  const Result = I.Variant({ Ok: I.Vec(I.Nat8), Err: I.Text });
  return I.Service({
    get_public_key: I.Func([], [Result], ["query"]),
    add_authorized_caller: I.Func(
      [I.Principal],
      [I.Variant({ Ok: I.Text, Err: I.Text })],
      [],
    ),
  });
};

// sros_dashboard — VERIFIED
// check_mesh_health() -> text  [query]
// get_full_system_snapshot() -> text  [update — bonus method]
const srosDashboardIDL: IDL.InterfaceFactory = ({ IDL: I }) =>
  I.Service({
    check_mesh_health: I.Func([], [I.Text], ["query"]),
    get_full_system_snapshot: I.Func([], [I.Text], []),
  });

// temporal_shadow — VERIFIED
// recall_void() -> blob  [query]
// store_void_data(blob) -> ()  [update — bonus method, requires input]
const temporalShadowIDL: IDL.InterfaceFactory = ({ IDL: I }) =>
  I.Service({
    recall_void: I.Func([], [I.Vec(I.Nat8)], ["query"]),
    store_void_data: I.Func([I.Vec(I.Nat8)], [], []),
  });

// whale_sonar — VERIFIED
// check() -> text
const whaleSonarIDL: IDL.InterfaceFactory = ({ IDL: I }) =>
  I.Service({
    check: I.Func([], [I.Text], ["query"]),
  });

// ─── Typed actor interfaces ──────────────────────────────────────────────────

export interface AdaptiveAiCoreActor {
  sync_market_signals: () => Promise<string>;
}

export interface AlienAnalyticsActor {
  analyze_pattern: (blob: Uint8Array | number[]) => Promise<string>;
}

export interface CycleAirdropperActor {
  check_cycles: () => Promise<bigint>;
}

export interface DroneControlActor {
  status: () => Promise<string>;
}

export interface GhostLiquidityActor {
  fragment_trade: (n: bigint) => Promise<bigint[]>;
}

export interface GhostSniperActor {
  trigger_trade: (mode: string, amount: bigint) => Promise<string>;
}

export interface NagaExecutionActor {
  check_mesh_health: () => Promise<string>;
  system_autonomous_strike: () => Promise<string>;
}

export interface NagaShieldStatus {
  mesh_integrity: string;
  active_traps: bigint;
  neutralized_threats: bigint;
}

export interface NagaShieldActor {
  get_status: () => Promise<NagaShieldStatus>;
  get_current_status: () => Promise<string>;
  validate_handshake: (payload: string) => Promise<boolean>;
  force_condition: (
    condition: string,
  ) => Promise<{ ok: string } | { err: string }>;
}

export interface SealCanisterActor {
  verify_seal: () => Promise<boolean>;
}

export interface SelfOptimizerActor {
  check: () => Promise<string>;
}

export interface SentienceRelayActor {
  ingest_market_heartbeat: () => Promise<string>;
}

export interface SimulationNightActor {
  get_night_status: () => Promise<string>;
  simulate_15m_close: (blob: Uint8Array | number[]) => Promise<string>;
}

export interface SovereignCoreActor {
  get_core_metrics: () => Promise<string>;
}

export type SovereignSignerResult = { Ok: number[] } | { Err: string };

export interface SovereignSignerActor {
  get_public_key: () => Promise<SovereignSignerResult>;
  add_authorized_caller: (
    principal: unknown,
  ) => Promise<{ Ok: string } | { Err: string }>;
}

export interface SrosDashboardActor {
  check_mesh_health: () => Promise<string>;
  get_full_system_snapshot: () => Promise<string>;
}

export interface TemporalShadowActor {
  recall_void: () => Promise<number[]>;
  store_void_data: (blob: Uint8Array | number[]) => Promise<void>;
}

export interface WhaleSonarActor {
  check: () => Promise<string>;
}

// ─── Actor factories ─────────────────────────────────────────────────────────

function createActorFor<T>(
  idlFactory: IDL.InterfaceFactory,
  canisterId: string,
): T {
  return Actor.createActor<T>(idlFactory, { agent, canisterId });
}

export function getAdaptiveAiCoreActor(): AdaptiveAiCoreActor {
  return createActorFor<AdaptiveAiCoreActor>(
    adaptiveAiCoreIDL,
    CANISTER_IDS.adaptive_ai_core,
  );
}

export function getAlienAnalyticsActor(): AlienAnalyticsActor {
  return createActorFor<AlienAnalyticsActor>(
    alienAnalyticsIDL,
    CANISTER_IDS.alien_analytics,
  );
}

export function getCycleAirdropperActor(): CycleAirdropperActor {
  return createActorFor<CycleAirdropperActor>(
    cycleAirdropperIDL,
    CANISTER_IDS.cycle_airdropper,
  );
}

export function getDroneControlActor(): DroneControlActor {
  return createActorFor<DroneControlActor>(
    droneControlIDL,
    CANISTER_IDS.drone_control,
  );
}

export function getGhostLiquidityActor(): GhostLiquidityActor {
  return createActorFor<GhostLiquidityActor>(
    ghostLiquidityIDL,
    CANISTER_IDS.ghost_liquidity,
  );
}

export function getGhostSniperActor(): GhostSniperActor {
  return createActorFor<GhostSniperActor>(
    ghostSniperIDL,
    CANISTER_IDS.ghost_sniper,
  );
}

export function getNagaExecutionActor(): NagaExecutionActor {
  return createActorFor<NagaExecutionActor>(
    nagaExecutionIDL,
    CANISTER_IDS.naga_execution,
  );
}

export function getNagaShieldActor(): NagaShieldActor {
  return createActorFor<NagaShieldActor>(
    nagaShieldIDL,
    CANISTER_IDS.naga_shield,
  );
}

export function getSealCanisterActor(): SealCanisterActor {
  return createActorFor<SealCanisterActor>(
    sealCanisterIDL,
    CANISTER_IDS.seal_canister,
  );
}

export function getSelfOptimizerActor(): SelfOptimizerActor {
  return createActorFor<SelfOptimizerActor>(
    selfOptimizerIDL,
    CANISTER_IDS.self_optimizer,
  );
}

export function getSentienceRelayActor(): SentienceRelayActor {
  return createActorFor<SentienceRelayActor>(
    sentienceRelayIDL,
    CANISTER_IDS.sentience_relay,
  );
}

export function getSimulationNightActor(): SimulationNightActor {
  return createActorFor<SimulationNightActor>(
    simulationNightIDL,
    CANISTER_IDS.simulation_night,
  );
}

export function getSovereignCoreActor(): SovereignCoreActor {
  return createActorFor<SovereignCoreActor>(
    sovereignCoreIDL,
    CANISTER_IDS.sovereign_core,
  );
}

export function getSovereignSignerActor(): SovereignSignerActor {
  return createActorFor<SovereignSignerActor>(
    sovereignSignerIDL,
    CANISTER_IDS.sovereign_signer,
  );
}

export function getSrosDashboardActor(): SrosDashboardActor {
  return createActorFor<SrosDashboardActor>(
    srosDashboardIDL,
    CANISTER_IDS.sros_dashboard,
  );
}

export function getTemporalShadowActor(): TemporalShadowActor {
  return createActorFor<TemporalShadowActor>(
    temporalShadowIDL,
    CANISTER_IDS.temporal_shadow,
  );
}

export function getWhaleSonarActor(): WhaleSonarActor {
  return createActorFor<WhaleSonarActor>(
    whaleSonarIDL,
    CANISTER_IDS.whale_sonar,
  );
}

import { useCallback, useEffect, useRef, useState } from "react";
import {
  getAdaptiveAiCoreActor,
  getAlienAnalyticsActor,
  getCycleAirdropperActor,
  getDroneControlActor,
  getGhostLiquidityActor,
  getGhostSniperActor,
  getNagaExecutionActor,
  getNagaShieldActor,
  getSealCanisterActor,
  getSelfOptimizerActor,
  getSentienceRelayActor,
  getSimulationNightActor,
  getSovereignCoreActor,
  getSovereignSignerActor,
  getSrosDashboardActor,
  getTemporalShadowActor,
  getWhaleSonarActor,
} from "../lib/canisters";
import type { NagaShieldStatus, SovereignSignerResult } from "../lib/canisters";

export interface RawResult {
  canisterId: string;
  method: string;
  status: "fulfilled" | "rejected";
  rawValue: string;
}

export interface LiveCanisterData {
  // ── Verified query-only (no args) ────────────────────────────────────────
  adaptiveAiSignals: string | null;
  cycleAirdropperCycles: bigint | null;
  droneControlStatus: string | null;
  nagaMeshHealth: string | null;
  sealVerified: boolean | null;
  selfOptimizerStatus: string | null;
  simulationNightStatus: string | null;
  sovereignMetrics: string | null;
  sovereignSignerKey: SovereignSignerResult | null;
  srosMeshHealth: string | null;
  temporalVoidData: string | null;
  whaleSonarStatus: string | null;
  // ── Verified update methods (no args) ───────────────────────────────────
  sentienceRelayResult: string | null;
  nagaAutonomousStrike: string | null;
  srosSystemSnapshot: string | null;
  // ── Verified update methods (require input — probe calls) ───────────────
  alienAnalyticsResult: string | null;
  ghostLiquidityResult: bigint[] | null;
  ghostSniperResult: string | null;
  // ── CONFIRMED LIVE ───────────────────────────────────────────────────────
  nagaShieldTelemetry: {
    meshIntegrity: string;
    activeTraps: number;
    neutralizedThreats: number;
  } | null;
  // ── Raw Inspector Data ───────────────────────────────────────────────────
  rawResults: Record<string, RawResult>;
  meshResonanceScore: number; // 0-100 based on fulfilled/total
  cycleBurnDelta: number; // cumulative cycle burn across poll intervals
  // ── Meta ─────────────────────────────────────────────────────────────────
  isControllerAuthenticated: boolean;
  lastFetched: Date | null;
  isLoading: boolean;
  hasError: boolean;
}

const POLL_INTERVAL_MS = 30_000;
const TOTAL_CANISTERS = 19;

// Canister metadata for raw inspector — indexed matching Promise.allSettled order
const CALL_META = [
  {
    name: "cycle_airdropper",
    id: "xpb7d-eyaaa-aaaaa-qgq5a-cai",
    method: "check_cycles()",
  },
  {
    name: "drone_control",
    id: "ttbvc-dqaaa-aaaaa-qgxza-cai",
    method: "status()",
  },
  {
    name: "naga_execution",
    id: "ha3fs-xqaaa-aaaaa-qgyaa-cai",
    method: "check_mesh_health()",
  },
  {
    name: "seal_canister",
    id: "tuatw-oiaaa-aaaaa-qgxzq-cai",
    method: "verify_seal()",
  },
  {
    name: "self_optimizer",
    id: "rh7qw-gqaaa-aaaaa-qgxxa-cai",
    method: "check()",
  },
  {
    name: "simulation_night",
    id: "tggep-cyaaa-aaaaa-qgx2q-cai",
    method: "get_night_status()",
  },
  {
    name: "sovereign_core",
    id: "tbhc3-paaaa-aaaaa-qgx2a-cai",
    method: "get_core_metrics()",
  },
  {
    name: "sros_dashboard",
    id: "hh2dg-2iaaa-aaaaa-qgyaq-cai",
    method: "check_mesh_health()",
  },
  {
    name: "temporal_shadow",
    id: "uhaqc-2yaaa-aaaaa-qgxkq-cai",
    method: "recall_void()",
  },
  { name: "whale_sonar", id: "rj556-5aaaa-aaaaa-qgxwa-cai", method: "check()" },
  {
    name: "naga_shield",
    id: "f2hno-jaaaa-aaaaa-qgypa-cai",
    method: "get_status()",
  },
  {
    name: "adaptive_ai_core",
    id: "ra6wc-liaaa-aaaaa-qgxxq-cai",
    method: "sync_market_signals()",
  },
  {
    name: "sovereign_signer",
    id: "43d7d-raaaa-aaaaa-qgw6a-cai",
    method: "get_public_key()",
  },
  {
    name: "sentience_relay",
    id: "uabww-xaaaa-aaaaa-qgxka-cai",
    method: "ingest_market_heartbeat()",
  },
  {
    name: "naga_execution_strike",
    id: "ha3fs-xqaaa-aaaaa-qgyaa-cai",
    method: "system_autonomous_strike()",
  },
  {
    name: "sros_dashboard_snap",
    id: "hh2dg-2iaaa-aaaaa-qgyaq-cai",
    method: "get_full_system_snapshot()",
  },
  {
    name: "alien_analytics",
    id: "4hhfs-gaaaa-aaaaa-qgw4a-cai",
    method: "analyze_pattern(probe)",
  },
  {
    name: "ghost_liquidity",
    id: "uod36-mqaaa-aaaaa-qgxla-cai",
    method: "signature_intercept(0)",
  },
  {
    name: "ghost_sniper",
    id: "4jfi2-5qaaa-aaaaa-qgw5a-cai",
    method: "intercept_probe(0)",
  },
] as const;

function serializeValue(v: unknown): string {
  try {
    return JSON.stringify(v, (_key, val) =>
      typeof val === "bigint" ? val.toString() : val,
    );
  } catch {
    return String(v);
  }
}

async function fetchAll(): Promise<{
  parsed: Omit<
    LiveCanisterData,
    | "lastFetched"
    | "isLoading"
    | "hasError"
    | "isControllerAuthenticated"
    | "rawResults"
    | "meshResonanceScore"
    | "cycleBurnDelta"
  >;
  rawResults: Record<string, RawResult>;
  meshResonanceScore: number;
  isControllerAuthenticated: boolean;
}> {
  const results = await Promise.allSettled([
    getCycleAirdropperActor().check_cycles(), // 0
    getDroneControlActor().status(), // 1
    getNagaExecutionActor().check_mesh_health(), // 2
    getSealCanisterActor().verify_seal(), // 3
    getSelfOptimizerActor().check(), // 4
    getSimulationNightActor().get_night_status(), // 5
    getSovereignCoreActor().get_core_metrics(), // 6
    getSrosDashboardActor().check_mesh_health(), // 7
    getTemporalShadowActor().recall_void(), // 8
    getWhaleSonarActor().check(), // 9
    getNagaShieldActor().get_status(), // 10
    getAdaptiveAiCoreActor().sync_market_signals(), // 11
    getSovereignSignerActor().get_public_key(), // 12
    getSentienceRelayActor().ingest_market_heartbeat(), // 13
    getNagaExecutionActor().system_autonomous_strike(), // 14
    getSrosDashboardActor().get_full_system_snapshot(), // 15
    getAlienAnalyticsActor().analyze_pattern(new Uint8Array([])), // 16
    getGhostLiquidityActor().fragment_trade(BigInt(0)), // 17
    getGhostSniperActor().trigger_trade("probe", BigInt(0)), // 18
  ]);

  // Build raw results map
  const rawResults: Record<string, RawResult> = {};
  results.forEach((r, i) => {
    const meta = CALL_META[i];
    if (!meta) return;
    rawResults[meta.name] = {
      canisterId: meta.id,
      method: meta.method,
      status: r.status,
      rawValue:
        r.status === "fulfilled"
          ? serializeValue(r.value)
          : ((r as PromiseRejectedResult).reason?.message ??
            String((r as PromiseRejectedResult).reason)),
    };
  });

  // Mesh resonance: fulfilled / total
  const fulfilledCount = results.filter((r) => r.status === "fulfilled").length;
  const meshResonanceScore = Math.round(
    (fulfilledCount / results.length) * 100,
  );

  // No-wallet controller auth: sovereign_signer is live and returns Ok blob
  const signerResult = results[12];
  const isControllerAuthenticated =
    signerResult.status === "fulfilled" &&
    "Ok" in (signerResult.value as { Ok?: unknown }) &&
    Array.isArray((signerResult.value as { Ok?: unknown }).Ok);

  const get = <T>(idx: number): T | null => {
    const r = results[idx];
    return r.status === "fulfilled" ? (r.value as T) : null;
  };

  // Temporal shadow blob -> UTF-8 text
  let temporalVoidData: string | null = null;
  const rawTemporal = get<number[]>(8);
  if (rawTemporal !== null) {
    try {
      temporalVoidData = new TextDecoder("utf-8").decode(
        new Uint8Array(rawTemporal),
      );
    } catch {
      temporalVoidData = null;
    }
  }

  // Naga Shield status (VERIFIED: get_status returns ShieldStatus)
  let nagaShieldTelemetry: LiveCanisterData["nagaShieldTelemetry"] = null;
  const rawNagaShield = get<NagaShieldStatus>(10);
  if (rawNagaShield !== null) {
    try {
      nagaShieldTelemetry = {
        meshIntegrity: rawNagaShield.mesh_integrity,
        activeTraps: Number(rawNagaShield.active_traps),
        neutralizedThreats: Number(rawNagaShield.neutralized_threats),
      };
    } catch {
      nagaShieldTelemetry = null;
    }
  }

  return {
    parsed: {
      cycleAirdropperCycles: get<bigint>(0),
      droneControlStatus: get<string>(1),
      nagaMeshHealth: get<string>(2),
      sealVerified: get<boolean>(3),
      selfOptimizerStatus: get<string>(4),
      simulationNightStatus: get<string>(5),
      sovereignMetrics: get<string>(6),
      srosMeshHealth: get<string>(7),
      temporalVoidData,
      whaleSonarStatus: get<string>(9),
      nagaShieldTelemetry,
      adaptiveAiSignals: get<string>(11),
      sovereignSignerKey: get<SovereignSignerResult>(12),
      sentienceRelayResult: get<string>(13),
      nagaAutonomousStrike: get<string>(14),
      srosSystemSnapshot: get<string>(15),
      alienAnalyticsResult: get<string>(16),
      ghostLiquidityResult: get<bigint[]>(17),
      ghostSniperResult: get<string>(18),
    },
    rawResults,
    meshResonanceScore,
    isControllerAuthenticated,
  };
}

export function useLiveCanisters(): LiveCanisterData {
  const [data, setData] = useState<
    Omit<
      LiveCanisterData,
      | "lastFetched"
      | "isLoading"
      | "hasError"
      | "isControllerAuthenticated"
      | "rawResults"
      | "meshResonanceScore"
      | "cycleBurnDelta"
    >
  >({
    adaptiveAiSignals: null,
    cycleAirdropperCycles: null,
    droneControlStatus: null,
    nagaMeshHealth: null,
    sealVerified: null,
    selfOptimizerStatus: null,
    simulationNightStatus: null,
    sovereignMetrics: null,
    sovereignSignerKey: null,
    srosMeshHealth: null,
    temporalVoidData: null,
    whaleSonarStatus: null,
    sentienceRelayResult: null,
    nagaAutonomousStrike: null,
    srosSystemSnapshot: null,
    alienAnalyticsResult: null,
    ghostLiquidityResult: null,
    ghostSniperResult: null,
    nagaShieldTelemetry: null,
  });
  const [rawResults, setRawResults] = useState<Record<string, RawResult>>({});
  const [meshResonanceScore, setMeshResonanceScore] = useState(0);
  const [cycleBurnDelta, setCycleBurnDelta] = useState(0);
  const [lastFetched, setLastFetched] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isControllerAuthenticated, setIsControllerAuthenticated] =
    useState(false);
  const isFirstFetch = useRef(true);
  const prevCycles = useRef<bigint | null>(null);
  const cumulativeBurn = useRef(0);

  const doFetch = useCallback(async () => {
    if (isFirstFetch.current) setIsLoading(true);
    try {
      const {
        parsed,
        rawResults: raw,
        meshResonanceScore: score,
        isControllerAuthenticated: auth,
      } = await fetchAll();

      // Track cycle burn delta
      if (
        parsed.cycleAirdropperCycles !== null &&
        prevCycles.current !== null
      ) {
        const delta = Math.abs(
          Number(prevCycles.current) - Number(parsed.cycleAirdropperCycles),
        );
        if (delta > 0) cumulativeBurn.current += delta;
      }
      if (parsed.cycleAirdropperCycles !== null) {
        prevCycles.current = parsed.cycleAirdropperCycles;
      }

      const nullCount = Object.values(parsed).filter((v) => v === null).length;
      setHasError(nullCount > TOTAL_CANISTERS / 2);
      setData(parsed);
      setRawResults(raw);
      setMeshResonanceScore(score);
      setCycleBurnDelta(cumulativeBurn.current);
      setLastFetched(new Date());
      setIsControllerAuthenticated(auth);
    } catch {
      setHasError(true);
    } finally {
      if (isFirstFetch.current) {
        setIsLoading(false);
        isFirstFetch.current = false;
      }
    }
  }, []);

  useEffect(() => {
    doFetch();
  }, [doFetch]);
  useEffect(() => {
    const id = setInterval(doFetch, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [doFetch]);

  return {
    ...data,
    rawResults,
    meshResonanceScore,
    cycleBurnDelta,
    lastFetched,
    isLoading,
    hasError,
    isControllerAuthenticated,
  };
}

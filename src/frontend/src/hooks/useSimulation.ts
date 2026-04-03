import { useCallback, useEffect, useRef, useState } from "react";

export type CanisterStatus = "PROTECTED" | "ACTIVE" | "ALERT";
export type ThreatOutcome = "NEUTRALIZED" | "DRAINING" | "BLOCKED";
export type HoneypotPhase = "IDLE" | "ACTIVATING" | "DRAINING" | "NEUTRALIZED";

export interface CanisterState {
  id: string;
  name: string;
  status: CanisterStatus;
  uptime: number;
}

export interface ThreatEntry {
  id: string;
  timestamp: string;
  attackerPrincipal: string;
  targetCanister: string;
  cyclesDrained: number;
  outcome: ThreatOutcome;
}

export interface HoneypotState {
  phase: HoneypotPhase;
  attackerPrincipal: string;
  targetCanister: string;
  drainProgress: number;
  cyclesDraining: number;
  startTime: number;
}

export interface SimulationState {
  canisters: CanisterState[];
  threats: ThreatEntry[];
  honeypot: HoneypotState;
  systemIntegrity: number;
  activeThreats: number;
  totalCyclesDrained: number;
  neutralizedCount: number;
  defenseScore: number;
  nakaResponseTime: number;
  clock: string;
}

// All 17 non-financial canisters
const CANISTER_NAMES = [
  "adaptive_ai_core",
  "alien_analytics",
  "cycle_airdropper",
  "drone_control",
  "ghost_liquidity",
  "ghost_sniper",
  "naga_execution",
  "seal_canister",
  "self_optimizer",
  "sentience_relay",
  "simulation_night",
  "sovereign_core",
  "sovereign_signer",
  "sros_dashboard",
  "temporal_shadow",
  "whale_sonar",
  "naga_shield",
];

const FAKE_PRINCIPALS = [
  "2vxsx-fae",
  "k2t6j-2nvnp-4zjm3-25dtz-6xhaa-c7boj-5gayf-oj3xs-i43lp-teztq-6ae",
  "rrkah-fqaaa-aaaaa-aaaaq-cai",
  "mxzaz-hqaaa-aaaar-qabxq-cai",
  "5qden-jqaaa-aaaar-qajeq-cai",
  "x33ed-h457x-bsgyx-oqxqf-6pzwv-wquxc-bg4rt-vrzfj-cnb7v-gy2uu-cqe",
  "gvbup-jaaaa-aaaaa-qabtq-cai",
  "3xwpq-ziaaa-aaaah-qcn4a-cai",
];

function randomPrincipal() {
  return FAKE_PRINCIPALS[Math.floor(Math.random() * FAKE_PRINCIPALS.length)];
}

function randomCanister() {
  return CANISTER_NAMES[Math.floor(Math.random() * CANISTER_NAMES.length)];
}

function formatTimestamp(d: Date) {
  return `${d.toISOString().replace("T", " ").slice(0, 19)} UTC`;
}

function formatClock(d: Date) {
  return `${d.toUTCString().slice(17, 25)} UTC`;
}

const SEED_THREATS: ThreatEntry[] = [
  {
    id: "t001",
    timestamp: "2026-04-02 08:14:37 UTC",
    attackerPrincipal: "2vxsx-fae",
    targetCanister: "sovereign_core",
    cyclesDrained: 482_000_000,
    outcome: "NEUTRALIZED",
  },
  {
    id: "t002",
    timestamp: "2026-04-02 08:22:11 UTC",
    attackerPrincipal: "rrkah-fqaaa-aaaaa-aaaaq-cai",
    targetCanister: "ghost_liquidity",
    cyclesDrained: 315_500_000,
    outcome: "NEUTRALIZED",
  },
  {
    id: "t003",
    timestamp: "2026-04-02 08:35:48 UTC",
    attackerPrincipal: "mxzaz-hqaaa-aaaar-qabxq-cai",
    targetCanister: "whale_sonar",
    cyclesDrained: 127_000_000,
    outcome: "BLOCKED",
  },
  {
    id: "t004",
    timestamp: "2026-04-02 08:47:02 UTC",
    attackerPrincipal: "5qden-jqaaa-aaaar-qajeq-cai",
    targetCanister: "adaptive_ai_core",
    cyclesDrained: 698_000_000,
    outcome: "NEUTRALIZED",
  },
  {
    id: "t005",
    timestamp: "2026-04-02 09:01:55 UTC",
    attackerPrincipal:
      "k2t6j-2nvnp-4zjm3-25dtz-6xhaa-c7boj-5gayf-oj3xs-i43lp-teztq-6ae",
    targetCanister: "naga_execution",
    cyclesDrained: 55_000_000,
    outcome: "BLOCKED",
  },
];

const SEED_DRAINED = SEED_THREATS.reduce((acc, t) => acc + t.cyclesDrained, 0);
const SEED_NEUTRALIZED = SEED_THREATS.filter(
  (t) => t.outcome === "NEUTRALIZED",
).length;

export function useSimulation(): SimulationState {
  const [canisters, setCanisters] = useState<CanisterState[]>(
    CANISTER_NAMES.map((name) => ({
      id: name,
      name,
      status: name === "naga_execution" ? "ACTIVE" : "PROTECTED",
      uptime: 99.97,
    })),
  );

  const [threats, setThreats] = useState<ThreatEntry[]>(SEED_THREATS);
  const [honeypot, setHoneypot] = useState<HoneypotState>({
    phase: "IDLE",
    attackerPrincipal: "",
    targetCanister: "",
    drainProgress: 0,
    cyclesDraining: 0,
    startTime: 0,
  });
  const [totalCyclesDrained, setTotalCyclesDrained] = useState(SEED_DRAINED);
  const [neutralizedCount, setNeutralizedCount] = useState(SEED_NEUTRALIZED);
  const [activeThreats, setActiveThreats] = useState(0);
  const [defenseScore, setDefenseScore] = useState(0);
  const [nakaResponseTime, setNakaResponseTime] = useState(12);
  const [clock, setClock] = useState(formatClock(new Date()));

  const honeypotRef = useRef(honeypot);
  honeypotRef.current = honeypot;

  useEffect(() => {
    let current = 0;
    const target = 847;
    const step = Math.ceil(target / 60);
    const id = setInterval(() => {
      current = Math.min(current + step, target);
      setDefenseScore(current);
      if (current >= target) clearInterval(id);
    }, 20);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setClock(formatClock(new Date())), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setDefenseScore((prev) => Math.min(prev + 1, 999));
    }, 4000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setNakaResponseTime(10 + Math.random() * 6);
    }, 2000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const schedule = () => {
      const delay = 15_000 + Math.random() * 10_000;
      return setTimeout(() => {
        const idx = Math.floor(Math.random() * CANISTER_NAMES.length);
        const name = CANISTER_NAMES[idx];
        if (name === "naga_execution") {
          schedule();
          return;
        }
        setActiveThreats((p) => p + 1);
        setCanisters((prev) =>
          prev.map((c) => (c.name === name ? { ...c, status: "ALERT" } : c)),
        );
        setTimeout(() => {
          setActiveThreats((p) => Math.max(0, p - 1));
          setCanisters((prev) =>
            prev.map((c) =>
              c.name === name ? { ...c, status: "PROTECTED" } : c,
            ),
          );
        }, 5000);
        schedule();
      }, delay);
    };
    const timer = schedule();
    return () => clearTimeout(timer);
  }, []);

  const runHoneypot = useCallback(() => {
    const attacker = randomPrincipal();
    const target = randomCanister();
    const maxCycles = 50_000_000 + Math.floor(Math.random() * 450_000_000);
    const drainDuration = 3000 + Math.random() * 1000;

    setHoneypot({
      phase: "ACTIVATING",
      attackerPrincipal: attacker,
      targetCanister: target,
      drainProgress: 0,
      cyclesDraining: 0,
      startTime: Date.now(),
    });
    setActiveThreats((p) => p + 1);

    setTimeout(() => {
      setHoneypot((prev) => ({ ...prev, phase: "DRAINING" }));
    }, 500);

    const startTime = Date.now();
    const drainId = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / drainDuration) * 100, 100);
      const cycles = Math.floor((progress / 100) * maxCycles);
      setHoneypot((prev) => ({
        ...prev,
        drainProgress: progress,
        cyclesDraining: cycles,
      }));
      if (progress >= 100) {
        clearInterval(drainId);
      }
    }, 50);

    setTimeout(() => {
      setHoneypot((prev) => ({
        ...prev,
        phase: "NEUTRALIZED",
        drainProgress: 100,
        cyclesDraining: maxCycles,
      }));
      setActiveThreats((p) => Math.max(0, p - 1));
      setTotalCyclesDrained((p) => p + maxCycles);
      setNeutralizedCount((p) => p + 1);
      setDefenseScore((p) => Math.min(p + 3, 999));

      const outcome: ThreatOutcome =
        Math.random() > 0.2 ? "NEUTRALIZED" : "BLOCKED";
      const entry: ThreatEntry = {
        id: `t${Date.now()}`,
        timestamp: formatTimestamp(new Date()),
        attackerPrincipal: attacker,
        targetCanister: target,
        cyclesDrained: maxCycles,
        outcome,
      };
      setThreats((prev) => [entry, ...prev].slice(0, 50));

      setTimeout(() => {
        setHoneypot({
          phase: "IDLE",
          attackerPrincipal: "",
          targetCanister: "",
          drainProgress: 0,
          cyclesDraining: 0,
          startTime: 0,
        });
      }, 2000);
    }, drainDuration + 500);
  }, []);

  useEffect(() => {
    const schedule = () => {
      const delay = 8_000 + Math.random() * 6_000;
      return setTimeout(() => {
        if (honeypotRef.current.phase === "IDLE") {
          runHoneypot();
        }
        schedule();
      }, delay);
    };
    const timer = schedule();
    return () => clearTimeout(timer);
  }, [runHoneypot]);

  return {
    canisters,
    threats,
    honeypot,
    systemIntegrity: 100,
    activeThreats,
    totalCyclesDrained,
    neutralizedCount,
    defenseScore,
    nakaResponseTime,
    clock,
  };
}

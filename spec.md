# SROS — Sovereign Resonant Operating System

## Current State

The app has 10 tabs: OVERVIEW, CANISTERS, HONEYPOT, THREAT LOG, POC OVERVIEW, REMEDIATION GATEWAY, CYCLES, BTM COORDINATION, RAW TELEMETRY, WHITEPAPER. The WHITEPAPER tab contains a general technical whitepaper. The POC OVERVIEW tab has a PDF export of the proof-of-concept summary.

## Requested Changes (Diff)

### Add
- New `SROSSubmission` component (`src/frontend/src/components/SROSSubmission.tsx`) — a print-ready Phase 1 HeroX DOE submission document with:
  1. Cover / Header — project name, track, submission date, live URL, controller principal
  2. Team Introduction — Sophors (solo architect), Human-AI synthesis methodology
  3. Product Description — SROS Layer 2 BTM Coordination Network, 17 live Rust canisters, key capabilities
  4. Strategic Plan — Phase 1 proof, Phase 2 coalition integration with Stem Inc., licensing model
  5. Coalition Partner Statement — Stem Inc. as Phase 2 target, one-paragraph rationale
  6. Live Verification — how reviewers can verify the system on-chain (no wallet needed)
  7. Scientific Terminology Glossary — symbolic → industry-standard mapping table
  8. Export PDF button (print trigger)
- New `SUBMISSION` tab added to App.tsx tab list, rendering `SROSSubmission`

### Modify
- `App.tsx` — add `SUBMISSION` to the tabs array and import/render `SROSSubmission`

### Remove
- Nothing removed

## Implementation Plan

1. Create `SROSSubmission.tsx` with all 7 sections formatted for print, clean light/white scientific aesthetic with dark text, PDF export button
2. Add SUBMISSION tab to App.tsx tabs array and render the component

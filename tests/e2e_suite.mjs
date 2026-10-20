// tests/e2e_suite.mjs
// Unified E2E Test Suite Orchestrator: Runs all 4 Tiers (125 tests total)

import { BASE_URL } from './config.mjs';
import { createTier1Suite } from './tier1_features.mjs';
import { createTier2Suite } from './tier2_boundary.mjs';
import { createTier3Suite } from './tier3_combinations.mjs';
import { createTier4Suite } from './tier4_scenarios.mjs';

/**
 * Execute all E2E test tiers.
 * @param {object} [options]
 * @param {number[]} [options.tiers] - Specific tiers to run (e.g. [1, 2, 3, 4])
 * @returns {Promise<{total: number, passed: number, failed: number, duration: number, tierResults: any[]}>}
 */
export async function runE2ESuite(options = {}) {
  const selectedTiers = options.tiers || [1, 2, 3, 4];
  const startTime = performance.now();

  console.log(`\n======================================================================`);
  console.log(`TAPLY SAAS: FULL END-TO-END VERIFICATION SUITE`);
  console.log(`Target: ${BASE_URL}`);
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log(`Active Tiers: ${selectedTiers.join(', ')}`);
  console.log(`======================================================================\n`);

  const suiteFactories = {
    1: createTier1Suite,
    2: createTier2Suite,
    3: createTier3Suite,
    4: createTier4Suite,
  };

  const tierResults = [];
  let grandTotal = 0;
  let grandPassed = 0;
  let grandFailed = 0;

  for (const tierNum of selectedTiers) {
    const factory = suiteFactories[tierNum];
    if (!factory) {
      console.warn(`Warning: Unknown tier ${tierNum}, skipping.`);
      continue;
    }

    const suite = factory();
    const result = await suite.run();
    tierResults.push(result);
    grandTotal += result.total;
    grandPassed += result.passed;
    grandFailed += result.failed;
  }

  const grandDuration = Math.round(performance.now() - startTime);

  console.log(`\n======================================================================`);
  console.log(`E2E SUITE EXECUTION SUMMARY`);
  console.log(`======================================================================`);
  console.log(`| Tier   | Description                       | Total | Passed | Failed | Duration |`);
  console.log(`|--------|-----------------------------------|-------|--------|--------|----------|`);
  tierResults.forEach(r => {
    const tierName = r.suite.padEnd(33, ' ');
    console.log(`| Result | ${tierName} | ${String(r.total).padStart(5, ' ')} | ${String(r.passed).padStart(6, ' ')} | ${String(r.failed).padStart(6, ' ')} | ${String(r.duration + 'ms').padStart(8, ' ')} |`);
  });
  console.log(`|--------|-----------------------------------|-------|--------|--------|----------|`);
  console.log(`| TOTAL  | All Selected Tiers                | ${String(grandTotal).padStart(5, ' ')} | ${String(grandPassed).padStart(6, ' ')} | ${String(grandFailed).padStart(6, ' ')} | ${String(grandDuration + 'ms').padStart(8, ' ')} |`);
  console.log(`======================================================================`);

  if (grandFailed === 0) {
    console.log(`>>> ALL ${grandTotal} TESTS PASSED SUCCESSFULLY! (100% Pass Rate) <<<\n`);
  } else {
    console.log(`>>> FAILURES DETECTED: ${grandFailed}/${grandTotal} tests failed. <<<\n`);
  }

  return {
    total: grandTotal,
    passed: grandPassed,
    failed: grandFailed,
    duration: grandDuration,
    tierResults,
  };
}

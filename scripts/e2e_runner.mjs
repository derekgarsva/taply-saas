// scripts/e2e_runner.mjs
// Project-level runner script for E2E verification

import { runE2ESuite } from '../tests/e2e_suite.mjs';

function parseArgs() {
  const args = process.argv.slice(2);
  const options = { tiers: [1, 2, 3, 4] };

  for (const arg of args) {
    if (arg.startsWith('--tier=')) {
      const val = arg.split('=')[1];
      options.tiers = val.split(',').map(n => parseInt(n.trim(), 10)).filter(Boolean);
    } else if (arg === '--all') {
      options.tiers = [1, 2, 3, 4];
    }
  }

  return options;
}

async function main() {
  const options = parseArgs();
  try {
    const summary = await runE2ESuite(options);
    process.exit(summary.failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('Fatal execution error running E2E suite:', err);
    process.exit(1);
  }
}

main();

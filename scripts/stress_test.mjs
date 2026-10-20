// scripts/stress_test.mjs
// Automated concurrency and stress test harness for Taply SaaS
// Measures throughput, error rates, p50/p95/p99 latencies, and process stability under 50-100 concurrent requests.

import { performance } from 'perf_hooks';
import fs from 'fs';
import path from 'path';

const BASE_URL = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;

function percentile(sorted, p) {
  if (sorted.length === 0) return 0;
  const index = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, Math.min(index, sorted.length - 1))];
}

async function sendRequest({ url, method = 'GET', headers = {}, body = null }) {
  const start = performance.now();
  let status = 0;
  let ok = false;
  let error = null;

  try {
    const fetchHeaders = new Headers(headers);
    let fetchBody = body;
    if (body && typeof body === 'object') {
      if (!fetchHeaders.has('Content-Type')) {
        fetchHeaders.set('Content-Type', 'application/json');
      }
      fetchBody = JSON.stringify(body);
    }

    const res = await fetch(url, {
      method,
      headers: fetchHeaders,
      body: fetchBody,
    });

    status = res.status;
    ok = res.ok;
    await res.text(); // consume body
  } catch (err) {
    error = err.message;
  }

  const durationMs = Math.round((performance.now() - start) * 10) / 10;
  return { durationMs, status, ok, error };
}

async function runConcurrencyBurst(name, requests, concurrency) {
  console.log(`\n============================================================`);
  console.log(`STRESS SCENARIO: ${name}`);
  console.log(`Target: ${BASE_URL} | Total: ${requests.length} | Concurrency: ${concurrency}`);
  console.log(`============================================================`);

  const memBefore = process.memoryUsage();
  const startTime = performance.now();
  const results = [];
  let currentIndex = 0;

  async function worker() {
    while (currentIndex < requests.length) {
      const idx = currentIndex++;
      const req = requests[idx];
      const res = await sendRequest(req);
      results[idx] = res;
    }
  }

  const workers = Array.from({ length: concurrency }, () => worker());
  await Promise.all(workers);

  const totalTimeMs = performance.now() - startTime;
  const memAfter = process.memoryUsage();

  const durations = results.map(r => r.durationMs).sort((a, b) => a - b);
  const successes = results.filter(r => r.ok).length;
  const clientErrors = results.filter(r => r.status >= 400 && r.status < 500).length;
  const serverErrors = results.filter(r => r.status >= 500 || r.error).length;
  const total = results.length;
  const errorRate = ((total - successes) / total) * 100;
  const throughput = Math.round((total / (totalTimeMs / 1000)) * 10) / 10;

  const stats = {
    name,
    concurrency,
    totalRequests: total,
    successes,
    clientErrors,
    serverErrors,
    errorRate: `${errorRate.toFixed(2)}%`,
    durationMs: Math.round(totalTimeMs),
    throughputRps: throughput,
    latencies: {
      min: durations[0] || 0,
      p50: percentile(durations, 50),
      p90: percentile(durations, 90),
      p95: percentile(durations, 95),
      p99: percentile(durations, 99),
      max: durations[durations.length - 1] || 0,
      mean: Math.round(durations.reduce((a, b) => a + b, 0) / durations.length),
    },
    memory: {
      heapBeforeMB: Math.round(memBefore.heapUsed / 1024 / 1024 * 100) / 100,
      heapAfterMB: Math.round(memAfter.heapUsed / 1024 / 1024 * 100) / 100,
    },
  };

  console.log(`Results: ${successes}/${total} OK (${stats.errorRate} error rate) in ${stats.durationMs}ms`);
  console.log(`Throughput: ${throughput} req/sec`);
  console.log(`Latency Percentiles:`);
  console.log(`  Min: ${stats.latencies.min}ms | p50: ${stats.latencies.p50}ms | p90: ${stats.latencies.p90}ms | p95: ${stats.latencies.p95}ms | p99: ${stats.latencies.p99}ms | Max: ${stats.latencies.max}ms`);
  console.log(`Server Errors: ${serverErrors} (Stability: ${serverErrors === 0 ? '100% STABLE' : 'DEGRADED'})`);

  return stats;
}

export async function runFullStressSuite() {
  console.log(`\n======================================================================`);
  console.log(`TAPLY SAAS: SYSTEM STRESS & CONCURRENCY BENCHMARK (R4)`);
  console.log(`Testing target: ${BASE_URL}`);
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log(`======================================================================\n`);

  const report = [];

  // SCENARIO 1: 50 Concurrent Read Requests on Public Storefront Catalog
  const storeRequests50 = Array.from({ length: 50 }, (_, i) => ({
    url: `${BASE_URL}/api/public/${i % 2 === 0 ? 'panaderia-la-estrella' : 'burger-station'}`,
  }));
  report.push(await runConcurrencyBurst('50 Concurrent Storefront Reads', storeRequests50, 50));

  // SCENARIO 2: 75 Concurrent Catalog & Category Operations
  const catalogRequests75 = Array.from({ length: 75 }, (_, i) => ({
    url: i % 2 === 0 
      ? `${BASE_URL}/api/products?businessId=biz_estrella_1` 
      : `${BASE_URL}/api/categories?businessId=biz_estrella_1`,
  }));
  report.push(await runConcurrencyBurst('75 Concurrent Products & Categories Reads', catalogRequests75, 75));

  // SCENARIO 3: 50 Concurrent Order Submissions (Write load)
  const orderRequests50 = Array.from({ length: 50 }, (_, i) => ({
    url: `${BASE_URL}/api/orders`,
    method: 'POST',
    body: {
      businessId: 'biz_estrella_1',
      items: [
        { id: 'item_1', name: 'Cachito de Jamón', price: 2.5, quantity: 2 },
      ],
      total: 5.0,
      customerNote: `Stress test order #${i + 1}`,
      whatsappMessage: `Pedido #${i + 1}`,
    },
  }));
  report.push(await runConcurrencyBurst('50 Concurrent Order Creations (Writes)', orderRequests50, 50));

  // SCENARIO 4: 100 Concurrent Mixed Production Workload (Reads + Writes + Admin Auth)
  const mixedRequests100 = Array.from({ length: 100 }, (_, i) => {
    const mod = i % 4;
    if (mod === 0) {
      return { url: `${BASE_URL}/api/public/panaderia-la-estrella` };
    } else if (mod === 1) {
      return { url: `${BASE_URL}/api/products?businessId=biz_burger_2` };
    } else if (mod === 2) {
      return {
        url: `${BASE_URL}/api/orders`,
        method: 'POST',
        body: {
          businessId: 'biz_burger_2',
          items: [{ id: 'p_b1', name: 'Cheeseburger', price: 6.0, quantity: 1 }],
          total: 6.0,
        },
      };
    } else {
      return {
        url: `${BASE_URL}/api/admin/payments`,
        headers: { Cookie: 'taply_admin_session=active' },
      };
    }
  });
  report.push(await runConcurrencyBurst('100 Concurrent Mixed Production Traffic', mixedRequests100, 100));

  // Write report to docs
  const outDir = path.resolve(process.cwd(), 'docs');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  const outPath = path.join(outDir, 'STRESS_TEST_RESULTS.json');
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2), 'utf-8');
  console.log(`\nStress benchmark results saved to: ${outPath}`);

  return report;
}

if (process.argv[1]?.endsWith('stress_test.mjs')) {
  runFullStressSuite().catch(err => {
    console.error('Stress test fatal error:', err);
    process.exit(1);
  });
}

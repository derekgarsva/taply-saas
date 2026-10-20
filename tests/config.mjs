// tests/config.mjs
// Unified test configuration, HTTP client, assertions, and test runner harness.

export const BASE_URL = process.env.BASE_URL || `http://127.0.0.1:${process.env.PORT || 3000}`;

/**
 * Execute an HTTP request against the application server with resilient retry handling.
 * @param {string} path - Endpoint path (e.g. '/api/business')
 * @param {RequestInit} [options] - Fetch options
 * @returns {Promise<{status: number, ok: boolean, headers: Headers, data: any, text: string, durationMs: number}>}
 */
export async function api(path, options = {}) {
  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;
  const start = performance.now();
  
  const headers = new Headers(options.headers || {});
  let body = options.body;
  if (body && typeof body === 'object' && !(body instanceof FormData)) {
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
    body = JSON.stringify(body);
  }

  let response;
  let lastErr;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      response = await fetch(url, {
        ...options,
        headers,
        body,
      });
      break;
    } catch (err) {
      lastErr = err;
      if (attempt < 2) {
        await new Promise(r => setTimeout(r, 100 * (attempt + 1)));
      }
    }
  }

  if (!response) {
    throw lastErr;
  }

  const durationMs = Math.round(performance.now() - start);
  const text = await response.text();
  let data = null;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }

  return {
    status: response.status,
    ok: response.ok,
    headers: response.headers,
    data,
    text,
    durationMs,
  };
}

// ─────────────────────────────────────────────────────────────
// Assertions
// ─────────────────────────────────────────────────────────────

export class AssertionError extends Error {
  constructor(message, actual, expected) {
    super(message);
    this.name = 'AssertionError';
    this.actual = actual;
    this.expected = expected;
  }
}

export function assert(condition, message = 'Assertion failed') {
  if (!condition) {
    throw new AssertionError(message, condition, true);
  }
}

export function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    const msg = message || `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`;
    throw new AssertionError(msg, actual, expected);
  }
}

export function assertDeepEqual(actual, expected, message) {
  const actualStr = JSON.stringify(actual);
  const expectedStr = JSON.stringify(expected);
  if (actualStr !== expectedStr) {
    const msg = message || `Objects not deeply equal:\nActual: ${actualStr}\nExpected: ${expectedStr}`;
    throw new AssertionError(msg, actual, expected);
  }
}

export function assertStatus(res, expectedStatus, message) {
  if (res.status !== expectedStatus) {
    const detail = typeof res.data === 'object' ? JSON.stringify(res.data) : res.text;
    const msg = message || `Expected HTTP ${expectedStatus}, got ${res.status}. Response: ${detail.slice(0, 200)}`;
    throw new AssertionError(msg, res.status, expectedStatus);
  }
}

export function assertIncludes(haystack, needle, message) {
  if (!haystack || !haystack.includes(needle)) {
    const msg = message || `Expected string to include "${needle}", got "${haystack}"`;
    throw new AssertionError(msg, haystack, needle);
  }
}

export function assertArray(val, message = 'Expected value to be an array') {
  if (!Array.isArray(val)) {
    throw new AssertionError(message, typeof val, 'array');
  }
}

export function assertNumber(val, message = 'Expected value to be a number') {
  if (typeof val !== 'number' || Number.isNaN(val)) {
    throw new AssertionError(message, val, 'number');
  }
}

// ─────────────────────────────────────────────────────────────
// Test Suite Collector & Runner
// ─────────────────────────────────────────────────────────────

export class TestSuite {
  constructor(name) {
    this.name = name;
    this.tests = [];
    this.results = [];
  }

  test(name, fn) {
    this.tests.push({ name, fn });
  }

  async run(context = {}) {
    console.log(`\n============================================================`);
    console.log(`RUNNING SUITE: ${this.name}`);
    console.log(`============================================================`);
    
    let passed = 0;
    let failed = 0;
    const startTime = performance.now();

    for (let i = 0; i < this.tests.length; i++) {
      const { name, fn } = this.tests[i];
      const testNum = i + 1;
      const testStart = performance.now();
      try {
        await fn(context);
        const duration = Math.round(performance.now() - testStart);
        console.log(`  [PASS] #${testNum} ${name} (${duration}ms)`);
        this.results.push({ name, status: 'PASS', duration, error: null });
        passed++;
      } catch (err) {
        const duration = Math.round(performance.now() - testStart);
        console.log(`  [FAIL] #${testNum} ${name} (${duration}ms)`);
        console.log(`         Error: ${err.message}`);
        this.results.push({ name, status: 'FAIL', duration, error: err });
        failed++;
      }
    }

    const totalDuration = Math.round(performance.now() - startTime);
    console.log(`------------------------------------------------------------`);
    console.log(`SUITE COMPLETE: ${this.name} | Total: ${this.tests.length} | Passed: ${passed} | Failed: ${failed} | Time: ${totalDuration}ms`);
    console.log(`------------------------------------------------------------\n`);

    return {
      suite: this.name,
      total: this.tests.length,
      passed,
      failed,
      duration: totalDuration,
      results: this.results,
    };
  }
}

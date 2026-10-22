// tests/adversarial_m1_probes.mjs
// Adversarial Empirical Probes for Milestone 1 (Categories, Products, Deletion Reassignment, Demo Restore)

import { BASE_URL } from './config.mjs';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

let passCount = 0;
let failCount = 0;
const findings = [];

async function request(path, options = {}) {
  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;
  const headers = new Headers(options.headers || {});
  if (!headers.has('x-taply-test-auth')) {
    headers.set('x-taply-test-auth', 'taply-e2e-internal');
  }
  let body = options.body;
  if (body && typeof body === 'object') {
    headers.set('Content-Type', 'application/json');
    body = JSON.stringify(body);
  }
  const res = await fetch(url, { ...options, headers, body });
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    json = text;
  }
  return { status: res.status, ok: res.ok, headers: res.headers, data: json };
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function runProbe(name, fn) {
  process.stdout.write(`  [PROBE] ${name} ... `);
  const start = performance.now();
  try {
    await fn();
    const duration = Math.round(performance.now() - start);
    console.log(`${colors.green}PASS${colors.reset} (${duration}ms)`);
    passCount++;
  } catch (err) {
    const duration = Math.round(performance.now() - start);
    console.log(`${colors.red}FAIL${colors.reset} (${duration}ms): ${err.message}`);
    failCount++;
    findings.push({ name, error: err.message, stack: err.stack });
  }
}

async function main() {
  console.log(`\n${colors.bold}${colors.cyan}======================================================================${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}CHALLENGER M1: EMPIRICAL ADVERSARIAL PROBES${colors.reset}`);
  console.log(`Target: ${BASE_URL}`);
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log(`${colors.bold}${colors.cyan}======================================================================${colors.reset}\n`);

  // Ensure clean starting baseline for demo tenants
  await request('/api/business/restore-demo', { method: 'POST', body: { slug: 'panaderia-la-estrella' } });
  await request('/api/business/restore-demo', { method: 'POST', body: { slug: 'burger-station' } });

  // ─────────────────────────────────────────────────────────────
  // PROBE 1: Unregistered Category Auto-Surfacing
  // ─────────────────────────────────────────────────────────────
  console.log(`${colors.bold}--- PROBE GROUP 1: Product with Non-Existent Category Auto-Surfacing ---${colors.reset}`);

  const uniqueCat1 = `AdvCat_CyberDonut_${Date.now()}`;
  let createdProdId1 = null;

  await runProbe('1.1 Create product with unregistered category name', async () => {
    const res = await request('/api/products', {
      method: 'POST',
      body: {
        businessId: 'biz_estrella_1',
        name: 'Cyber Donut M1',
        price: 3.5,
        category: uniqueCat1,
        available: true,
      },
    });
    assert(res.status === 200 || res.status === 201, `Expected 200/201, got ${res.status}`);
    assert(res.data && res.data.id, 'Expected product with id');
    createdProdId1 = res.data.id;
  });

  await runProbe('1.2 Query /api/categories -> Verify category is automatically surfaced', async () => {
    const res = await request('/api/categories?businessId=biz_estrella_1');
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(Array.isArray(res.data), 'Expected array of categories');
    const match = res.data.find(c => c.name === uniqueCat1);
    assert(match, `Category "${uniqueCat1}" was NOT surfaced in /api/categories!`);
    assert(match.id, 'Surfaced category must have an id');
    assert(match.businessId === 'biz_estrella_1', `Expected businessId biz_estrella_1, got ${match.businessId}`);
  });

  await runProbe('1.3 Query /api/products -> Verify product category is intact', async () => {
    const res = await request('/api/products?businessId=biz_estrella_1');
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    const prod = res.data.find(p => p.id === createdProdId1 || p.name === 'Cyber Donut M1');
    assert(prod, 'Created product not found in /api/products');
    assert(prod.category === uniqueCat1, `Expected product category "${uniqueCat1}", got "${prod.category}"`);
  });

  await runProbe('1.4 Query public storefront /[slug] -> Verify category and product present', async () => {
    const res = await request('/api/public/panaderia-la-estrella');
    assert(res.status === 200, `Expected 200, got ${res.status}`);
    assert(Array.isArray(res.data.categories), 'Expected categories array on public store');
    const hasCat = res.data.categories.some(c => c.name === uniqueCat1);
    assert(hasCat, `Category "${uniqueCat1}" missing from public store categories`);
    const hasProd = res.data.products.some(p => p.id === createdProdId1 || p.name === 'Cyber Donut M1');
    assert(hasProd, 'Product missing from public store products');
  });

  const uniqueCatWhitespace = `  🍰 Glazed Pastel ${Date.now()}  `;
  let createdProdIdWs = null;

  await runProbe('1.5 Adversarial: Product with leading/trailing whitespace category', async () => {
    const res = await request('/api/products', {
      method: 'POST',
      body: {
        businessId: 'biz_estrella_1',
        name: 'Pastel Glaseado Adv',
        price: 5.0,
        category: uniqueCatWhitespace,
        available: true,
      },
    });
    assert(res.status === 200 || res.status === 201, `Failed to create product: ${res.status}`);
    createdProdIdWs = res.data.id;

    const catRes = await request('/api/categories?businessId=biz_estrella_1');
    const trimmed = uniqueCatWhitespace.trim();
    const found = catRes.data.some(c => c.name.trim() === trimmed);
    assert(found, `Trimmed category "${trimmed}" was not surfaced in categories`);
  });

  await runProbe('1.6 Adversarial: Multiple products sharing same unregistered category (no duplicates)', async () => {
    const sharedCat = `AdvSharedCat_${Date.now()}`;
    await request('/api/products', {
      method: 'POST',
      body: { businessId: 'biz_estrella_1', name: 'Item 1 Shared', price: 1.0, category: sharedCat },
    });
    await request('/api/products', {
      method: 'POST',
      body: { businessId: 'biz_estrella_1', name: 'Item 2 Shared', price: 2.0, category: sharedCat },
    });
    await request('/api/products', {
      method: 'POST',
      body: { businessId: 'biz_estrella_1', name: 'Item 3 Shared', price: 3.0, category: sharedCat },
    });

    const catRes = await request('/api/categories?businessId=biz_estrella_1');
    const matches = catRes.data.filter(c => c.name.toLowerCase() === sharedCat.toLowerCase());
    assert(matches.length === 1, `Expected exactly 1 category instance for "${sharedCat}", found ${matches.length}`);
  });

  // ─────────────────────────────────────────────────────────────
  // PROBE 2: Category Deletion and Graceful Product Reassignment
  // ─────────────────────────────────────────────────────────────
  console.log(`\n${colors.bold}--- PROBE GROUP 2: Category Deletion & Product Reassignment ---${colors.reset}`);

  const deleteTargetCatName = `AdvCat_To_Delete_${Date.now()}`;
  let catIdToDelete = null;
  let boundProdId = null;

  await runProbe('2.1 Setup: Create category and bind product to it', async () => {
    // 1. Create product directly with this category
    const prodRes = await request('/api/products', {
      method: 'POST',
      body: {
        businessId: 'biz_estrella_1',
        name: 'Bound Product For Deletion',
        price: 4.25,
        category: deleteTargetCatName,
        available: true,
      },
    });
    assert(prodRes.status === 200 || prodRes.status === 201, 'Failed to create product');
    boundProdId = prodRes.data.id;

    // 2. Fetch categories to get the auto-generated or inserted category id
    const catRes = await request('/api/categories?businessId=biz_estrella_1');
    const foundCat = catRes.data.find(c => c.name === deleteTargetCatName);
    assert(foundCat, 'Category was not created/surfaced');
    catIdToDelete = foundCat.id;
  });

  await runProbe('2.2 Delete category via DELETE /api/categories', async () => {
    const delRes = await request(`/api/categories?businessId=biz_estrella_1&categoryId=${catIdToDelete}`, {
      method: 'DELETE',
    });
    assert(delRes.status === 200, `Expected 200 from DELETE, got ${delRes.status}`);
    assert(delRes.data.success === true, 'Expected { success: true }');
  });

  await runProbe('2.3 Verify category no longer in /api/categories', async () => {
    const listRes = await request('/api/categories?businessId=biz_estrella_1');
    assert(listRes.status === 200, 'Failed to get categories');
    const stillThere = listRes.data.some(c => c.id === catIdToDelete || c.name === deleteTargetCatName);
    assert(!stillThere, `Deleted category "${deleteTargetCatName}" still appears in /api/categories!`);
  });

  await runProbe('2.4 Verify product was gracefully reassigned to an active category', async () => {
    const prodRes = await request('/api/products?businessId=biz_estrella_1');
    assert(prodRes.status === 200, 'Failed to get products');
    const prod = prodRes.data.find(p => p.id === boundProdId || p.name === 'Bound Product For Deletion');
    assert(prod, 'Bound product disappeared!');
    assert(
      prod.category !== deleteTargetCatName,
      `Product still has deleted category reference "${deleteTargetCatName}"!`
    );
    assert(
      prod.category && prod.category.trim().length > 0,
      `Product category became empty or null after deletion: ${prod.category}`
    );

    // Verify the reassigned category is one of the currently active categories
    const catRes = await request('/api/categories?businessId=biz_estrella_1');
    const validCatNames = new Set(catRes.data.map(c => c.name.toLowerCase()));
    validCatNames.add('general');
    assert(
      validCatNames.has(prod.category.toLowerCase()),
      `Reassigned category "${prod.category}" is not in active categories list!`
    );
  });

  await runProbe('2.5 Verify deleted category does NOT resurrect on public storefront', async () => {
    const pubRes = await request('/api/public/panaderia-la-estrella');
    assert(pubRes.status === 200, 'Failed to get public storefront');
    const ghostCat = pubRes.data.categories.find(c => c.name === deleteTargetCatName);
    assert(!ghostCat, `Deleted category "${deleteTargetCatName}" resurrected on public storefront!`);
  });

  await runProbe('2.6 Adversarial: Cross-tenant category deletion protection', async () => {
    // Tenant 2 (burger-station) attempts to delete a category belonging to Tenant 1 (biz_estrella_1)
    const t1Cats = await request('/api/categories?businessId=biz_estrella_1');
    assert(t1Cats.data.length > 0, 'No categories in T1');
    const t1CatId = t1Cats.data[0].id;
    const t1CatName = t1Cats.data[0].name;

    // Cross-tenant delete attempt
    await request(`/api/categories?businessId=biz_burger_2&categoryId=${t1CatId}`, { method: 'DELETE' });

    // Verify T1 category still exists untouched
    const t1CatsAfter = await request('/api/categories?businessId=biz_estrella_1');
    const stillExists = t1CatsAfter.data.some(c => c.id === t1CatId || c.name === t1CatName);
    assert(stillExists, 'Cross-tenant deletion was erroneously permitted! T1 category was deleted.');
  });

  // ─────────────────────────────────────────────────────────────
  // PROBE 3: Demo Store Category Restore Behavior
  // ─────────────────────────────────────────────────────────────
  console.log(`\n${colors.bold}--- PROBE GROUP 3: Demo Store Restore Behavior ---${colors.reset}`);

  let baselineCategories = [];
  let baselineProducts = [];

  await runProbe('3.1 Baseline: Record canonical categories & products for panaderia-la-estrella', async () => {
    // First reset to make sure we have pure canonical state
    await request('/api/business/restore-demo', { method: 'POST', body: { slug: 'panaderia-la-estrella' } });
    const catRes = await request('/api/categories?businessId=biz_estrella_1');
    const prodRes = await request('/api/products?businessId=biz_estrella_1');
    assert(catRes.data.length > 0, 'Baseline categories must not be empty');
    assert(prodRes.data.length > 0, 'Baseline products must not be empty');
    baselineCategories = catRes.data.map(c => c.name);
    baselineProducts = prodRes.data.map(p => p.name);
  });

  await runProbe('3.2 Tamper: Inject rogue category and rogue product, delete a canonical category', async () => {
    // 1. Add rogue category
    const rogueCat = `RogueCat_${Date.now()}`;
    await request('/api/categories', {
      method: 'POST',
      body: { businessId: 'biz_estrella_1', name: rogueCat },
    });

    // 2. Add rogue product
    await request('/api/products', {
      method: 'POST',
      body: {
        businessId: 'biz_estrella_1',
        name: 'Rogue Toxic Product',
        price: 999,
        category: rogueCat,
      },
    });

    // 3. Delete a baseline category
    const currentCats = await request('/api/categories?businessId=biz_estrella_1');
    const toDelete = currentCats.data.find(c => c.name !== rogueCat);
    if (toDelete) {
      await request(`/api/categories?businessId=biz_estrella_1&categoryId=${toDelete.id}`, { method: 'DELETE' });
    }

    // Verify tampering took effect
    const tamperedCats = await request('/api/categories?businessId=biz_estrella_1');
    const hasRogue = tamperedCats.data.some(c => c.name === rogueCat);
    assert(hasRogue, 'Rogue category was not injected');
  });

  await runProbe('3.3 Execute POST /api/business/restore-demo', async () => {
    const res = await request('/api/business/restore-demo', {
      method: 'POST',
      body: { slug: 'panaderia-la-estrella' },
    });
    assert(res.status === 200, `Expected 200 from restore-demo, got ${res.status}`);
    assert(res.data.success === true, 'Expected { success: true } from restore-demo');
  });

  await runProbe('3.4 Verify restored categories match canonical baseline and purge rogue category', async () => {
    const catRes = await request('/api/categories?businessId=biz_estrella_1');
    assert(catRes.status === 200, 'Failed to fetch categories after restore');
    const currentCatNames = catRes.data.map(c => c.name);

    // Verify all baseline categories are present
    for (const baseCat of baselineCategories) {
      const found = currentCatNames.some(c => c.toLowerCase() === baseCat.toLowerCase());
      assert(found, `Canonical baseline category "${baseCat}" missing after restore!`);
    }

    // Verify rogue category was wiped
    const hasRogue = currentCatNames.some(c => c.startsWith('RogueCat_'));
    assert(!hasRogue, 'Rogue category still persists after restore-demo!');

    // Verify rogue product was wiped
    const prodRes = await request('/api/products?businessId=biz_estrella_1');
    const hasRogueProd = prodRes.data.some(p => p.name === 'Rogue Toxic Product');
    assert(!hasRogueProd, 'Rogue product still persists after restore-demo!');
  });

  await runProbe('3.5 Verify restore idempotency and isolation against burger-station', async () => {
    const burgerBefore = await request('/api/categories?businessId=biz_burger_2');
    const burgerBeforeProds = await request('/api/products?businessId=biz_burger_2');

    // Restore panaderia-la-estrella again
    await request('/api/business/restore-demo', { method: 'POST', body: { slug: 'panaderia-la-estrella' } });

    // Check burger-station remains completely identical
    const burgerAfter = await request('/api/categories?businessId=biz_burger_2');
    const burgerAfterProds = await request('/api/products?businessId=biz_burger_2');

    assert(burgerBefore.data.length === burgerAfter.data.length, 'Burger station categories modified by estrella restore!');
    assert(burgerBeforeProds.data.length === burgerAfterProds.data.length, 'Burger station products modified by estrella restore!');
  });

  // Final summary
  console.log(`\n${colors.bold}${colors.cyan}======================================================================${colors.reset}`);
  console.log(`${colors.bold}ADVERSARIAL PROBES SUMMARY${colors.reset}`);
  console.log(`Total Probes: ${passCount + failCount}`);
  console.log(`${colors.green}Passed: ${passCount}${colors.reset}`);
  console.log(`${failCount > 0 ? colors.red : colors.green}Failed: ${failCount}${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}======================================================================${colors.reset}\n`);

  if (failCount > 0) {
    console.error(`FAILURES ENCOUNTERED (${failCount}):`);
    findings.forEach(f => console.error(`- ${f.name}: ${f.error}`));
    process.exit(1);
  } else {
    console.log(`>>> ALL ADVERSARIAL PROBES PASSED (100% Empirically Verified) <<<\n`);
    process.exit(0);
  }
}

main().catch(err => {
  console.error('Fatal probe execution error:', err);
  process.exit(1);
});

# TEST_READY: Taply SaaS End-to-End Test Suite

## Executive Summary
The opaque-box End-to-End (E2E) verification test suite for Taply SaaS is fully implemented, structured, and ready for automated regression and milestone acceptance verification.

The suite comprises **125 test cases** across **4 verification tiers**, derived directly from the requirements in `ORIGINAL_REQUEST.md` and architecture contracts in `PROJECT.md` / `TEST_INFRA.md`.

---

## Test Execution Commands

### Run Full 4-Tier Test Suite (125 Tests)
```bash
node scripts/e2e_runner.mjs
```
*Alternative direct runner:*
```bash
node tests/runner.mjs
```

### Run Specific Tiers
```bash
# Tier 1 only (50 feature tests)
node scripts/e2e_runner.mjs --tier=1

# Tier 2 only (50 boundary tests)
node scripts/e2e_runner.mjs --tier=2

# Tier 3 only (20 cross-feature combination tests)
node scripts/e2e_runner.mjs --tier=3

# Tier 4 only (5 realistic application workload scenarios)
node scripts/e2e_runner.mjs --tier=4

# Multiple specific tiers
node scripts/e2e_runner.mjs --tier=1,3
```

### Target Environment Configuration
By default, tests execute against `http://localhost:3000`. To target a custom URL or staging server:
```bash
BASE_URL=https://staging.taply.app node scripts/e2e_runner.mjs
```

---

## Comprehensive Coverage Matrix

| Feature | Description | Tier 1 (Features) | Tier 2 (Boundaries) | Tier 3 (Combinations) | Tier 4 (Scenarios) | Total |
|---|---|:---:|:---:|:---:|:---:|:---:|
| **F1** | Category & Product Bi-directional Sync | 5 | 5 | C1, C2, C3, C4, C12, C17 | Scenario 1, 2 | 18 |
| **F2** | Category Selectors in Dashboard | 5 | 5 | C1, C5, C19 | Scenario 2 | 14 |
| **F3** | Dynamic Route Execution (No-Cache) | 5 | 5 | C2, C16 | Scenario 2 | 13 |
| **F4** | Order Pipeline & Data Persistence | 5 | 5 | C3, C5, C6, C7, C8, C9, C18 | Scenario 1, 4 | 20 |
| **F5** | WhatsApp URL Normalization & Formatting | 5 | 5 | C6, C17, C20 | Scenario 1 | 14 |
| **F6** | Owner Dashboard Orders & Status Sync | 5 | 5 | C7, C10, C16, C20 | Scenario 1 | 14 |
| **F7** | Multitenant Store Isolation | 5 | 5 | C4, C8, C10, C11, C13, C14, C19 | Scenario 3, 5 | 18 |
| **F8** | Demo Store Resilience & Auto-Recovery | 5 | 5 | C11, C12, C13, C18 | Scenario 3 | 15 |
| **F9** | Concurrency & Stress Baseline | 5 | 5 | C9, C15 | Scenario 4 | 13 |
| **F10**| SuperAdmin Authentication & Metrics | 5 | 5 | C14, C15 | — | 12 |
| **TOTAL**| **All 10 Core Platform Features** | **50** | **50** | **20** | **5** | **125** |

---

## Detailed Tier Breakdown

### Tier 1: Feature Coverage (50 Tests) — `tests/tier1_features.mjs`
- **F1.1–F1.5**: Public catalog retrieval, category containment, business category listing, business product listing, category creation.
- **F2.1–F2.5**: Category selector options, schema validation, product creation under category, unique category names, product-category parity.
- **F3.1–F3.5**: Cache-Control headers (`no-cache`/`no-store`), dynamic route freshness, product dynamic query, orders dynamic query, sub-second latency.
- **F4.1–F4.5**: Order POST returning 201, total calculation, database order persistence, multi-item arrays, notes & WhatsApp payload preservation.
- **F5.1–F5.5**: Non-digit phone cleaning, Venezuelan 0414 -> 58414 prefix normalization, WhatsApp markdown items & totals, multiline payment bold formatting, URL construction.
- **F6.1–F6.5**: Orders sorted by `createdAt` desc, status transitions (`en_proceso`, `completado`, `cancelado`), database status persistence.
- **F7.1–F7.5**: Distinct tenant IDs and slugs, zero product leak, zero category leak, zero order leak, cross-tenant creation independence.
- **F8.1–F8.5**: Restore demo for `panaderia-la-estrella` and `burger-station`, slug immutability protection, master PIN 543543 authentication, catalog preservation after restore.
- **F9.1–F9.5**: 10 concurrent public requests, 10 concurrent products requests, 10 concurrent categories requests, 5 concurrent orders, average latency under 500ms.
- **F10.1–F10.5**: Admin payments rejects unauthenticated requests (401), PIN 543543 sets session cookie, payments & metrics retrieval, payment recording, admin session deletion.

### Tier 2: Boundary & Corner Cases (50 Tests) — `tests/tier2_boundary.mjs`
- **B1.1–B1.5**: Missing businessId validation (400), unknown slug 404, empty category name (400), whitespace trimming, Unicode & emoji encoding.
- **B2.1–B2.5**: Unknown businessId returns empty array `[]` (not 500), empty body 400, missing price 400, price $0.00 free promotional item, missing categoryId 400.
- **B3.1–B3.5**: Conditional `If-None-Match` returns fresh 200, `If-Modified-Since` fresh 200, malformed JSON returns clean 400/500, business query defaults, no-store headers.
- **B4.1–B4.5**: Empty order body 400, missing items 400, missing total 400, large customer notes (2KB) persistence, large numeric totals precision.
- **B5.1–B5.5**: Non-numeric phone handling, international phone formatting, URL reserved characters escaping (`?`, `&`, `#`), multiline linebreaks with asterisks, URL size safety (<8KB).
- **B6.1–B6.5**: Missing businessId 400, missing orderId 400, missing status 400, non-existent orderId 404, empty JSON body 400.
- **B7.1–B7.5**: Products missing businessId 400, deleting tenant 1 product with tenant 2 businessId fails, deleting tenant 1 category with tenant 2 businessId fails, duplicate slug 409 Conflict, non-existent businessId 404.
- **B8.1–B8.5**: Empty restore-demo body 400, null slug/id 400, non-demo slug graceful handling, rapid restore idempotency, PIN whitespace trimming.
- **B9.1–B9.5**: Burst of 15 rapid consecutive GETs, 12 concurrent public store requests, fractional cents precision, interleaved GET/POST consistency, connection resilience under concurrency.
- **B10.1–B10.5**: POST payments unauthorized 401, DELETE payments unauthorized 401, wrong PIN 401, empty PIN 401, payments missing fields 400.

### Tier 3: Cross-Feature Combinations (20 Tests) — `tests/tier3_combinations.mjs`
- **C1 (F1+F2)**: Category creation exposed immediately in selector and bound to product.
- **C2 (F1+F3)**: Newly created category reflects dynamically in public catalog without cache delay.
- **C3 (F1+F4)**: Product created under category can be ordered and persisted with exact item details.
- **C4 (F1+F7)**: Same category name across tenants maintains strict partition without ID collision.
- **C5 (F2+F4)**: Product ordered with selected modifiers from category persists complete configuration.
- **C6 (F4+F5)**: Order submission generates normalized WhatsApp URL with accurate markdown and encoding.
- **C7 (F4+F6)**: Order lifecycle transitions through initial -> `en_proceso` -> `completado` with persistent timestamps.
- **C8 (F4+F7)**: Orders submitted to different tenants never cross-contaminate dashboard views.
- **C9 (F4+F9)**: Concurrent burst of 15 orders generates 15 distinct IDs without data loss.
- **C10 (F6+F7)**: Cross-tenant order modification protection (Tenant B cannot patch Tenant A's order).
- **C11 (F7+F8)**: Restoring `panaderia-la-estrella` does not alter `burger-station` data.
- **C12 (F8+F1)**: Restore demo restores canonical categories and products to public catalog.
- **C13 (F8+F7)**: Demo store slug mutation attempt maintains protected slug integrity.
- **C14 (F10+F7)**: SuperAdmin payment records accurately to designated tenant and updates metrics.
- **C15 (F10+F9)**: Concurrent SuperAdmin payments queries return identical aggregate metrics.
- **C16 (F3+F6)**: Immediate read-after-write returns created order without eventual consistency lag.
- **C17 (F1+F5)**: Spanish accents and emojis remain uncorrupted in WhatsApp message pipeline.
- **C18 (F4+F8)**: Order placement remains immediately functional following demo store restore.
- **C19 (F2+F7)**: Category management within tenant preserves cross-tenant isolation.
- **C20 (F5+F6)**: Multi-line customer notes and quotes remain intact across order status updates.

### Tier 4: Real-World Application Scenarios (5 Scenarios) — `tests/tier4_scenarios.mjs`
- **Scenario 1**: Full Buyer Journey (Catalog viewed -> Cart built -> Order posted to `/api/orders` -> WhatsApp URL verified -> Verified in Dashboard Orders tab -> Status transitions).
- **Scenario 2**: Category & Product Lifecycle (Owner creates category -> Adds product with new category -> Both appear in storefront and dashboard -> Product updated).
- **Scenario 3**: Demo Resilience under Adversarial Degradation (Demo store accessed -> catalog cleared -> auto-recovery reconstitutes canonical catalog).
- **Scenario 4**: High-Concurrency Flash Order Burst (50 concurrent orders submitted to `/api/orders` simultaneously -> 0 errors [<1.0%] -> all 50 persisted).
- **Scenario 5**: Multitenant Cross-Store Integrity (Concurrent orders and category operations between `burger-station` and `panaderia-la-estrella` remain strictly partitioned).

---

## Escalated Implementation Defects (To Implementing Agent)

During verification against the live Supabase database and server environment, the following implementation bugs were isolated:

1. **Defect in `src/lib/db.ts:saveProduct` — PostgREST Error Handling**:
   - *Observation*: `saveProduct` checks `if (error && error.code === '42703')` to detect missing columns (such as `images`) and fall back to encoding images in markdown description.
   - *Issue*: Supabase PostgREST returns `code: 'PGRST204'` (not PostgreSQL internal code `'42703'`). Because the condition fails, `saveProduct` aborts Supabase insertion and falls back to `saveMockProduct` (in-memory store), while `getProducts` reads from Supabase, leading to read-after-write mismatch when Supabase is connected.
   - *Remediation*: Update line 459 in `src/lib/db.ts` to:
     ```typescript
     if (error && (error.code === '42703' || error.code === 'PGRST204' || error.message?.includes('images')))
     ```

2. **Order Status Enum Alignment (Milestone 2 dependency)**:
   - *Observation*: `createOrder` currently defaults `status: 'Pendiente'` in Supabase database, whereas frontend and M2 specification target `'nuevo' | 'en_proceso' | 'completado' | 'cancelado'`.
   - *Remediation*: Ensure M2 updates default status to `'nuevo'` across `src/lib/db.ts:createOrder` and PostgreSQL default schema.

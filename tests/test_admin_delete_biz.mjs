import assert from 'assert';

const BASE = 'http://127.0.0.1:3000';

async function main() {
  console.log('Testing Admin Business Deletion...');

  // 1. Unauthenticated DELETE should return 401
  const unauthRes = await fetch(`${BASE}/api/admin/businesses?id=some_id`, {
    method: 'DELETE',
  });
  console.log('1. Unauth DELETE status:', unauthRes.status);
  assert.strictEqual(unauthRes.status, 401, 'Should return 401 Unauthorized without admin cookie');

  // 2. Authenticate as SuperAdmin
  const authRes = await fetch(`${BASE}/api/admin/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pin: '543543' }),
  });
  console.log('2. SuperAdmin login status:', authRes.status);
  assert.strictEqual(authRes.status, 200, 'Should log in successfully');
  const cookie = authRes.headers.get('set-cookie');
  assert.ok(cookie, 'Must receive session cookie');

  // 3. Create a disposable business
  const testSlug = 'comercio-prueba-' + Date.now();
  const createRes = await fetch(`${BASE}/api/business`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Comercio Temporal Para Prueba',
      slug: testSlug,
      category: 'TESTING',
      city: 'Valencia',
      phone: '584149991234',
      ownerPin: '543543',
    }),
  });
  console.log('3. Create business status:', createRes.status);
  assert.strictEqual(createRes.status, 201, 'Should create business');
  const createData = await createRes.json();
  const bizId = createData.id || createData.business?.id;
  console.log('   Created business ID:', bizId, 'slug:', testSlug);

  // 4. Verify business is listed in /api/admin/businesses
  const listBefore = await fetch(`${BASE}/api/admin/businesses`, {
    headers: { Cookie: cookie },
  });
  const listBeforeData = await listBefore.json();
  const foundBefore = (listBeforeData.businesses || []).some((b) => b.id === bizId);
  console.log('4. Business found in admin list before delete:', foundBefore);
  assert.ok(foundBefore, 'Created business must be listed in admin');

  // 5. Delete the business as SuperAdmin
  const deleteRes = await fetch(`${BASE}/api/admin/businesses?id=${bizId}`, {
    method: 'DELETE',
    headers: { Cookie: cookie },
  });
  console.log('5. Delete business status:', deleteRes.status);
  const deleteData = await deleteRes.json();
  console.log('   Delete response:', deleteData);
  assert.strictEqual(deleteRes.status, 200, 'Should return 200 OK');
  assert.strictEqual(deleteData.success, true, 'success field must be true');

  // 6. Verify business is no longer listed in /api/admin/businesses
  const listAfter = await fetch(`${BASE}/api/admin/businesses`, {
    headers: { Cookie: cookie },
  });
  const listAfterData = await listAfter.json();
  const foundAfter = (listAfterData.businesses || []).some((b) => b.id === bizId);
  console.log('6. Business found in admin list after delete:', foundAfter);
  assert.strictEqual(foundAfter, false, 'Deleted business must NOT be in admin list');

  // 7. Verify public catalog returns 404
  const publicRes = await fetch(`${BASE}/api/public/${testSlug}`);
  console.log('7. Public storefront status for deleted store:', publicRes.status);
  assert.strictEqual(publicRes.status, 404, 'Deleted storefront should return 404');

  console.log('\n✅ ALL BUSINESS DELETION TESTS PASSED 100%!');
}

main().catch((err) => {
  console.error('❌ TEST FAILED:', err);
  process.exit(1);
});

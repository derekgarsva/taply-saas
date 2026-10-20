import { api } from './config.mjs';

async function test() {
  const b1 = await api('/api/business?slug=panaderia-la-estrella');
  console.log('biz_estrella id:', b1.data.id);
  const b2 = await api('/api/business?slug=burger-station');
  console.log('biz_burger id:', b2.data.id);

  const createRes = await api('/api/products', {
    method: 'POST',
    body: { businessId: b1.data.id, name: 'Debug Item', price: 4.0 },
  });
  console.log('createRes status:', createRes.status, 'body:', createRes.data);

  const check1 = await api(`/api/products?businessId=${b1.data.id}`);
  console.log('products count in b1:', check1.data.length, 'found:', check1.data.some(p => p.id === createRes.data?.id));

  // Try delete with b2.data.id
  const delRes = await api(`/api/products?businessId=${b2.data.id}&productId=${createRes.data?.id}`, {
    method: 'DELETE',
  });
  console.log('delRes status:', delRes.status, 'data:', delRes.data);

  const check2 = await api(`/api/products?businessId=${b1.data.id}`);
  console.log('after delete, products count in b1:', check2.data.length, 'still exists:', check2.data.some(p => p.id === createRes.data?.id));

  if (createRes.data?.id) {
    await api(`/api/products?businessId=${b1.data.id}&productId=${createRes.data.id}`, { method: 'DELETE' });
  }
}

test().catch(console.error);

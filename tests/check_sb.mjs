import { createClient } from '@supabase/supabase-js';

const url = 'https://llczpcbfjkvmbxiudfpu.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxsY3pwY2Jmamt2bWJ4aXVkZnB1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MTg0MjQ2MywiZXhwIjoyMTA3NDE4NDYzfQ.8XNc-2Hf223KRj10DHWw3fIywazQ_ortjD7t5yoFJcw';

const sb = createClient(url, key);

async function main() {
  const payloadWithImages = {
    business_id: 'biz_estrella_1',
    name: 'Debug Product with Images',
    price: 4.0,
    available: true,
    images: [],
  };

  const { data, error } = await sb.from('products').upsert(payloadWithImages).select().single();
  console.log('upsert error:', error);
}

main().catch(console.error);

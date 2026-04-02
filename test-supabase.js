
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    console.error('Missing URL or Key in .env.local');
    return;
  }

  console.log('Testing connection to:', url);
  const supabase = createClient(url, key);

  try {
    const { data, error } = await supabase.from('jobs').select('count', { count: 'exact', head: true });
    if (error) {
      console.error('Connection failed:', error.message);
      if (error.message.includes('fetch')) {
        console.error('This is a fetch error. Possible reasons: Project paused, invalid URL, or network issues.');
      }
    } else {
      console.log('Connection successful! Job count:', data);
    }
  } catch (err) {
    console.error('Unexpected error:', err.message);
  }
}

testConnection();

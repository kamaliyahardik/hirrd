const { Client } = require('pg');

const connectionString = 'postgresql://postgres:skywin-job-portal-123@db.gxxpcoaqptkstxxfcvca.supabase.co:5432/postgres';

const client = new Client({
  connectionString,
});

async function checkUsers() {
  try {
    await client.connect();
    console.log('Connected to database.');

    console.log('Querying public.users...');
    const res = await client.query('SELECT id, email, role, full_name FROM public.users');
    
    console.log('Users found:', res.rows.length);
    res.rows.forEach(user => {
      console.log(`- ${user.email}: ${user.role} (${user.full_name})`);
    });

  } catch (err) {
    console.error('Error querying users:', err);
  } finally {
    await client.end();
  }
}

checkUsers();

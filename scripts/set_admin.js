const { Client } = require('pg');

const connectionString = 'postgresql://postgres:skywin-job-portal-123@db.gxxpcoaqptkstxxfcvca.supabase.co:5432/postgres';

const client = new Client({
  connectionString,
});

const email = process.argv[2];

if (!email) {
  console.log('Please provide an email address.');
  process.exit(1);
}

async function setAdmin() {
  try {
    await client.connect();
    console.log(`Setting role to 'admin' for user: ${email}`);
    
    const res = await client.query(
      `UPDATE public.users SET role = 'admin' WHERE email = $1 RETURNING id, email, role`,
      [email]
    );

    if (res.rowCount === 0) {
      console.log('User not found.');
    } else {
      console.log('Success:', res.rows[0]);
    }

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

setAdmin();

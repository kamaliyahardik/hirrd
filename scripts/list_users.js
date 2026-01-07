const { Client } = require("pg");

const connectionString =
  "postgresql://postgres:skywin-job-portal-123@db.gxxpcoaqptkstxxfcvca.supabase.co:5432/postgres";

const client = new Client({
  connectionString,
});

async function listUsers() {
  try {
    await client.connect();
    const res = await client.query(
      "SELECT email, role FROM public.users ORDER BY created_at DESC LIMIT 5"
    );
    console.log("Recent users:");
    res.rows.forEach((u) => console.log(`- ${u.email} (${u.role})`));
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

listUsers();

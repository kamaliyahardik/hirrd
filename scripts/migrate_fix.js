const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

const connectionString =
  "postgresql://postgres:skywin-job-portal-123@db.gxxpcoaqptkstxxfcvca.supabase.co:5432/postgres";

const client = new Client({
  connectionString,
});

async function runMigrations() {
  try {
    await client.connect();
    console.log("Connected to database.");

    const sqlFiles = [
      "scripts/004_update_application_status.sql",
    ];

    for (const file of sqlFiles) {
      const filePath = path.join(__dirname, "..", file);
      console.log(`Reading ${file}...`);
      const sql = fs.readFileSync(filePath, "utf8");

      console.log(`Executing ${file}...`);
      await client.query(sql);
      console.log(`Successfully executed ${file}.`);
    }

    console.log("All migrations completed successfully.");
  } catch (err) {
    console.error("Error running migrations:", err);
  } finally {
    await client.end();
  }
}

runMigrations();

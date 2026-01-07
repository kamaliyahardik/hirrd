const { Client } = require('pg');

const connectionString = 'postgresql://postgres:skywin-job-portal-123@db.gxxpcoaqptkstxxfcvca.supabase.co:5432/postgres';

const client = new Client({
  connectionString,
});

async function syncUsers() {
  try {
    await client.connect();
    console.log('Connected to database.');

    // Get all auth users
    console.log('Fetching auth.users...');
    const authUsersRes = await client.query('SELECT id, email, raw_user_meta_data FROM auth.users');
    const authUsers = authUsersRes.rows;
    console.log(`Found ${authUsers.length} users in auth.users.`);

    // Get all public users
    console.log('Fetching public.users...');
    const publicUsersRes = await client.query('SELECT id FROM public.users');
    const publicUserIds = new Set(publicUsersRes.rows.map(u => u.id));
    console.log(`Found ${publicUsersRes.rows.length} users in public.users.`);

    // Find missing users
    const missingUsers = authUsers.filter(u => !publicUserIds.has(u.id));
    console.log(`Found ${missingUsers.length} users missing from public.users.`);

    // Insert missing users
    for (const user of missingUsers) {
      const role = user.raw_user_meta_data?.role || 'job_seeker';
      const fullName = user.raw_user_meta_data?.full_name || '';
      
      console.log(`Syncing user ${user.email} (${role})...`);
      
      await client.query(
        `INSERT INTO public.users (id, email, role, full_name)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (id) DO NOTHING`,
        [user.id, user.email, role, fullName]
      );
      
      // Also create profile if job_seeker
      if (role === 'job_seeker') {
        await client.query(
          `INSERT INTO public.profiles (id) VALUES ($1) ON CONFLICT (id) DO NOTHING`,
          [user.id]
        );
      }
    }

    console.log('User sync completed successfully.');
  } catch (err) {
    console.error('Error syncing users:', err);
  } finally {
    await client.end();
  }
}

syncUsers();

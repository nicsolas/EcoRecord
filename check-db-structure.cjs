
const { neon } = require('@neondatabase/serverless');

async function checkDb() {
  const url = "postgresql://neondb_owner:npg_6OMRodgP1Bza@ep-shiny-cake-am5xpe5l.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require";
  const sql = neon(url);

  console.log("Checking tables structure...");
  try {
    const columns = await sql`
      SELECT table_name, column_name, data_type, column_default, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position;
    `;
    console.log(JSON.stringify(columns, null, 2));
  } catch (err) {
    console.error("Error checking columns:", err.message);
  }
}

checkDb();

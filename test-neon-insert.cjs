
const { neon } = require('@neondatabase/serverless');

async function testInsert() {
  const url = "postgresql://neondb_owner:npg_6OMRodgP1Bza@ep-shiny-cake-am5xpe5l.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require";
  const sql = neon(url);

  console.log("Testing insert into users...");
  try {
    const username = "TestUser_" + Date.now();
    const email = "test_" + Date.now() + "@example.com";
    
    // Manual SQL insert to see what Neon returns
    const result = await sql`
      INSERT INTO users (username, email)
      VALUES (${username}, ${email})
      RETURNING id, username, email;
    `;
    console.log("✅ Insert successful:", JSON.stringify(result, null, 2));
    
    const userId = result[0].id;
    console.log("Extracted ID:", userId);
  } catch (err) {
    console.error("❌ Insert failed:", err.message);
  }
}

testInsert();

import { config } from "dotenv";
config({ path: ".env.development.local" });
import { neon } from "@neondatabase/serverless";

async function main() {
  console.log("Connecting to:", process.env.DATABASE_URL);
  const sql = neon(process.env.DATABASE_URL);
  const users = await sql`SELECT * FROM users`;
  console.log(users);
}
main().catch(console.error);

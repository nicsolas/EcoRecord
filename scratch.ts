import { config } from "dotenv";
config({ path: ".env.development.local" });
import { getDb } from "./lib/db/src/index.js";
import { usersTable } from "./lib/db/src/schema/index.js";

async function main() {
  try {
    const db = await getDb();
    console.log("DB instance acquired.");
    const users = await db.select().from(usersTable);
    console.log("Users:", users);
  } catch (err) {
    console.error("Error connecting to DB:", err);
  }
}
main();

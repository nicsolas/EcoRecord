import { getDb, usersTable } from "./lib/db/src/index.js";
async function run() {
  console.log("Testing getDb...");
  try {
    const db = await getDb();
    const res = await db.select().from(usersTable);
    console.log("Success:", res);
  } catch(e) {
    console.error("Error:", e);
  }
}
run();

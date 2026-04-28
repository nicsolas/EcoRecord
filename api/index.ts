import app from "../artifacts/api-server/src/app";

// Vercel handles requests starting with /api automatically if placed in the /api directory.
// This entry point exports the Express app to handle all sub-routes.
export default app;

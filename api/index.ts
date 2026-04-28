// api/index.ts
import app from "./_app.js";

export default async function handler(req: any, res: any) {
  try {
    return app(req, res);
  } catch (err: any) {
    console.error("Vercel API Entry Point Error:", err);
    res.status(500).json({
      error: "Vercel API Entry Point Error",
      message: err.message,
      env_check: {
        DATABASE_URL: !!process.env.DATABASE_URL,
        VERCEL: !!process.env.VERCEL
      }
    });
  }
}

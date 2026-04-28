// api/index.ts
export default async function handler(req: any, res: any) {
  try {
    const { default: app } = await import("../artifacts/api-server/src/app");
    return app(req, res);
  } catch (err: any) {
    console.error("Vercel API Entry Point Error:", err);
    res.status(500).json({
      error: "Vercel API Entry Point Error",
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
      env_check: {
        DATABASE_URL: !!process.env.DATABASE_URL,
        DATABASE_URL_UNPOOLED: !!process.env.DATABASE_URL_UNPOOLED,
        VERCEL: !!process.env.VERCEL
      }
    });
  }
}

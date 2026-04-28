export default function handler(req: any, res: any) {
  res.status(200).json({ 
    status: "ok", 
    message: "Pong from Vercel root api directory!",
    env: process.env.NODE_ENV
  });
}

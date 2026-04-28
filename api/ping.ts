
export default function handler(req: any, res: any) {
  res.status(200).json({ 
    message: 'pong', 
    timestamp: new Date().toISOString(),
    env_db: !!process.env.DATABASE_URL 
  });
}

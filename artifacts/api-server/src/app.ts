import express from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Support both /api and root mounting for Vercel compatibility
// This ensures that routes like /api/scores are handled correctly regardless of
// how Vercel passes the path to the serverless function.
app.use("/api", router);
app.use("/", router);

// Global error handler
app.use((err: any, req: any, res: any, next: any) => {

  logger.error({ err, url: req.url, method: req.method }, "Unhandled API Error");
  res.status(500).json({ 
    error: "Internal Server Error", 
    message: err?.message || "An unexpected error occurred",
    path: req.url
  });
});

export default app;


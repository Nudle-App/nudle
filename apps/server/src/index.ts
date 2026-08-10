import "./env.js";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { healthRouter } from "./routes/health.js";
import { meRouter } from "./routes/me.js";

const app = express();
const port = Number(process.env.PORT) || 3001;

app.use(helmet());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      process.env.CORS_ORIGIN,
    ].filter(Boolean) as string[],
    credentials: true,
  }),
);
app.use(express.json());

app.use("/api", healthRouter);
app.use("/api", meRouter);

app.get("/", (_req, res) => {
  res.json({ name: "@nudle/server", docs: "/api/health" });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`[server] listening on http://0.0.0.0:${port}`);
});

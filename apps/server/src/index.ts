import "./env.js";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { aiRouter } from "./routes/ai.js";
import { conversationsRouter } from "./routes/conversations.js";
import { healthRouter } from "./routes/health.js";
import { meRouter } from "./routes/me.js";
import { profilesRouter } from "./routes/profiles.js";

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
app.use("/api", profilesRouter);
app.use("/api", conversationsRouter);
app.use("/api", aiRouter);

app.get("/", (_req, res) => {
  res.json({ name: "@nudle/server", docs: "/api/health" });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`[server] listening on http://0.0.0.0:${port}`);
});

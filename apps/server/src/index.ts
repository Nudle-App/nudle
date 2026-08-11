import "./env.js";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import { aiRouter } from "./routes/ai.js";
import { attendanceRouter } from "./routes/attendance.js";
import { conversationsRouter } from "./routes/conversations.js";
import { coursesRouter } from "./routes/courses.js";
import { healthRouter } from "./routes/health.js";
import { meRouter } from "./routes/me.js";
import { profilesRouter } from "./routes/profiles.js";
import { rolesRouter } from "./routes/roles.js";
import { submissionsRouter } from "./routes/submissions.js";
import { teacherRouter } from "./routes/teacher.js";

const app = express();
const port = Number(process.env.PORT) || 3001;

const origins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  process.env.CORS_ORIGIN,
  process.env.TEACHER_ORIGIN,
  process.env.STUDENT_ORIGIN,
].filter(Boolean) as string[];

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(
  cors({
    origin: origins,
    credentials: true,
  }),
);

// better-auth must run before express.json()
app.all("/api/auth/*", toNodeHandler(auth));

app.use(express.json());

app.use("/api", healthRouter);
app.use("/api", meRouter);
app.use("/api", profilesRouter);
app.use("/api", rolesRouter);
app.use("/api", conversationsRouter);
app.use("/api", coursesRouter);
app.use("/api", submissionsRouter);
app.use("/api", attendanceRouter);
app.use("/api", teacherRouter);
app.use("/api", aiRouter);

app.get("/", (_req, res) => {
  res.json({ name: "@nudle/server", docs: "/api/health" });
});

app.listen(port, "0.0.0.0", () => {
  console.log(`[server] listening on http://0.0.0.0:${port}`);
});

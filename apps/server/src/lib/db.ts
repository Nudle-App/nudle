import knex, { type Knex } from "knex";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function connection() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.warn("[db] DATABASE_URL is required (Neon Postgres connection string)");
  }
  const needsSsl =
    Boolean(connectionString?.includes("neon.tech")) ||
    Boolean(connectionString?.includes("sslmode=require"));
  return {
    connectionString,
    ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
  };
}

export const db: Knex = knex({
  client: "pg",
  connection: connection(),
  pool: { min: 0, max: 10 },
  migrations: {
    directory: path.resolve(__dirname, "../../migrations"),
    extension: "ts",
    loadExtensions: [".ts"],
  },
});

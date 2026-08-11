import type { Knex } from "knex";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, ".env") });

const connectionString = process.env.DATABASE_URL;
const needsSsl =
  Boolean(connectionString?.includes("neon.tech")) ||
  Boolean(connectionString?.includes("sslmode=require"));

const shared: Knex.Config = {
  client: "pg",
  connection: {
    connectionString,
    ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
  },
  pool: { min: 0, max: 10 },
  migrations: {
    directory: path.resolve(__dirname, "migrations"),
    extension: "ts",
    loadExtensions: [".ts"],
  },
};

export default {
  development: shared,
  production: shared,
};

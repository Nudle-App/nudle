import type { Knex } from "knex";
import { SCHOOLS, schoolForUserId } from "../src/lib/schools.js";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("schools", (t) => {
    t.text("id").primary();
    t.text("name").notNullable();
    t.text("short_name").notNullable();
  });

  await knex("schools").insert(
    SCHOOLS.map((school) => ({
      id: school.id,
      name: school.name,
      short_name: school.shortName,
    })),
  );

  await knex.schema.alterTable("user", (t) => {
    t.text("school_id").references("id").inTable("schools").onDelete("SET NULL");
  });

  const studentIds: string[] = await knex("user_roles").where({ role: "student" }).pluck("user_id");
  for (const userId of studentIds) {
    await knex("user").where({ id: userId }).update({
      school_id: schoolForUserId(userId).id,
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("user", (t) => {
    t.dropColumn("school_id");
  });
  await knex.schema.dropTableIfExists("schools");
}

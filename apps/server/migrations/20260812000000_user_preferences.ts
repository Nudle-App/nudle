import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable("user", (t) => {
    t.jsonb("preferences")
      .notNullable()
      .defaultTo(JSON.stringify({ theme: "system" }));
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable("user", (t) => {
    t.dropColumn("preferences");
  });
}

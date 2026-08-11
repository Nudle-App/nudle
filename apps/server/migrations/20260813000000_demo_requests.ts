import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("demo_requests", (t) => {
    t.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    t.text("full_name").notNullable();
    t.text("email").notNullable();
    t.text("organization").notNullable();
    t.text("role").notNullable();
    t.text("phone");
    t.text("message");
    t.timestamp("created_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.index(["email"]);
    t.index(["created_at"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("demo_requests");
}

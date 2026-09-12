import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("parent_invitations", (t) => {
    t.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    t.text("parent_id")
      .notNullable()
      .references("id")
      .inTable("user")
      .onDelete("CASCADE");
    t.text("student_email").notNullable();
    t.text("student_id").references("id").inTable("user").onDelete("SET NULL");
    t.text("relationship").notNullable().defaultTo("Guardian");
    t.text("token").notNullable().unique();
    t.text("status").notNullable().defaultTo("pending"); // pending | accepted | declined | cancelled
    t.timestamp("expires_at", { useTz: true }).notNullable();
    t.timestamp("created_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.timestamp("responded_at", { useTz: true });
    t.index(["parent_id"]);
    t.index(["student_email"]);
    t.index(["status"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("parent_invitations");
}

import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("parent_profiles", (t) => {
    t.text("user_id")
      .primary()
      .references("id")
      .inTable("user")
      .onDelete("CASCADE");
    t.text("phone");
    t.text("national_id");
    t.timestamp("created_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.timestamp("updated_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("parent_students", (t) => {
    t.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    t.text("parent_id")
      .notNullable()
      .references("id")
      .inTable("user")
      .onDelete("CASCADE");
    t.text("student_id")
      .notNullable()
      .references("id")
      .inTable("user")
      .onDelete("CASCADE");
    t.text("relationship").notNullable().defaultTo("Guardian");
    t.timestamp("created_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.unique(["parent_id", "student_id"]);
    t.index(["parent_id"]);
    t.index(["student_id"]);
  });

  await knex.schema.createTable("finance_applications", (t) => {
    t.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    t.text("public_ref").notNullable().unique();
    t.text("parent_id")
      .notNullable()
      .references("id")
      .inTable("user")
      .onDelete("CASCADE");
    t.text("student_id").references("id").inTable("user").onDelete("SET NULL");
    t.text("product").notNullable().defaultTo("Education Finance");
    t.text("facility").notNullable().defaultTo("Education finance");
    t.text("amount").notNullable().defaultTo("0");
    t.text("status").notNullable().defaultTo("Under Review");
    t.text("employer_name");
    t.text("employer_sector");
    t.boolean("employer_pending").notNullable().defaultTo(false);
    t.jsonb("form").notNullable().defaultTo("{}");
    t.boolean("has_id_front").notNullable().defaultTo(false);
    t.boolean("has_id_back").notNullable().defaultTo(false);
    t.boolean("has_signature").notNullable().defaultTo(false);
    t.text("note").notNullable().defaultTo("");
    t.integer("instalments_paid").notNullable().defaultTo(0);
    t.integer("instalments_total");
    t.timestamp("created_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.timestamp("updated_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.index(["parent_id"]);
  });

  await knex.schema.createTable("finance_payments", (t) => {
    t.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    t.text("public_ref").notNullable().unique();
    t.text("parent_id")
      .notNullable()
      .references("id")
      .inTable("user")
      .onDelete("CASCADE");
    t.text("student_id").references("id").inTable("user").onDelete("SET NULL");
    t.text("status").notNullable(); // success | pending | failed
    t.decimal("amount", 12, 2).notNullable();
    t.decimal("fee", 12, 2).notNullable().defaultTo(0);
    t.text("method").notNullable();
    t.text("school").notNullable();
    t.text("account").notNullable().defaultTo("");
    t.text("purpose").notNullable().defaultTo("");
    t.timestamp("created_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.index(["parent_id"]);
    t.index(["public_ref"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("finance_payments");
  await knex.schema.dropTableIfExists("finance_applications");
  await knex.schema.dropTableIfExists("parent_students");
  await knex.schema.dropTableIfExists("parent_profiles");
}

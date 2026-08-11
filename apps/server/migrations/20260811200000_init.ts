import type { Knex } from "knex";

/**
 * better-auth core tables (snake_case via field mappings) + app domain.
 */
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("user", (t) => {
    t.text("id").primary();
    t.text("name").notNullable();
    t.text("email").notNullable().unique();
    t.boolean("email_verified").notNullable().defaultTo(false);
    t.text("image");
    t.timestamp("created_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.timestamp("updated_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("session", (t) => {
    t.text("id").primary();
    t.text("user_id")
      .notNullable()
      .references("id")
      .inTable("user")
      .onDelete("CASCADE");
    t.text("token").notNullable().unique();
    t.timestamp("expires_at", { useTz: true }).notNullable();
    t.text("ip_address");
    t.text("user_agent");
    t.timestamp("created_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.timestamp("updated_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.index(["user_id"]);
  });

  await knex.schema.createTable("account", (t) => {
    t.text("id").primary();
    t.text("user_id")
      .notNullable()
      .references("id")
      .inTable("user")
      .onDelete("CASCADE");
    t.text("account_id").notNullable();
    t.text("provider_id").notNullable();
    t.text("access_token");
    t.text("refresh_token");
    t.timestamp("access_token_expires_at", { useTz: true });
    t.timestamp("refresh_token_expires_at", { useTz: true });
    t.text("scope");
    t.text("id_token");
    t.text("password");
    t.timestamp("created_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.timestamp("updated_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.index(["user_id"]);
  });

  await knex.schema.createTable("verification", (t) => {
    t.text("id").primary();
    t.text("identifier").notNullable();
    t.text("value").notNullable();
    t.timestamp("expires_at", { useTz: true }).notNullable();
    t.timestamp("created_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.timestamp("updated_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("user_roles", (t) => {
    t.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    t.text("user_id")
      .notNullable()
      .references("id")
      .inTable("user")
      .onDelete("CASCADE");
    t.text("role").notNullable(); // student | teacher | admin
    t.unique(["user_id", "role"]);
    t.index(["role"]);
  });

  await knex.schema.createTable("conversations", (t) => {
    t.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    t.text("subject").notNullable();
    t.timestamp("created_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.timestamp("updated_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
  });

  await knex.schema.createTable("conversation_participants", (t) => {
    t.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    t.uuid("conversation_id")
      .notNullable()
      .references("id")
      .inTable("conversations")
      .onDelete("CASCADE");
    t.text("user_id")
      .notNullable()
      .references("id")
      .inTable("user")
      .onDelete("CASCADE");
    t.timestamp("joined_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.unique(["conversation_id", "user_id"]);
  });

  await knex.schema.createTable("messages", (t) => {
    t.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    t.uuid("conversation_id")
      .notNullable()
      .references("id")
      .inTable("conversations")
      .onDelete("CASCADE");
    t.text("sender_id")
      .notNullable()
      .references("id")
      .inTable("user")
      .onDelete("CASCADE");
    t.text("content").notNullable();
    t.boolean("read").notNullable().defaultTo(false);
    t.timestamp("created_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.index(["conversation_id"]);
  });

  await knex.schema.createTable("courses", (t) => {
    t.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    t.text("teacher_id")
      .notNullable()
      .references("id")
      .inTable("user")
      .onDelete("CASCADE");
    t.text("title").notNullable();
    t.text("description").notNullable().defaultTo("");
    t.text("status").notNullable().defaultTo("active"); // active | draft
    t.text("thumbnail").defaultTo("📚");
    t.timestamp("created_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.timestamp("updated_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.index(["teacher_id"]);
  });

  await knex.schema.createTable("enrollments", (t) => {
    t.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    t.uuid("course_id")
      .notNullable()
      .references("id")
      .inTable("courses")
      .onDelete("CASCADE");
    t.text("student_id")
      .notNullable()
      .references("id")
      .inTable("user")
      .onDelete("CASCADE");
    t.timestamp("created_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.unique(["course_id", "student_id"]);
    t.index(["course_id"]);
    t.index(["student_id"]);
  });

  await knex.schema.createTable("assignments", (t) => {
    t.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    t.uuid("course_id")
      .notNullable()
      .references("id")
      .inTable("courses")
      .onDelete("CASCADE");
    t.text("title").notNullable();
    t.timestamp("due_at", { useTz: true });
    t.timestamp("created_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.timestamp("updated_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.index(["course_id"]);
  });

  await knex.schema.createTable("submissions", (t) => {
    t.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    t.uuid("assignment_id")
      .notNullable()
      .references("id")
      .inTable("assignments")
      .onDelete("CASCADE");
    t.text("student_id")
      .notNullable()
      .references("id")
      .inTable("user")
      .onDelete("CASCADE");
    t.decimal("grade", 5, 2);
    t.text("feedback").notNullable().defaultTo("");
    t.text("status").notNullable().defaultTo("pending"); // pending | graded
    t.timestamp("created_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.timestamp("updated_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.unique(["assignment_id", "student_id"]);
    t.index(["assignment_id"]);
    t.index(["student_id"]);
  });

  await knex.schema.createTable("attendance_records", (t) => {
    t.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    t.uuid("course_id")
      .notNullable()
      .references("id")
      .inTable("courses")
      .onDelete("CASCADE");
    t.text("student_id")
      .notNullable()
      .references("id")
      .inTable("user")
      .onDelete("CASCADE");
    t.date("date").notNullable().defaultTo(knex.raw("CURRENT_DATE"));
    t.text("status").notNullable().defaultTo("present"); // present | absent | late
    t.timestamp("created_at", { useTz: true }).notNullable().defaultTo(knex.fn.now());
    t.unique(["course_id", "student_id", "date"]);
    t.index(["course_id"]);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("attendance_records");
  await knex.schema.dropTableIfExists("submissions");
  await knex.schema.dropTableIfExists("assignments");
  await knex.schema.dropTableIfExists("enrollments");
  await knex.schema.dropTableIfExists("courses");
  await knex.schema.dropTableIfExists("messages");
  await knex.schema.dropTableIfExists("conversation_participants");
  await knex.schema.dropTableIfExists("conversations");
  await knex.schema.dropTableIfExists("user_roles");
  await knex.schema.dropTableIfExists("verification");
  await knex.schema.dropTableIfExists("account");
  await knex.schema.dropTableIfExists("session");
  await knex.schema.dropTableIfExists("user");
}

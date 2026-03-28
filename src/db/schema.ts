import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { statuses } from "../vars";

export const ordersTable = sqliteTable("orders", {
  id: int().primaryKey(),
  caption: text().notNull(),
  status: text({ enum: statuses }).notNull().default("created"),
  createdAt: int({ mode: "timestamp" }).notNull(),
  post: int().notNull(),
  updatedAt: int({ mode: "timestamp" }).notNull(),
});

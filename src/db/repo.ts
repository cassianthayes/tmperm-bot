import { ordersTable } from "./schema";
import { db } from ".";
import { asc, desc, eq, ne } from "drizzle-orm";

export const insertOrUpdate = async (
  order: Omit<typeof ordersTable.$inferInsert, "updatedAt">,
) => {
  await db
    .insert(ordersTable)
    .values({ ...order, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: ordersTable.id,
      set: { status: order.status, updatedAt: new Date() },
    });
};

export const listOrders = async (
  status?: (typeof ordersTable.$inferSelect)["status"],
) => {
  if (status) {
    if (status === "completed")
      return await db.query.ordersTable.findMany({
        where: eq(ordersTable.status, status),
        orderBy: desc(ordersTable.updatedAt),
        limit: 10,
      });
    return await db.query.ordersTable.findMany({
      where: eq(ordersTable.status, status),
      orderBy: asc(ordersTable.createdAt),
    });
  }
  return await db.query.ordersTable.findMany({
    where: ne(ordersTable.status, "completed"),
    orderBy: asc(ordersTable.createdAt),
  });
};

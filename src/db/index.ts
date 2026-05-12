import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";
import { config } from "../config";

const client = createClient({
  url: config.DATABASE_URL,
  authToken: config.DATABASE_AUTH_TOKEN,
});

export const db = drizzle({ client, schema });

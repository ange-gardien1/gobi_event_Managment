import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";
import { drizzle } from "drizzle-orm/neon-http";

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
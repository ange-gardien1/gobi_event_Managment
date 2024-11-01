
import { defineConfig } from "drizzle-kit"
import './envConfig';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in the environment variables.');
}

export default defineConfig({
  schema: "./app/db/schema.ts",
  dialect: "postgresql",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL!
  },
})
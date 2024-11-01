import {
    boolean,
    timestamp,
    pgTable,
    text,
    primaryKey,
    integer,
  } from "drizzle-orm/pg-core"
  import type { AdapterAccountType } from "next-auth/adapters"

   
  export const users = pgTable("user", {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    name: text("name"),
    email: text("email").unique(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),
  })
   
  export const accounts = pgTable(
    "account",
    {
      userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
      type: text("type").$type<AdapterAccountType>().notNull(),
      provider: text("provider").notNull(),
      providerAccountId: text("providerAccountId").notNull(),
      refresh_token: text("refresh_token"),
      access_token: text("access_token"),
      expires_at: integer("expires_at"),
      token_type: text("token_type"),
      scope: text("scope"),
      id_token: text("id_token"),
      session_state: text("session_state"),
    },
    (account) => ({
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    })
  )
   
  export const sessions = pgTable("session", {
    sessionToken: text("sessionToken").primaryKey(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  })
   
  export const verificationTokens = pgTable(
    "verificationToken",
    {
      identifier: text("identifier").notNull(),
      token: text("token").notNull(),
      expires: timestamp("expires", { mode: "date" }).notNull(),
    },
    (verificationToken) => ({
      compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
      }),
    })
  )
   
  export const authenticators = pgTable(
    "authenticator",
    {
      credentialID: text("credentialID").notNull().unique(),
      userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
      providerAccountId: text("providerAccountId").notNull(),
      credentialPublicKey: text("credentialPublicKey").notNull(),
      counter: integer("counter").notNull(),
      credentialDeviceType: text("credentialDeviceType").notNull(),
      credentialBackedUp: boolean("credentialBackedUp").notNull(),
      transports: text("transports"),
    },
    (authenticator) => ({
      compositePK: primaryKey({
        columns: [authenticator.userId, authenticator.credentialID],
      }),
    })
  )


export const events = pgTable("events", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  description: text("description"),
  date: timestamp("date").notNull(),
  startTime: timestamp("startTime").notNull(),
  endTime: timestamp("endTime").notNull(),
  availableSeats: integer("availableSeats").notNull(),
  bookedSeats: integer("bookedSeats").default(0).notNull(),
  isFree: boolean("isFree").notNull().default(true),
  amount: integer("amount"),
  imageUrl: text("imageUrl"),
});


export const bookings = pgTable("bookings", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  eventId: text("eventId")
    .references(() => events.id, { onDelete: "cascade" })
    .notNull(),
  userId: text("userId").references(() => users.id, { onDelete: "cascade" }),  
  bookingDate: timestamp("bookingDate").defaultNow().notNull(),
  guestEmail: text("guestEmail"),  
});
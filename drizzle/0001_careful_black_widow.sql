CREATE TABLE IF NOT EXISTS "bookings" (
	"id" text PRIMARY KEY NOT NULL,
	"eventId" text NOT NULL,
	"userId" text,
	"bookingDate" timestamp DEFAULT now() NOT NULL,
	"guestEmail" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "events" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"date" timestamp NOT NULL,
	"startTime" timestamp NOT NULL,
	"endTime" timestamp NOT NULL,
	"availableSeats" integer NOT NULL,
	"bookedSeats" integer DEFAULT 0 NOT NULL,
	"isFree" boolean DEFAULT true NOT NULL,
	"amount" integer
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bookings" ADD CONSTRAINT "bookings_eventId_events_id_fk" FOREIGN KEY ("eventId") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bookings" ADD CONSTRAINT "bookings_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

import { z } from "zod";
import {  publicProcedure } from "../../trpc";
import { db } from "@/app/db";
import { bookings, events } from "@/app/db/schema";
import { eq } from "drizzle-orm/expressions";

export const bookSeatInput = z.object({
  eventId: z.string(),
  guestEmail: z.string().email(),
});

export const bookSeat = publicProcedure
  .input(bookSeatInput)
  .mutation(async ({ input }) => {
    const { eventId, guestEmail } = input;

    const [event] = await db
      .select()
      .from(events)
      .where(eq(events.id, eventId))
      .limit(1);

    if (!event) throw new Error("Event not found");

    if (event.availableSeats <= event.bookedSeats) {
      throw new Error("No seats available for this event.");
    }

    const newBooking = await db
      .insert(bookings)
      .values({
        eventId,
        guestEmail,
        bookingDate: new Date(),
      })
      .returning();

    await db
      .update(events)
      .set({
        bookedSeats: event.bookedSeats + 1,
        availableSeats: event.availableSeats - 1,
      })
      .where(eq(events.id, eventId));

    return { message: "Seat successfully booked!", booking: newBooking };
  });

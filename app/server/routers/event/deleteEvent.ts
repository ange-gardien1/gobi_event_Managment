import { z } from "zod";
import { protectedProcedure } from "../../trpc";
import { db } from "@/app/db";
import { events } from "@/app/db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm/expressions";

export const deleteEventInput = z.object({
  eventId: z.string(),
});

export const deleteEvent = protectedProcedure
  .input(deleteEventInput)
  .mutation(async ({ input, ctx }) => {
    const { eventId } = input;

    const event = await db
      .select({
        id: events.id,
        title: events.title,
        description: events.description,
        date: events.date,
        startTime: events.startTime,
        endTime: events.endTime,
        availableSeats: events.availableSeats,
        bookedSeats: events.bookedSeats,
        isFree: events.isFree,
        amount: events.amount,
        imageUrl: events.imageUrl,
        userId: events.userId,
      })
      .from(events)
      .where(eq(events.id, eventId))
      .limit(1)
      .execute();

    if (!event.length) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Event not found.",
      });
    }

    const existingEvent = event[0];

    if (existingEvent.userId !== ctx.session?.user.id) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You are not authorized to delete this event.",
      });
    }

    await db.delete(events).where(eq(events.id, eventId)).execute();
    return { message: "Event deleted successfully." };
  });

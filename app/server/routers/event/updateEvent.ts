import { z } from "zod";
import { protectedProcedure } from "../../trpc";
import { db } from "@/app/db";
import { events } from "@/app/db/schema";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm/expressions";

export const updateEventInput = z.object({

  eventId: z.string(),
  title: z.string().optional(),
  description: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  availableSeats: z.number().optional(),
  isFree: z.boolean().optional(),
  amount: z.number().optional(),
  imageUrl: z.string().optional(),
});

export const updateEvent = protectedProcedure
  .input(updateEventInput)
  .mutation(async ({ input, ctx }) => {
    const { eventId, ...updateFields } = input;
    const userId = ctx.session?.user?.id;

    if (!userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "User not authenticated",
      });
    }

    const event = await db
      .select({
        id: events.id,
        userId: events.userId,
      })
      .from(events)
      .where(eq(events.id, eventId))
      .limit(1)
      .execute();

    if (!event.length) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Event not found",
      });
    }

    const existingEvent = event[0];
    if (existingEvent.userId !== userId) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You are not authorized to update this event",
      });
    }

    const updatedEvent = await db
      .update(events)
      .set({
        ...updateFields,
        startTime: updateFields.startTime
          ? new Date(updateFields.startTime)
          : undefined,
        endTime: updateFields.endTime
          ? new Date(updateFields.endTime)
          : undefined,
      })
      .where(eq(events.id, eventId))
      .returning();

    return updatedEvent;
  });

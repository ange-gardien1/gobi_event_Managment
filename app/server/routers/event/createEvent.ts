import { z } from "zod";
import { protectedProcedure } from "../../trpc";
import { db } from "@/app/db";
import { events } from "@/app/db/schema";

export const createEventInput = z.object({
  title: z.string(),
  description: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  availableSeats: z.number(),
  isFree: z.boolean().default(true),
  amount: z.number().optional(),
  imageUrl: z.string().optional(),
});

export const createEvent = protectedProcedure
  .input(createEventInput)
  .mutation(async ({ input, ctx }) => {
    const userId = ctx.session?.user?.id;

    if (!userId) {
      throw new Error("User not authenticated");
    }

    const newEvent = await db
      .insert(events)
      .values({
        title: input.title,
        description: input.description,
        date: new Date(),
        startTime: new Date(input.startTime),
        endTime: new Date(input.endTime),
        availableSeats: input.availableSeats,
        bookedSeats: 0,
        isFree: input.isFree,
        amount: input.amount,
        imageUrl: input.imageUrl,
        userId, 
      })
      .returning();

    return newEvent;
  });

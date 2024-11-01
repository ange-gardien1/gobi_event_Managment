import { db } from "@/app/db";
import { protectedProcedure } from "../../trpc";

import { eq } from "drizzle-orm";
import { z } from "zod";
import { events } from "@/app/db/schema";

const getEventByIdInput = z.object({
  eventId: z.string().uuid(),
});

export const getEventById = protectedProcedure
  .input(getEventByIdInput)
  .query(async ({ ctx, input }) => {
    const userId = ctx.session?.user?.id;
    if (!userId) {
      throw new Error("User Not Found");
    }

    const event = await db
      .select()
      .from(events)
      .where(eq(events.id, input.eventId))
      .execute();

    if (event.length === 0) {
      throw new Error("Event Not Found");
    }

    return event[0];
  });

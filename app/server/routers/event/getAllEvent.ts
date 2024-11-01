import { db } from "@/app/db";
import { publicProcedure } from "../../trpc";
import { events } from "@/app/db/schema";

export const getEvents = publicProcedure.query(async () => {
  const eventList = await db
    .select({
      id: events.id,
      title: events.title,
      description: events.description,
      startTime: events.startTime,
      endTime: events.endTime,
      availableSeats: events.availableSeats,
      amount: events.amount,
      isFree: events.isFree,
      imageUrl: events.imageUrl,
      userId:events.userId
    })
    .from(events);

  return eventList;
});

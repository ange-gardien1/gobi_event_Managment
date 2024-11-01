import { router } from "../../trpc";
import { createEvent } from "./createEvent";
import { getEvents } from "./getAllEvent";

export const eventsRouter = router({
  createEvent: createEvent,
  getAllEvent: getEvents,
});

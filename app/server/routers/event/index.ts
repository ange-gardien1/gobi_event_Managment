import { router } from "../../trpc";
import { createEvent } from "./createEvent";
import { deleteEvent } from "./deleteEvent";
import { getEvents } from "./getAllEvent";
import { getEventById } from "./getEventById";
import { updateEvent } from "./updateEvent";

export const eventsRouter = router({
  createEvent: createEvent,
  getAllEvent: getEvents,
  deleteMyEvent: deleteEvent,
  updateMyEvent: updateEvent,
  getMyEvent: getEventById
});

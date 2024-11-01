
import { bookseatsRouter } from "./routers/bookSeats";
import { eventsRouter } from "./routers/event";
import { usersRouter } from "./routers/users";
import { router } from "./trpc";

export const appRouter = router({
    users:usersRouter,
    events:eventsRouter,
    bookseat:bookseatsRouter
});
export type AppRouter = typeof appRouter;

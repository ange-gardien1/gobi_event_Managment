import { router } from "../../trpc";
import { bookSeat } from "./bookSeat";

export const bookseatsRouter = router({
  booksSeats: bookSeat,
});

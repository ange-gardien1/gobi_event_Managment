import { trpc } from "../_trpc/client";

export const useBookSeat = () => {
  return trpc.bookseat.booksSeats.useMutation({
    onSuccess: (data) => {
      console.log("Booking successful:", data.message);
    },
    onError: (error) => {
      console.error("Booking error:", error.message);
    },
  });
};

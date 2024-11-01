import { trpc } from "../_trpc/client";

export const useEvents = () => {
  const {
    data: events,
    isPending: isLoadingEvents,
    error: errorEvents,
  } = trpc.events.getAllEvent.useQuery();
  return {
    events,
    isLoadingEvents,
    errorEvents,
  };
};

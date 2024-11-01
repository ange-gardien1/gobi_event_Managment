import { trpc } from "../_trpc/client";

export const useEvents = () => {
  const {
    data: events,
    isLoading: isLoadingEvents, 
    error: errorEvents,
    refetch, 
  } = trpc.events.getAllEvent.useQuery();

  return {
    events,
    isLoadingEvents,
    errorEvents,
    refetch, 
  };
};

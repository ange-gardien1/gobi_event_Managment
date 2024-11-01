import { useToast } from "@/hooks/use-toast";
import { trpc } from "../_trpc/client";

export const useDeleteEvent = () => {
  const { toast } = useToast();

  const deleteEventMutation = trpc.events.deleteMyEvent.useMutation({
    onSuccess: () => {
      toast({
        title: "Event deleted successfully!",
        description: "The event has been permanently removed.",
      });
    },
    onError: (error) => {
      console.error("Failed to delete event:", error);
      toast({
        title: "Failed to delete event",
        description: `Error: ${error.message}. Please try again.`,
        variant: "destructive",
      });
    },
  });

  return deleteEventMutation;
};

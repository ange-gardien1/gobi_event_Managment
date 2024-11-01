import { useToast } from "@/hooks/use-toast";
import { trpc } from "../_trpc/client";

export const useUpdateEvent = () => {
  const { toast } = useToast();

  const updateEventMutation = trpc.events.updateMyEvent.useMutation({
    onSuccess: () => {
      toast({
        title: "Event updated successfully!",
        description: "Your changes have been saved.",
      });
    },
    onError: (error) => {
      console.error("Failed to update event:", error);
      toast({
        title: "Failed to update event",
        description: `Error: ${error.message}. Please try again.`,
        variant: "destructive",
      });
    },
  });

  return updateEventMutation;
};

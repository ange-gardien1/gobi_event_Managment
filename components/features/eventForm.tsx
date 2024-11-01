"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { eventFormSchema } from "@/lib/validator";
import { FileUploader } from "./fileUploader";
import { useState, useEffect } from "react";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { trpc } from "@/app/_trpc/client";

type EventFormProps = {
  userId: string;
  type: "Create" | "Update";
  eventId?: string;
};

const EventForm = ({ userId, type, eventId }: EventFormProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      description: "",
      startDateTime: new Date(),
      endDateTime: new Date(),
      availableSeats: 100,
      imageUrl: "",
      isFree: false,
      price: "",
    },
  });

  const createEventMutation = trpc.events.createEvent.useMutation();
  const updateEventMutation = trpc.events.updateMyEvent.useMutation();

  const {
    data: eventData,
    isLoading,
    error,
  } = trpc.events.getMyEvent.useQuery(
    { eventId: eventId || "" },
    { enabled: type === "Update" && !!eventId }
  );

  useEffect(() => {
    if (eventData && type === "Update") {
      form.reset({
        title: eventData.title,
        description: eventData.description || "",
        startDateTime: new Date(eventData.startTime),
        endDateTime: new Date(eventData.endTime),
        availableSeats: eventData.availableSeats,
        imageUrl: eventData.imageUrl?.startsWith("http") ? eventData.imageUrl : "", 
        isFree: eventData.isFree,
        price: eventData.amount ? eventData.amount.toString() : "",
      });
    }
  }, [eventData, form, type]);

  const onSubmit = async (values: z.infer<typeof eventFormSchema>) => {
    const formattedValues = {
      ...values,
      startTime: values.startDateTime.toISOString(),
      endTime: values.endDateTime.toISOString(),
      imageUrl: files[0]?.name || values.imageUrl,
      amount: values.isFree ? 0 : parseFloat(values.price) || 0,
      userId,
    };

    setIsSubmitting(true);
    try {
      if (type === "Create") {
        await createEventMutation.mutateAsync(formattedValues);
        alert("Event created successfully!");
      } else if (type === "Update" && eventId) {
        await updateEventMutation.mutateAsync({ eventId, ...formattedValues });
        alert("Event updated successfully!");
      }
    } catch (error) {
      console.error(`Failed to ${type.toLowerCase()} event:`, error);
      alert(`Failed to ${type.toLowerCase()} event`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <p>Loading event data...</p>;
  if (error) return <p>Error loading event data: {error.message}</p>;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Event Title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Event Description"
                  {...field}
                  className="textarea rounded-2xl"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Image</FormLabel>
              <FormControl>
                <FileUploader
                  onFieldChange={field.onChange}
                  imageUrl={field.value}
                  setFiles={setFiles}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="startDateTime"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Start Date and Time</FormLabel>
              <FormControl>
                <Input
                  type="datetime-local"
                  value={
                    field.value ? format(field.value, "yyyy-MM-dd'T'HH:mm") : ""
                  }
                  onChange={(e) => field.onChange(new Date(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endDateTime"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>End Date and Time</FormLabel>
              <FormControl>
                <Input
                  type="datetime-local"
                  value={
                    field.value ? format(field.value, "yyyy-MM-dd'T'HH:mm") : ""
                  }
                  onChange={(e) => field.onChange(new Date(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Price"
                  {...field}
                  className="p-regular-16 border-0 bg-grey-50"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isFree"
          render={({ field }) => (
            <FormItem className="flex items-center">
              <Checkbox
                onCheckedChange={field.onChange}
                checked={field.value}
                id="isFree"
              />
              <FormLabel
                htmlFor="isFree"
                className="whitespace-nowrap pr-3 leading-none"
              >
                Free Ticket
              </FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="availableSeats"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Available Seats</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Available Seats"
                  {...field}
                  className="p-regular-16 border-0 bg-grey-50"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="mt-4" disabled={isSubmitting}>
          {isSubmitting ? "Processing..." : `${type} Event`}
        </Button>
      </form>
    </Form>
  );
};

export default EventForm;

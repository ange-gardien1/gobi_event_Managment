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
import { eventDefaultValues } from "@/app/headerLinks";
import { FileUploader } from "./fileUploader";
import { useState } from "react";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { trpc } from "@/app/_trpc/client";

type EventFormProps = {
  userId: string;
  type: "Create" | "Update";
};

const EventForm = ({ userId, type }: EventFormProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const initialValues = eventDefaultValues;
  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: initialValues,
  });

  const createEventMutation = trpc.events.createEvent.useMutation();
  const [isCreating, setIsCreating] = useState(false); // State for tracking event creation status

  const onSubmit = async (values: z.infer<typeof eventFormSchema>) => {
    const formattedValues = {
      title: values.title,
      description: values.description,
      startTime: values.startDateTime.toISOString(), // Convert to string
      endTime: values.endDateTime.toISOString(),      // Convert to string
      availableSeats: values.availableSeats || 100,
      imageUrl: files[0]?.name || values.imageUrl,
      isFree: values.isFree,
      amount: values.isFree ? 0 : parseFloat(values.price) || 0,
      userId,
    };

    setIsCreating(true); // Set creating status to true
    try {
      const response = await createEventMutation.mutateAsync(formattedValues);
      console.log("Event created:", response);
      alert("Event created successfully!"); 
    } catch (error) {
      console.error("Failed to create event:", error);
      alert("Failed to create event: " ); 
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
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
              <FormControl className="h-72">
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
              <FormControl className="h-72">
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
                  onChange={(e) => {
                    const dateValue = new Date(e.target.value);
                    field.onChange(dateValue); // Send Date object to state
                  }}
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
                  onChange={(e) => {
                    const dateValue = new Date(e.target.value);
                    field.onChange(dateValue); // Send Date object to state
                  }}
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
                  className="p-regular-16 border-0 bg-grey-50 outline-offset-0 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
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
                className="mr-2 h-5 w-5 border-2 border-primary-500"
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
                  className="p-regular-16 border-0 bg-grey-50 outline-offset-0 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="mt-4" disabled={isCreating}>
          {isCreating ? "Creating event is pending..." : `${type} Event`}
        </Button>
      </form>
    </Form>
  );
};

export default EventForm;

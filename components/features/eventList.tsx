"use client";

import { useEvents } from "@/app/hooks/useEvents";
import Image from "next/image";
import React from "react";

const EventsDisplay = () => {
  const { events, isLoadingEvents, errorEvents } = useEvents();
  const BASE_URL = "http://localhost:3000";
  if (isLoadingEvents) {
    return <p>Loading...</p>;
  }

  if (errorEvents) {
    return <p>Error loading events!</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {events?.map((event) => (
        <div key={event.title} className="p-4 border rounded shadow">
          {event.imageUrl ? (
            <Image
              src={`${BASE_URL}${
                event.imageUrl.startsWith("/")
                  ? event.imageUrl
                  : `/${event.imageUrl}`
              }`}
              alt={event.title}
              width={400}
              height={300}
              className="object-cover rounded"
            />
          ) : (
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded">
              <p>No Image Available</p>
            </div>
          )}
          <h3 className="mt-2 text-xl font-semibold">{event.title}</h3>
          <p>{event.description}</p>
          <p>
            {event.isFree ? "Free" : `$${event.amount}`} - Seats available:{" "}
            {event.availableSeats}
          </p>
          <p>
            {new Date(event.startTime).toLocaleString()} -{" "}
            {new Date(event.endTime).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default EventsDisplay;

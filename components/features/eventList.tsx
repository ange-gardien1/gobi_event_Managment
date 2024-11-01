"use client";

import { useState } from "react";
import { useEvents } from "@/app/hooks/useEvents"; // Ensure this path is correct
import { useBookSeat } from "@/app/hooks/useBookSeat"; // Assuming this hook is created
import { useDeleteEvent } from "@/app/hooks/useDeleteEvent"; // Import the delete event hook
import Image from "next/image";
import { useSession } from "next-auth/react";

export interface Event {
  id: string;
  title: string;
  description: string | null;
  startTime: string;
  endTime: string;
  availableSeats: number;
  isFree: boolean;
  amount: number | null;
  imageUrl: string | null;
  userId : string
}

const EventsDisplay = () => {
    const { data: session } = useSession();
    const loggedInUserId = session?.user?.id;
  const { events, isLoadingEvents, errorEvents, refetch } = useEvents();
  const bookSeatMutation = useBookSeat();
  const deleteEventMutation = useDeleteEvent(); 


  const [isPopupOpen, setPopupOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [guestEmail, setGuestEmail] = useState("");
  const [isBooking, setIsBooking] = useState(false); // State to track booking status

  const handleBookButtonClick = (eventId: string) => {
    setSelectedEventId(eventId);
    setPopupOpen(true);
  };

  const handleSubmitBooking = () => {
    if (selectedEventId && guestEmail) {
      setIsBooking(true); // Set booking state to true
      bookSeatMutation.mutate(
        { eventId: selectedEventId, guestEmail },
        {
          onSuccess: () => {
            alert("Booking successful!");
            setPopupOpen(false);
            setGuestEmail("");
            refetch(); // Call refetch to update the events
            setIsBooking(false); // Reset booking state
          },
          onError: (error) => {
            alert(`Booking failed: ${error.message}`);
            setIsBooking(false); // Reset booking state
          },
        }
      );
    }
  };

  const handleDeleteEvent = (eventId: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      deleteEventMutation.mutate(
        { eventId }, // Pass the eventId to the delete mutation
        {
          onSuccess: () => {
            refetch(); // Refetch the events after deletion
          },
        }
      );
    }
  };

  if (isLoadingEvents) {
    return <p>Loading...</p>;
  }

  if (errorEvents) {
    return <p>Error loading events!</p>;
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {events?.map((event) => (
          <div key={event.id} className="p-4 border rounded shadow">
            {event.imageUrl ? (
              <Image
                src={`${event.imageUrl.startsWith("/") ? event.imageUrl : `/${event.imageUrl}`}`}
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
              {event.isFree ? "Free" : `$${event.amount}`} - Seats available: {event.availableSeats}
            </p>
            <p>
              {new Date(event.startTime).toLocaleString()} - {new Date(event.endTime).toLocaleString()}
            </p>
            <button
              onClick={() => handleBookButtonClick(event.id)}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
            >
              Book
            </button>
            {loggedInUserId === event.userId && (
              <button
                onClick={() => handleDeleteEvent(event.id)}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Popup Modal */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Book Your Seat</h2>
            <input
              type="email"
              placeholder="Enter your email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              className="w-full p-2 border rounded mb-4"
            />
            <div className="flex justify-end">
              <button
                onClick={() => setPopupOpen(false)}
                className="px-4 py-2 mr-2 bg-gray-300 text-gray-700 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitBooking}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Submit
              </button>
            </div>
            {isBooking && <p className="mt-4 text-yellow-600">Booking seat is pending...</p>} {/* Show pending message */}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsDisplay;



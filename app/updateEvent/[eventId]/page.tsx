'use client';

import { useEffect, useState } from "react";
import { auth } from "@/auth";
import EventForm from "@/components/features/eventForm";
import Header from "@/components/features/header";
import { useRouter } from "next/router";

export default function UpdateEvent() {
  const router = useRouter();
  const { eventId } = router.query; 
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const session = await auth();
      if (session?.user?.id) {
        setUserId(session.user.id);
      } else {
        router.push("/signin");
      }
      setLoading(false);
    };

    fetchSession();
  }, [router]);

  if (loading) {
    return <p>Loading...</p>; 
  }

 
  const validEventId = typeof eventId === "string" ? eventId : "";

  if (!userId || !validEventId) {
    return <p>Invalid user or event ID.</p>; 
  }

  return (
    <>
      <Header />
      <section className="bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h2 className="wrapper h3-bold text-center sm:text-left">
          Update Event
        </h2>
      </section>
      <div className="wrapper my-8">
        <EventForm userId={userId} eventId={validEventId} type="Update" />
      </div>
    </>
  );
}

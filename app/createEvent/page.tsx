import { auth } from "@/auth";
import EventForm from "@/components/features/eventForm";
import Header from "@/components/features/header";
import { redirect } from "next/navigation";

import React from "react";

export default async function CreateEvent() {
  const session = await auth();
  const user = session?.user.id;
  if (!user) {
    redirect("/signin");
  }
  return (
    <>
      <Header />
      {/* <NavBar/> */}
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left">
          Create Event
        </h3>
      </section>

      <div className="wrapper my-8">
        <EventForm userId={user} type="Create" />
      </div>
    </>
  );
}
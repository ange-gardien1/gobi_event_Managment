import { auth } from "@/auth";
import EventForm from "@/components/features/eventForm";
import { redirect } from "next/navigation";

import React from "react";

export default async function UpdateEvent() {
  const session = await auth();
  const user = session?.user.id;
  if (!user) {
    redirect("/signin");
  }
  return (
    <>
      <section className=" bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left">
          UpdateEvent
        </h3>
      </section>

      <div className="wrapper my-8">
        <EventForm userId={user} type="Update" />
      </div>
    </>
  );
}

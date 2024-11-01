import { auth } from "@/auth";
import EventForm from "@/components/features/eventForm";
import Header from "@/components/features/header";
import { redirect } from "next/navigation";

type PageProps = {
  params: {
    eventId: string;
  };
};

export default async function UpdateEvent({ params }: PageProps) {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/signin");
  }

  return (
    <>
      <Header />
      <section className="bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left">
          Update Event
        </h3>
      </section>

      <div className="wrapper my-8">
        <EventForm userId={userId} eventId={params.eventId} type="Update" />
      </div>
    </>
  );
}

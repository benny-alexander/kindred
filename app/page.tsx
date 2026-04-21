import { supabase } from "@/lib/supabase";
import { HomeView } from "@/components/home-view";
import type { Booking } from "@/lib/bookings";

export const dynamic = "force-dynamic";

async function getUpcoming(): Promise<Booking[]> {
  const today = new Date().toISOString().slice(0, 10);
  const { data } = await supabase
    .from("bookings")
    .select("*")
    .gte("end_date", today)
    .order("start_date", { ascending: true });
  return (data ?? []) as Booking[];
}

export default async function Page() {
  const bookings = await getUpcoming();

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-xl px-5 py-10 sm:py-14">
        <header className="mb-10">
          <h1 className="font-serif text-5xl sm:text-6xl tracking-tight text-stone-900 leading-none">
            Kindred
          </h1>
          <p className="text-stone-500 mt-3 text-base">Who's at the farm, when.</p>
        </header>

        <HomeView bookings={bookings} />
      </div>
    </main>
  );
}

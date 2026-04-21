import { supabase } from "@/lib/supabase";
import { BookingForm } from "@/components/booking-form";
import { BookingCard } from "@/components/booking-card";
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

        {bookings.length > 0 && (
          <section className="mb-12">
            <div className="flex items-baseline justify-between mb-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-500">
                Upcoming
              </h2>
              <span className="text-xs text-stone-400">{bookings.length} {bookings.length === 1 ? "stay" : "stays"}</span>
            </div>
            <div className="space-y-3">
              {bookings.map((b) => (
                <BookingCard key={b.id} booking={b} />
              ))}
            </div>
          </section>
        )}

        <section>
          <div className="mb-6">
            <h2 className="font-serif text-3xl text-stone-900 tracking-tight">
              Book a stay
            </h2>
            <p className="text-stone-500 text-sm mt-1">
              Takes about ten seconds.
            </p>
          </div>
          <BookingForm />
        </section>

        {bookings.length === 0 && (
          <p className="mt-8 text-center text-xs text-stone-400">
            No bookings yet — be the first.
          </p>
        )}
      </div>
    </main>
  );
}

"use client";

import { useState } from "react";
import { BookingCard } from "./booking-card";
import { BookingForm } from "./booking-form";
import { MonthCalendar } from "./month-calendar";
import type { Booking } from "@/lib/bookings";

type View = "month" | "list";

export function HomeView({ bookings }: { bookings: Booking[] }) {
  const [view, setView] = useState<View>("month");

  return (
    <>
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-500">
            {view === "month" ? "Calendar" : "Upcoming"}
          </h2>
          <div
            role="tablist"
            aria-label="View"
            className="flex items-center gap-1 rounded-full bg-stone-100 p-1"
          >
            <button
              type="button"
              role="tab"
              aria-selected={view === "month"}
              onClick={() => setView("month")}
              className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                view === "month"
                  ? "bg-white text-stone-900 shadow-sm"
                  : "text-stone-500 hover:text-stone-900"
              }`}
            >
              Month
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={view === "list"}
              onClick={() => setView("list")}
              className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                view === "list"
                  ? "bg-white text-stone-900 shadow-sm"
                  : "text-stone-500 hover:text-stone-900"
              }`}
            >
              List
            </button>
          </div>
        </div>

        {view === "month" ? (
          <MonthCalendar bookings={bookings} />
        ) : bookings.length > 0 ? (
          <div className="space-y-3">
            {bookings.map((b) => (
              <BookingCard key={b.id} booking={b} />
            ))}
          </div>
        ) : (
          <p className="text-center text-xs text-stone-400 py-4">
            No bookings yet — be the first.
          </p>
        )}
      </section>

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
    </>
  );
}

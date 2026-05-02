"use client";

import { useRef, useState } from "react";
import { format, parseISO } from "date-fns";
import { X } from "lucide-react";
import { BookingCard } from "./booking-card";
import { BookingForm } from "./booking-form";
import { BookingEditDialog } from "./booking-edit-dialog";
import { MonthCalendar } from "./month-calendar";
import type { Booking } from "@/lib/bookings";

type View = "month" | "list";

export function HomeView({ bookings }: { bookings: Booking[] }) {
  const [view, setView] = useState<View>("month");
  const [selectedStart, setSelectedStart] = useState<string | null>(null);
  const [selectedEnd, setSelectedEnd] = useState<string | null>(null);
  const [editing, setEditing] = useState<Booking | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  function handleSelect(start: string | null, end: string | null) {
    setSelectedStart(start);
    setSelectedEnd(end);
    if (start && end && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function clearSelection() {
    setSelectedStart(null);
    setSelectedEnd(null);
  }

  const hasSelection = Boolean(selectedStart);
  const fullRange = Boolean(selectedStart && selectedEnd);

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
          <>
            <MonthCalendar
              bookings={bookings}
              selectedStart={selectedStart}
              selectedEnd={selectedEnd}
              onSelect={handleSelect}
              onEdit={(b) => setEditing(b)}
            />
            <div className="mt-3 min-h-[2rem] flex items-center justify-center">
              {hasSelection ? (
                <div className="inline-flex items-center gap-2 rounded-full bg-stone-900 text-white px-4 py-1.5 text-xs sm:text-sm font-medium shadow-sm">
                  <span>
                    {fullRange
                      ? `${format(parseISO(selectedStart!), "EEE d MMM")} → ${format(parseISO(selectedEnd!), "EEE d MMM")}`
                      : `Arrive ${format(parseISO(selectedStart!), "EEE d MMM")} — now tap a leave date`}
                  </span>
                  <button
                    type="button"
                    onClick={clearSelection}
                    aria-label="Clear selection"
                    className="hover:bg-white/15 rounded-full p-0.5 -mr-1.5 transition"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <p className="text-xs text-stone-400">
                  Tap a day to start a booking
                </p>
              )}
            </div>
          </>
        ) : bookings.length > 0 ? (
          <div className="space-y-3">
            {bookings.map((b) => (
              <BookingCard key={b.id} booking={b} onEdit={setEditing} />
            ))}
          </div>
        ) : (
          <p className="text-center text-xs text-stone-400 py-4">
            No bookings yet — be the first.
          </p>
        )}
      </section>

      <section ref={formRef}>
        <div className="mb-6">
          <h2 className="font-serif text-3xl text-stone-900 tracking-tight">
            Book a stay
          </h2>
          <p className="text-stone-500 text-sm mt-1">
            Takes about ten seconds.
          </p>
        </div>
        <BookingForm
          initialStart={selectedStart}
          initialEnd={selectedEnd}
          onAfterSubmit={clearSelection}
          bookings={bookings}
        />
      </section>

      {editing && (
        <BookingEditDialog
          booking={editing}
          bookings={bookings}
          open={true}
          onOpenChange={(open) => {
            if (!open) setEditing(null);
          }}
        />
      )}
    </>
  );
}

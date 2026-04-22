"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  FAMILIES,
  BUILDINGS,
  type Family,
  type Building,
  type Booking,
} from "@/lib/bookings";

type Props = {
  existing?: Booking;
  onDone?: () => void;
  variant?: "page" | "modal";
  initialStart?: string | null;
  initialEnd?: string | null;
  onAfterSubmit?: () => void;
};

export function BookingForm({
  existing,
  onDone,
  variant = "page",
  initialStart,
  initialEnd,
  onAfterSubmit,
}: Props) {
  const router = useRouter();
  const [family, setFamily] = useState<Family | "">(existing?.family ?? "");
  const [building, setBuilding] = useState<Building | "">(existing?.building ?? "");
  const [startDate, setStartDate] = useState(existing?.start_date ?? initialStart ?? "");
  const [endDate, setEndDate] = useState(existing?.end_date ?? initialEnd ?? "");
  const [notes, setNotes] = useState(existing?.notes ?? "");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (existing) return;
    if (initialStart !== undefined) setStartDate(initialStart ?? "");
    if (initialEnd !== undefined) setEndDate(initialEnd ?? "");
  }, [existing, initialStart, initialEnd]);

  const canSubmit = family && building && startDate && endDate && !submitting;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);

    const isEdit = Boolean(existing);
    const url = isEdit ? `/api/bookings/${existing!.id}` : "/api/bookings";
    const method = isEdit ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ family, building, start_date: startDate, end_date: endDate, notes }),
    });

    const json = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      toast.error(json.error ?? "Something went wrong");
      return;
    }

    toast.success(isEdit ? "Booking updated" : "You're booked in");
    if (!isEdit) {
      setFamily("");
      setBuilding("");
      setStartDate("");
      setEndDate("");
      setNotes("");
      onAfterSubmit?.();
    }
    router.refresh();
    onDone?.();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section>
        <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-3">
          Who's staying
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {FAMILIES.map((f) => {
            const active = family === f.value;
            return (
              <button
                type="button"
                key={f.value}
                onClick={() => setFamily(f.value)}
                className={`rounded-2xl py-4 px-2 text-center transition border-2 ${
                  active
                    ? `${f.bg} border-stone-900 shadow-sm`
                    : "bg-white border-stone-200 hover:border-stone-300"
                }`}
              >
                <div className={`h-3 w-3 ${f.dot} rounded-full mx-auto mb-2`} />
                <div className="text-sm font-semibold text-stone-900">{f.label}</div>
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-3">
          Where
        </h3>
        <div className="space-y-2">
          {BUILDINGS.map((b) => {
            const active = building === b.value;
            return (
              <button
                type="button"
                key={b.value}
                onClick={() => setBuilding(b.value)}
                className={`w-full rounded-2xl py-4 px-5 text-left transition border-2 flex items-center gap-4 bg-gradient-to-br ${b.gradient} ${
                  active ? "border-stone-900 shadow-sm" : "border-transparent hover:border-stone-300"
                }`}
              >
                <div className="text-3xl">{b.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-stone-900">{b.label}</div>
                  <div className="text-sm text-stone-600">{b.blurb}</div>
                  <div className="text-xs text-stone-600 mt-1.5 leading-snug">
                    🛏 {b.beds}
                  </div>
                  <div className="text-xs text-stone-600 leading-snug">
                    🚿 {b.bathroom}
                  </div>
                </div>
                <div
                  className={`h-5 w-5 rounded-full border-2 transition ${
                    active ? "bg-stone-900 border-stone-900" : "border-stone-300"
                  }`}
                >
                  {active && (
                    <svg viewBox="0 0 20 20" fill="white" className="h-full w-full p-0.5">
                      <path d="M7.629 14.571L3.4 10.342l1.414-1.414 2.815 2.815 7.571-7.571 1.414 1.414z" />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-3">
          When
        </h3>
        <div className="grid grid-cols-2 gap-2 rounded-2xl border border-stone-200 bg-white overflow-hidden">
          <label className="block p-4 border-r border-stone-200 cursor-pointer">
            <div className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Arrive</div>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 w-full bg-transparent text-base font-medium text-stone-900 outline-none"
            />
          </label>
          <label className="block p-4 cursor-pointer">
            <div className="text-xs font-semibold text-stone-500 uppercase tracking-wide">Leave</div>
            <input
              type="date"
              value={endDate}
              min={startDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 w-full bg-transparent text-base font-medium text-stone-900 outline-none"
            />
          </label>
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-3">
          Anything to add?{" "}
          <span className="font-normal text-stone-400 normal-case tracking-normal">Optional</span>
        </h3>
        <textarea
          placeholder="Arriving Friday arvo, leaving Sunday. Bringing the dog."
          value={notes ?? ""}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full rounded-2xl border border-stone-200 bg-white p-4 text-base text-stone-900 outline-none focus:border-stone-400 resize-none placeholder:text-stone-400"
        />
      </section>

      <button
        type="submit"
        disabled={!canSubmit}
        className="w-full h-14 rounded-full bg-stone-900 text-white font-semibold text-base disabled:opacity-40 disabled:cursor-not-allowed transition hover:bg-stone-800 shadow-lg shadow-stone-900/10"
      >
        {submitting ? "Saving…" : existing ? "Update booking" : "Book your stay"}
      </button>
    </form>
  );
}

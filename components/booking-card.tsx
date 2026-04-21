"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format, parseISO, differenceInCalendarDays } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { BookingForm } from "./booking-form";
import { familyMeta, buildingMeta, type Booking } from "@/lib/bookings";

function formatRange(start: string, end: string) {
  const s = parseISO(start);
  const e = parseISO(end);
  const sameMonth = s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear();
  if (sameMonth) return `${format(s, "EEE d")} – ${format(e, "EEE d MMM")}`;
  return `${format(s, "EEE d MMM")} – ${format(e, "EEE d MMM")}`;
}

export function BookingCard({ booking }: { booking: Booking }) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const f = familyMeta(booking.family);
  const b = buildingMeta(booking.building);
  const nights = differenceInCalendarDays(parseISO(booking.end_date), parseISO(booking.start_date));

  async function handleDelete() {
    if (!confirm(`Delete ${f.label}'s booking?`)) return;
    setDeleting(true);
    const res = await fetch(`/api/bookings/${booking.id}`, { method: "DELETE" });
    setDeleting(false);
    if (!res.ok) {
      toast.error("Couldn't delete");
      return;
    }
    toast.success("Booking deleted");
    router.refresh();
  }

  return (
    <article className="rounded-3xl bg-white border border-stone-200 overflow-hidden shadow-sm">
      <div className={`bg-gradient-to-br ${b.gradient} px-5 py-4 flex items-center gap-3`}>
        <div className="text-3xl">{b.emoji}</div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold uppercase tracking-wide text-stone-500">
            {b.label}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`h-2.5 w-2.5 rounded-full ${f.dot}`} />
            <span className="font-semibold text-stone-900 truncate">{f.label}</span>
          </div>
        </div>
      </div>

      <div className="px-5 py-4">
        <div className="text-lg font-semibold text-stone-900">
          {formatRange(booking.start_date, booking.end_date)}
        </div>
        <div className="text-sm text-stone-500 mt-0.5">
          {nights} {nights === 1 ? "night" : "nights"}
        </div>

        {booking.notes && (
          <p className="text-sm text-stone-700 mt-3 leading-relaxed whitespace-pre-wrap">
            {booking.notes}
          </p>
        )}

        <div className="flex items-center gap-1 mt-4 -mx-2">
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogTrigger className="text-sm font-medium text-stone-600 hover:text-stone-900 px-2 py-1 rounded-md hover:bg-stone-50 transition">
              Edit
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Edit booking</DialogTitle>
              </DialogHeader>
              <BookingForm
                existing={booking}
                variant="modal"
                onDone={() => setEditOpen(false)}
              />
            </DialogContent>
          </Dialog>
          <span className="text-stone-300">·</span>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="text-sm font-medium text-stone-600 hover:text-red-600 px-2 py-1 rounded-md hover:bg-stone-50 transition disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}

"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BookingForm } from "./booking-form";
import type { Booking } from "@/lib/bookings";

type Props = {
  booking: Booking;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookings?: Booking[];
};

export function BookingEditDialog({ booking, open, onOpenChange, bookings }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit booking</DialogTitle>
        </DialogHeader>
        <BookingForm
          existing={booking}
          variant="modal"
          bookings={bookings}
          onDone={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

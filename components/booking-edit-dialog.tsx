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
};

export function BookingEditDialog({ booking, open, onOpenChange }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit booking</DialogTitle>
        </DialogHeader>
        <BookingForm
          existing={booking}
          variant="modal"
          onDone={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

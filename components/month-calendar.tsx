"use client";

import { useState } from "react";
import {
  addMonths,
  differenceInCalendarDays,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  max,
  min,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  buildingMeta,
  familyMeta,
  type Booking,
} from "@/lib/bookings";
import { BookingEditDialog } from "./booking-edit-dialog";

type Props = { bookings: Booking[] };

type PillLayout = {
  booking: Booking;
  col: number;
  span: number;
  lane: number;
  roundedLeft: boolean;
  roundedRight: boolean;
};

const WEEK_OPTS = { weekStartsOn: 1 as const };

function layoutWeek(
  weekStart: Date,
  weekEnd: Date,
  bookings: { booking: Booking; start: Date; end: Date }[],
): PillLayout[] {
  const inWeek = bookings
    .filter((b) => b.end >= weekStart && b.start <= weekEnd)
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  const lanes: Date[] = [];
  return inWeek.map((b) => {
    const pillStart = max([b.start, weekStart]);
    const pillEnd = min([b.end, weekEnd]);
    let lane = lanes.findIndex((end) => end < pillStart);
    if (lane === -1) {
      lane = lanes.length;
      lanes.push(pillEnd);
    } else {
      lanes[lane] = pillEnd;
    }
    return {
      booking: b.booking,
      col: differenceInCalendarDays(pillStart, weekStart) + 1,
      span: differenceInCalendarDays(pillEnd, pillStart) + 1,
      lane,
      roundedLeft: isSameDay(b.start, pillStart),
      roundedRight: isSameDay(b.end, pillEnd),
    };
  });
}

export function MonthCalendar({ bookings }: Props) {
  const [visibleMonth, setVisibleMonth] = useState(() => startOfMonth(new Date()));
  const [editing, setEditing] = useState<Booking | null>(null);

  const monthStart = startOfMonth(visibleMonth);
  const monthEnd = endOfMonth(visibleMonth);
  const gridStart = startOfWeek(monthStart, WEEK_OPTS);
  const gridEnd = endOfWeek(monthEnd, WEEK_OPTS);
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  const parsed = bookings.map((b) => ({
    booking: b,
    start: parseISO(b.start_date),
    end: parseISO(b.end_date),
  }));

  const weeks: { start: Date; end: Date; days: Date[] }[] = [];
  for (let i = 0; i < days.length; i += 7) {
    const wDays = days.slice(i, i + 7);
    weeks.push({ start: wDays[0], end: wDays[6], days: wDays });
  }

  const today = new Date();
  const onCurrentMonth = isSameMonth(visibleMonth, today);
  const weekdayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const bookingsInView = parsed.filter(
    (b) => b.end >= gridStart && b.start <= gridEnd,
  ).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setVisibleMonth((d) => subMonths(d, 1))}
            aria-label="Previous month"
            className="h-9 w-9 grid place-items-center rounded-full text-stone-600 hover:bg-stone-100 transition"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => setVisibleMonth((d) => addMonths(d, 1))}
            aria-label="Next month"
            className="h-9 w-9 grid place-items-center rounded-full text-stone-600 hover:bg-stone-100 transition"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <h2 className="font-serif text-2xl sm:text-3xl text-stone-900 tracking-tight ml-1">
            {format(visibleMonth, "MMMM yyyy")}
          </h2>
        </div>
        {!onCurrentMonth && (
          <button
            type="button"
            onClick={() => setVisibleMonth(startOfMonth(new Date()))}
            className="text-xs font-medium text-stone-500 hover:text-stone-900 px-3 py-1.5 rounded-full hover:bg-stone-100 transition"
          >
            Today
          </button>
        )}
      </div>

      <div className="grid grid-cols-7 mb-1 px-1">
        {weekdayLabels.map((d) => (
          <div
            key={d}
            className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-stone-400 text-center"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-stone-200 bg-white overflow-hidden">
        {weeks.map((week, wi) => {
          const pills = layoutWeek(week.start, week.end, parsed);
          const laneCount = pills.reduce((m, p) => Math.max(m, p.lane + 1), 0);

          return (
            <div
              key={wi}
              className={`grid grid-cols-7 px-1 py-1 ${
                wi > 0 ? "border-t border-stone-100" : ""
              }`}
              style={{
                gridTemplateRows: `auto ${"minmax(1.5rem, auto) ".repeat(laneCount)}`.trim(),
              }}
            >
              {week.days.map((d, di) => {
                const outside = !isSameMonth(d, visibleMonth);
                const isD = isToday(d);
                return (
                  <div
                    key={di}
                    style={{ gridColumn: di + 1, gridRow: 1 }}
                    className="px-1.5 pt-1.5 pb-1"
                  >
                    <span
                      className={`inline-grid place-items-center text-xs sm:text-sm tabular-nums h-6 w-6 rounded-full ${
                        isD
                          ? "bg-stone-900 text-white font-semibold"
                          : outside
                            ? "text-stone-300"
                            : "text-stone-700"
                      }`}
                    >
                      {format(d, "d")}
                    </span>
                  </div>
                );
              })}

              {pills.map((p, pi) => {
                const b = buildingMeta(p.booking.building);
                const f = familyMeta(p.booking.family);
                return (
                  <button
                    type="button"
                    key={pi}
                    onClick={() => setEditing(p.booking)}
                    title={`${f.label} · ${b.label} · ${format(
                      parseISO(p.booking.start_date),
                      "EEE d MMM",
                    )} – ${format(parseISO(p.booking.end_date), "EEE d MMM")}`}
                    style={{
                      gridColumn: `${p.col} / span ${p.span}`,
                      gridRow: p.lane + 2,
                    }}
                    className={`mx-0.5 my-0.5 h-6 sm:h-7 min-w-0 overflow-hidden flex items-center gap-1 sm:gap-1.5 px-1.5 sm:px-2 bg-gradient-to-r ${b.gradient} text-stone-900 text-[10px] sm:text-xs font-medium hover:brightness-95 transition ${
                      p.roundedLeft ? "rounded-l-full" : ""
                    } ${p.roundedRight ? "rounded-r-full" : ""}`}
                  >
                    <span
                      aria-hidden
                      className="text-sm sm:text-base leading-none shrink-0"
                    >
                      {b.emoji}
                    </span>
                    <span
                      aria-hidden
                      className={`h-2 w-2 rounded-full ${f.dot} shrink-0`}
                    />
                    <span className="truncate hidden sm:inline">
                      {f.initials}
                    </span>
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      {bookingsInView === 0 && (
        <p className="mt-4 text-center text-xs text-stone-400">
          No stays this month.
        </p>
      )}

      {editing && (
        <BookingEditDialog
          booking={editing}
          open={true}
          onOpenChange={(open) => {
            if (!open) setEditing(null);
          }}
        />
      )}
    </div>
  );
}

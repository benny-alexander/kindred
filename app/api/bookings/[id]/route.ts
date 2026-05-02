import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import {
  bookingDisplayName,
  buildingLabel,
  type Booking,
  type Family,
  type Building,
} from "@/lib/bookings";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = (await req.json()) as {
    family: Family;
    building: Building;
    start_date: string;
    end_date: string;
    notes?: string;
    staying?: string | null;
  };

  const { data, error } = await supabase
    .from("bookings")
    .update({
      family: body.family,
      building: body.building,
      start_date: body.start_date,
      end_date: body.end_date,
      notes: body.notes || null,
      staying: body.staying?.trim() || null,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    if (error.code === "23P01") {
      const { data: conflict } = await supabase
        .from("bookings")
        .select("family, staying")
        .eq("building", body.building)
        .neq("id", id)
        .lte("start_date", body.end_date)
        .gte("end_date", body.start_date)
        .limit(1)
        .single();

      const who = conflict
        ? bookingDisplayName(conflict as Pick<Booking, "family" | "staying">)
        : "someone";
      return NextResponse.json(
        { error: `${buildingLabel(body.building)} is already booked those dates by ${who}. Pick other dates or another building.` },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { error } = await supabase.from("bookings").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

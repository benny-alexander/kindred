import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { familyLabel, buildingLabel, type Family, type Building } from "@/lib/bookings";

export async function GET() {
  const today = new Date().toISOString().slice(0, 10);
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .gte("end_date", today)
    .order("start_date", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = (await req.json()) as {
    family: Family;
    building: Building;
    start_date: string;
    end_date: string;
    notes?: string;
  };

  const { data, error } = await supabase
    .from("bookings")
    .insert({
      family: body.family,
      building: body.building,
      start_date: body.start_date,
      end_date: body.end_date,
      notes: body.notes || null,
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23P01") {
      const { data: conflict } = await supabase
        .from("bookings")
        .select("family")
        .eq("building", body.building)
        .lte("start_date", body.end_date)
        .gte("end_date", body.start_date)
        .limit(1)
        .single();

      const who = conflict ? familyLabel(conflict.family as Family) : "someone";
      return NextResponse.json(
        { error: `${buildingLabel(body.building)} is already booked those dates by ${who}. Pick other dates or another building.` },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

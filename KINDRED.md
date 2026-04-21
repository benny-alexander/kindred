# Kindred — Family Farm Booking

Who's at the farm, when. A shared calendar for three families.

**Live URL:** https://kindred-alfred-energy.vercel.app
**Domain (pending registration):** kindredreserve.com.au

---

## What it does

Three families share one farm with three buildings. Kindred is the simplest possible way to see who's staying where, and book a stay yourself.

**Primary goal:** answer "who's at the farm this weekend?" in one glance.

---

## Who uses it

Three family units. No login. Just open the link, tap your family name, book.

- **Mum & Dad**
- **Tom & Lou**
- **Ben & Jen**

Trust model: any family can edit or delete any booking. It's family.

---

## Buildings

Three properties at the farm, one booking per building:

- 🏡 **Shack**
- 🛖 **Tiny Home**
- 🏚️ **Shed**

Multiple families can be there simultaneously in different buildings. One family can't book two buildings at once (MVP rule).

---

## What you can do

- **See upcoming** — a list of everyone's upcoming stays, colour-coded by family
- **Book a stay** — family → building → arrive date → leave date → notes
- **Edit or delete** any booking
- **Can't double-book** — if you pick dates that clash with an existing booking, it'll tell you who's already there

---

## Tech stack

| Layer | Tool |
|---|---|
| Framework | Next.js 16 on Vercel |
| Database | Supabase (Postgres) |
| UI | Tailwind + shadcn/ui |
| Auth | None (MVP) |

**Data model:** one `bookings` table. DB-level exclusion constraint prevents overlapping bookings for the same building — no race conditions, impossible to double-book even if two people submit at the same millisecond.

**Supabase project:** `kindred` (ap-southeast-2, same org as R4R)
**Vercel project:** `alfred-energy/kindred`
**Code:** `~/kindred`

---

## Roadmap

### Shipped today (v1)
- [x] Upcoming bookings list
- [x] Book a stay (family, building, dates, notes)
- [x] Edit & delete bookings
- [x] Double-booking prevention
- [x] Mobile-first layout

### Next up (once Tom + parents give feedback)
- [ ] Notifications when a booking is made (email to all three families)
- [ ] Google Calendar sync so bookings show up in everyone's calendar
- [ ] Custom domain (e.g. kindredretreat.com.au)
- [ ] Visual polish — possibly a month calendar view
- [ ] Photos of each building
- [ ] Recurring bookings (Christmas, school holidays)
- [ ] Soft auth (4-digit PIN per family) if trust breaks down

---

## Feedback log

*Paste feedback from Tom + parents here as it comes in. Add dates.*

- _(empty — send them the link)_

---

## Build steps (what happened today, 2026-04-20)

1. Scoped MVP with Ben (10 questions → locked on "shared calendar, no login, mobile-first, ship today")
2. Scaffolded Next.js 16 app at `~/kindred` with Tailwind + shadcn
3. Created Supabase project `kindred` + `bookings` table with exclusion constraint
4. Built single page: Upcoming list on top, booking form below
5. API routes for create/update/delete with friendly conflict messages
6. Deployed to Vercel → `kindred-alfred-energy.vercel.app`
7. End-to-end tested: create, conflict-reject, delete all working on live site
8. [pending] Register .com.au domain
9. [pending] Share with family

---

## Domain

**Picked:** `kindredreserve.com.au` (confirmed available 2026-04-20)

**To register:**
1. Go to VentraIP: https://app.ventraip.com.au/order/domains?domain=kindredreserve.com.au
   (or Crazy Domains: https://www.crazydomains.com.au/domain-name-search/?domain=kindredreserve.com.au)
2. Use Alfred Energy ABN for eligibility
3. After registration, add to Vercel project `alfred-energy/kindred` under Settings → Domains
4. Set DNS at registrar: CNAME `kindredreserve.com.au` → `cname.vercel-dns.com`
5. Wait for DNS propagation (~30 min), then live at https://kindredreserve.com.au

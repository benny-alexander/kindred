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

### Shipped v1
- [x] Upcoming bookings list
- [x] Book a stay (family, building, dates, notes)
- [x] Edit & delete bookings
- [x] Double-booking prevention
- [x] Mobile-first layout
- [x] Month calendar view + tap-to-select dates

### Shipped v1.1 (2026-05-02, Mum's feedback round)
- [x] "Other" family tile with required name field — for Uncle Andrew etc.
- [x] "Anyone else with you?" optional name field on family bookings (e.g. "+ Granny")
- [x] Camping / Caravan as a 4th building (one party at a time)
- [x] Live availability badges on building tiles once dates are picked
- [x] Booking cards show real names ("Mum & Dad + Granny", "Uncle Andrew")
- [x] Fix: edit-dialog freeze after delete (single shared dialog at page level)

### Next up — waiting on Mum
Decisions / content needed before the next push:

- [ ] **Photos** — 2–4 per building (Shack, Tiny Home, Glider Room) + 1–2 farm-wide hero shots
- [ ] **Tiny Home setup/packup doc** — PDF or Google Doc share link
- [ ] **Tom's video URLs** (YouTube): Tiny setup, eucalyptus oil, nesting boxes, night vision
- [ ] **Notifications** — email vs SMS, and who receives them (Mum & Dad only, or all six adults?)
- [ ] **Family backend gate** — 4-digit PIN, or secret-ish URL like `/family-zk29`?
- [ ] **Public site** go-ahead — vacancies management, public request form, requests inbox, then approve into a real booking
- [ ] **Camping rule** — confirm one party at a time, or allow multiple campers/caravans simultaneously?

### Backlog
- [ ] Google Calendar sync so bookings show up in everyone's calendar
- [ ] Custom domain `kindredreserve.com.au` (registered, not yet wired)
- [ ] Per-building info page (photos carousel + setup doc + videos)
- [ ] Farm guides page (eucalyptus oil, nesting boxes, night vision)
- [ ] Recurring bookings (Christmas, school holidays)

---

## Feedback log

### 2026-05-02 — Mum
- Asked whether bookings trigger SMS notifications (currently nothing — proposed email first)
- Wants to book non-family guests with their actual names → shipped as "Other" tile + name field
- Public/family split: outsiders see nominated vacancies only and submit a request form; family approves in backend → planned, not yet built
- Add a few photos → planned
- Link Tiny Home setup/packup doc → planned
- Camping/caravan option for guests like Uncle Andrew → shipped
- Link Tom's videos: Tiny, eucalyptus oil, nesting boxes, night vision → planned
- Bug: picked dates, picked a building, only learned on submit it was booked → shipped live-availability fix
- Bug: deleted a booking then tried to edit another, screen frozen → shipped (single shared edit dialog)
- Add a 4th tile, just call it "Other", let people type names → shipped

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

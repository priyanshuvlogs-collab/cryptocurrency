import { test } from "node:test";
import assert from "node:assert/strict";
import {
  zonedToUtc,
  currentOccurrence,
  nextOccurrence,
  thisWeek,
  formatTime,
  getZonedParts,
  type WeeklySlot,
} from "../lib/time.ts";

const slots: WeeklySlot[] = [
  { id: "mon-eve", day: 1, start: "19:00", end: "21:00" },
  { id: "fri-late", day: 5, start: "23:00", end: "01:00" }, // crosses midnight
];

test("Vancouver wall time → UTC in summer (PDT, UTC-7)", () => {
  assert.equal(zonedToUtc(2026, 7, 6, 19, 0, "America/Vancouver").toISOString(), "2026-07-07T02:00:00.000Z");
});

test("Vancouver wall time → UTC in winter (PST, UTC-8)", () => {
  assert.equal(zonedToUtc(2026, 1, 5, 19, 0, "America/Vancouver").toISOString(), "2026-01-06T03:00:00.000Z");
});

test("Monday 7 PM Vancouver shows correctly in India, UK and Australia (summer)", () => {
  const start = zonedToUtc(2026, 7, 6, 19, 0, "America/Vancouver");
  assert.equal(formatTime(start, "Asia/Kolkata", "en"), "7:30 AM"); // Tue
  assert.equal(getZonedParts(start, "Asia/Kolkata").weekday, 2);
  assert.equal(formatTime(start, "Europe/London", "en"), "3:00 AM"); // BST
  assert.equal(formatTime(start, "Australia/Sydney", "en"), "12:00 PM"); // AEST
});

test("Monday 7 PM Vancouver in winter: UK on GMT, Sydney on AEDT", () => {
  const start = zonedToUtc(2026, 1, 5, 19, 0, "America/Vancouver");
  assert.equal(formatTime(start, "Europe/London", "en"), "3:00 AM");
  assert.equal(formatTime(start, "Australia/Sydney", "en"), "2:00 PM");
  assert.equal(formatTime(start, "Asia/Kolkata", "en"), "8:30 AM");
});

test("current occurrence detects a slot that crossed midnight", () => {
  // Saturday 00:30 Vancouver, 2026-07-11 → still inside Friday 23:00–01:00
  const now = zonedToUtc(2026, 7, 11, 0, 30, "America/Vancouver");
  assert.equal(currentOccurrence(slots, now)?.slot.id, "fri-late");
});

test("next occurrence and nothing live between shows", () => {
  const now = zonedToUtc(2026, 7, 6, 12, 0, "America/Vancouver"); // Monday noon
  assert.equal(currentOccurrence(slots, now), null);
  const next = nextOccurrence(slots, now);
  assert.equal(next?.slot.id, "mon-eve");
  assert.equal(next!.start.getTime() - now.getTime(), 7 * 3600 * 1000);
});

test("DST spring-forward week keeps the local 7 PM start", () => {
  // 2026-03-08 is the BC DST change (Sunday). Monday after is PDT.
  const now = zonedToUtc(2026, 3, 7, 12, 0, "America/Vancouver");
  const monday = thisWeek(slots, now).find((o) => o.slot.id === "mon-eve")!;
  assert.equal(formatTime(monday.start, "America/Vancouver", "en"), "7:00 PM");
  assert.equal(monday.start.toISOString(), "2026-03-10T02:00:00.000Z");
});

test("this week has exactly one occurrence per slot", () => {
  const now = new Date("2026-09-25T18:00:00Z");
  assert.equal(thisWeek(slots, now).length, slots.length);
});

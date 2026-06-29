import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export interface ICSEventData {
  uid: string;
  title: string;
  description: string;
  location: string;
  start: Date;
  end: Date;
  organizerEmail: string;
  organizerName: string;
  attendeeEmail: string;
  attendeeName: string;
}

function icsDate(date: Date): string {
  return format(toZonedTime(date, "UTC"), "yyyyMMdd'T'HHmmss'Z'");
}

function icsEscape(str: string): string {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

export function generateICS(event: ICSEventData): string {
  const now = icsDate(new Date());
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//diEntertainment//Scheduler//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${event.uid}@dientertainment.com`,
    `DTSTAMP:${now}`,
    `DTSTART:${icsDate(event.start)}`,
    `DTEND:${icsDate(event.end)}`,
    `SUMMARY:${icsEscape(event.title)}`,
    `DESCRIPTION:${icsEscape(event.description)}`,
    `LOCATION:${icsEscape(event.location)}`,
    `ORGANIZER;CN="${icsEscape(event.organizerName)}":MAILTO:${event.organizerEmail}`,
    `ATTENDEE;CN="${icsEscape(event.attendeeName)}";ROLE=REQ-PARTICIPANT;RSVP=TRUE:MAILTO:${event.attendeeEmail}`,
    "STATUS:CONFIRMED",
    "SEQUENCE:0",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

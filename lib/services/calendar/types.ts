// lib/services/calendar/types.ts
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
}

export interface CalendarProvider {
  readonly name: string;
  isConnected(): Promise<boolean>;
  getEvents(start: Date, end: Date): Promise<CalendarEvent[]>;
  createEvent(event: Omit<CalendarEvent, "id">): Promise<CalendarEvent>;
  deleteEvent(eventId: string): Promise<void>;
}

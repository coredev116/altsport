export default interface YearEvents {
  site: Site;
}

export interface Site {
  eventsInYear: EventsInYear;
}

export interface EventsInYear {
  [year: number]: YearMonths;
}

export interface YearMonths {
  months: { [key: string]: Month };
}

export interface Month {
  eventIds: string[];
  tours: { [key: string]: Tour };
}

export interface Tour {
  events: Event[];
}

export interface Event {
  eventId: string;
  category: null | string;
  regionId: string;
}

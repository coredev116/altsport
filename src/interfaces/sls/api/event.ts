export default interface IEvent {
  id: string;
  eventId: string;
  name: string;
  humanFriendlyEventId: string;
  date: stringClass;
  sports: string[];
  timezoneUtc: string;
  location: Location;
  filename: string;
  colors: Color[];
  startListColumns: string[];
  leaderboardColumns: string[];
  leaderboardDetails: any[];
}

export interface Color {
  name: string;
  hex: string;
  _id: string;
}

export interface stringClass {
  start: string;
  end: string;
}

export interface Location {
  country: string;
  city: string;
}

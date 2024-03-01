export default interface Events {
  Event_ID: number;
  Event_Type_ID: number;
  EventTitle: string;
  EventNo: string;
  EventStartDt: Date;
  EventEndDt: Date;
  Days: Date[];
  EventLocation: string;
  CountryCd: string;
  EventTypeCd: string;
  EventTypeDescription: string;
  TimeZoneDisplayName: string;
  TimeZoneCd: string;
  Series: string;
  Series_ID: number;
  Season: string;
  SeriesDescription: string;
  Venue: Venue;
  ExpectedPayout: number;
  ExpectedSeriesPoints: number;
  EventStatus: string;
  PreviousYears: any[];
  SeasonStopNo: number;
  Teams: any[];
}

export interface Venue {
  VenueName: string;
  Address1: string;
  Address2: null;
  Address3: null;
  City: string;
  State: string;
  Country: string;
}

export default interface Results {
  RoundResults: RoundResult[];
  TeamResults: [];
  EventResults: EventResult[];
  EventDetails: EventDetails;
  ResultDetails: ResultDetails;
  EventTracker: EventTracker;
}

interface EventResult {
  Performance_No: null;
  PositionTxt: string;
  Rider_ID: number;
  RiderName: string;
  RiderScore: number;
  SeriesPoints: number;
  WorldPoints: number;
  TotalSeriesPoints: number;
  TotalWorldPoints: number;
  Payout: number;
  Event_Team_ID: null;
  TeammemberType: null;
  Event_Rider_ID: number;
  Position: null;
}

interface ResultDetails {
  RideCount: number;
  BullCount: number;
  RiderCount: number;
  RemainingRideCount: number;
  QualifiedRideCount: number;
  BuckoffCount: number;
  Payout: number;
  TotalSeriesPoints: number;
  TotalWorldPoints: number;
  ScoreToBeat: number;
  CurrentRound: number;
}

interface EventTracker {
  Rider_ID: null;
  RiderName: null;
  Bull_ID: null;
  BullName: null;
  RiderScore: null;
  BullScore: null;
  BuckOffTime: null;
  ScoreToLead: null;
  ScoreToBeat: null;
  Rides: number;
  Buckoffs: number;
  RemainingOuts: number;
}

interface RoundResult {
  EventRoundNo: number;
  Payout: number;
  SeriesPoints: number;
  WorldPoints: number;
  Rides: Ride[];
}

interface Ride {
  EventRoundNo: number;
  BuckOffTime: null;
  Bull_ID: number;
  BullName: string;
  BullScore: number;
  Stock_Contractor_ID: number;
  StockContractorName: string;
  StockContractorCode: string;
  EventRoundDt: null;
  Delivery: null;
  Performance_No: null;
  PositionTxt: string;
  Rider_ID: number;
  RiderName: string;
  RiderScore: number;
  SeriesPoints: number;
  WorldPoints: number;
  TotalSeriesPoints: number;
  TotalWorldPoints: number;
  Payout: number;
  Event_Team_ID: null;
  TeammemberType: null;
  Event_Rider_ID: number;
  Position: null;
}

interface EventDetails {
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

interface Venue {
  VenueName: string;
  Address1: string;
  Address2: null;
  Address3: null;
  City: string;
  State: string;
  Country: string;
}

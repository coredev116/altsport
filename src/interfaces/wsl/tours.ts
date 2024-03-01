import { Gender as SystemGender } from "../../constants/system";

export default interface ITours {
  tourIds: string[];
  tours: { [key: string]: APITour };
  regions: { [key: string]: Region };
}

export interface Region {
  regionId: string;
  name: string;
}

export interface APITour {
  regionsWithRankings: { [key: string]: string[] };
  ranksDefaultYear: null | string;
  ranksDefaultSeasonNumber: string;
  notificationEnabled: boolean;
  notificationEnabledForNotLoggedIn: boolean;
  tourId: string;
  name: string;
  nameWithoutGender: string;
  sponsorName: null;
  code: string;
  displayCode: string;
  gender: Gender;
  featuredEventId: string;
  eventsDefaultYear: string;
  eventsStartYear: string;
  eventsEndYear: string;
  rankingsDefaultYear: null | string;
  rankingsStartYear: null | string;
  rankingsEndYear: null | string;
  regionsWithEvents: { [key: string]: string[] };
}

export enum Gender {
  F = "F",
  M = "M",
}

export interface ITour {
  id: string;
  name: string;
  gender: SystemGender;
  year: number;
}

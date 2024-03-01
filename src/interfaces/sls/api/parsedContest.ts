import { Gender, EventStatus, RoundStatus, HeatStatus } from "../../../constants/system";

export default interface IParsedEventContent {
  contestId: string;
  startDate: string;
  endDate: string;
  year: number;
  gender: Gender;
  eventStatus: EventStatus;
  participants: Participant[];
  rounds: Round[];
}

export interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  nationality: string;
  gender: Gender;
  homeTown: string;
  doB: string;
  stance: string;
  fullName: string;
  shortName: string;
  seedNo: number;
}

export interface Round {
  id: string;
  name: string;
  roundNo: number;
  lastUpdated: string;
  roundStatus: RoundStatus;
  startDate: string;
  endDate: string;
  heats: Heat[];
}

export interface Heat {
  id: string;
  name: string;
  heatNo: number;
  lastUpdated: string;
  heatStatus: HeatStatus;
  startDate: string;
  endDate: string;
  scores: Score[];
}

export interface Score {
  // id: string;
  athleteId: string;
  lineScore1: number;
  lineScore2: number;
  trickScore1: number;
  trickScore2: number;
  trickScore3: number;
  trickScore4: number;
  trickScore5: number | null;
  trickScore6: number | null;
  roundScore: number;
  position: number;
}

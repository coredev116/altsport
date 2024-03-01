import { NRXRounds, NRXLapStatus } from "../../constants/system";

export interface IList {
  eventName: string;
  eventLocation: string;
  roundNumber: string;
  roundName: string;
  heatName: string;
  eventYear: number;
  athleteName: string;
  athleteId: string;
  heatScore: number;
}

export interface IEventMetrics {
  [key: string]: IHeatMetric;
}

export interface IHeatMetric {
  count: number;
  total: number;
  average: number;
  heatDiff: number;
}

export interface IAthleteEventMetrics {
  [key: string]: IAthleteEventMetric;
}

export interface IAthleteEventMetric {
  athleteId: string;
  athleteName: string;
  [key: number]: {
    year: number;
    heatScore: number;
  }[];
}

export interface IAthleteHeatDiffs {
  [key: string]: IAthleteHeatDiff;
}

export interface IAthleteHeatDiff {
  athleteId: string;
  athleteName: string;
  averageHeatDiff: number;
  count: number;
  total: number;
  base: number;
  [year: number]: {
    averageHeatDiff: number;
    count: number;
    total: number;
    participations: {
      year: number;
      heatDifferential: number;
      roundName: string;
      heatName: string;
      eventName: string;
      locationName: string;
    }[];
  };
}

export interface IEventParticipants extends IRequestParticipants {
  baseHeatScore?: number;
  baseRunScore?: number;
  baseTrickScore?: number;
  baseRoundScore?: number;
  trickCompletion?: number;
  baseProjection?: number;
  heatScore?: number;
  heatPosition?: number;
  roundScore?: number;
  tier?: string;
  tierSeed?: number;
  // baseLapTime?: number;
  // baseJokerLapTime?: number;
  // baseNonJokerLapTime?: number;
  baseSoloLapTime?: number;
  baseHeadLapTime?: number;
  baseRaceLapTime?: number;
  headCrashRate?: number;
  raceCrashRate?: number;
  soloCrashRate?: number;

  laps?: {
    lapTime: number;
    isJoker: boolean;
    isBye: boolean;
    status: NRXLapStatus | null;
  }[];
}

export interface IRoundHeatItem {
  [round: number]: number[];
}

export interface IRoundParticipantHeat {
  [round: number]: IEventParticipants[];
}

export interface IRequestParticipants {
  seedNo: number;
  name?: string;
  athleteId: string;
  eventParticipantId: string;
}

export interface IRequestParticipantsProbability {
  seedNo: number;
  name: string;
  total: number;
  odds: number;
}

export interface IEventHeatOutcome {
  eventId: string;
  eventParticipantId: string;
  roundHeatId: string;
  position: number;
  odds: number;
  probability: number;
}

export interface IOdds {
  winners: IOddsResult[];
  second: IOddsResult[];
  third: IOddsResult[];
  heats: IEventHeatOutcome[];
  bets: IBetResults;
  totalSimRuns: number;
}

export interface IOddsResult {
  athleteId: string;
  eventParticipantId: string;
  name?: string;
  odds: number;
  count: number;
  probability: number;
}

export interface IRounds {
  id: string;
  name: string;
  roundNo: number;
  status: number;
  heats: IRoundHeat[];
}

export interface IRoundHeat {
  id: string;
  name: string;
  heatNo: number;
  heatStatus: number;
  participants: IEventParticipants[];
}

export interface IBetResults {
  headToHead: IBetItemHeadToHeadResult[];
}

export interface IBetItemHeadToHeadResult {
  id: string;
  eventParticipant1Id: string;
  eventParticipant2Id: string;
  eventParticipantWinnerId: string;
  player1Odds: number;
  player1Probability: number;
  player2Odds: number;
  player2Probability: number;
}

export interface IRoundStateMap {
  eventRoundId: string;
  roundId: string;
  name: string;
  roundNo: number;
  status: number;
  eventRoundNo: NRXRounds; // this is the number that should be used for checks
}

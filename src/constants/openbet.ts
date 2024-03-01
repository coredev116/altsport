import { EventStatus } from "./system";

export enum MatchState {
  IN_RUNNING = "IN_RUNNING",
  POST_MATCH = "POST_MATCH",
  PRE_MATCH = "PRE_MATCH",
}

export enum ParticipantsSide {
  AWAY = "AWAY",
  HOME = "HOME",
  NONE = "NONE",
}

export enum ParticipantsType {
  INDIVIDUAL = "INDIVIDUAL",
  TEAM = "TEAM",
}

export enum FixtureType {
  MATCH = "MATCH",
  OUTRIGHT = "OUTRIGHT",
  RACE = "RACE",
}

export const FixtureStatus = {
  //   1: "ABANDONED",
  [EventStatus.LIVE]: "ACTIVE",
  [EventStatus.CANCELLED]: "CANCELLED",
  //   4: "CLOSED",
  //   5: "DELAYED",
  [EventStatus.COMPLETED]: "OVER",
  //   7: "POSTPONED",
  [EventStatus.POSTPONED]: "SUSPENDED",
};

export type FixtureStatusType = typeof FixtureStatus;

export enum MarketStatus {
  CLOSED = "CLOSED",
  OPEN = "OPEN",
  RESULTED = "RESULTED",
  SUSPENDED = "SUSPENDED",
}

export enum MarketSelectionResultStatus {
  ABANDONED = "ABANDONED",
  HALF_LOSE = "HALF_LOSE",
  HALF_WIN = "HALF_WIN",
  LOSE = "LOSE",
  NON_RUNNER = "NON_RUNNER",
  PLACE = "PLACE",
  PUSH = "PUSH",
  UNSET = "UNSET",
  VOID = "VOID",
  WIN = "WIN",
}

export const ProviderIdentifiers = {
  SURFING: {
    sportId: "surfing",
    competitionId: "wsl",
    sportname: "Surfing",
    competitionname: "World Surf League",
  },
};

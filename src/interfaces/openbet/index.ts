import {
  FixtureStatusType,
  MatchState,
  FixtureType,
  MarketStatus,
  MarketSelectionResultStatus,
} from "../../constants/openbet";

export interface IOpenBetAuthResponse {
  access_token: string;
  expires_in: number;
  refresh_expires_in: number;
  refresh_token: string;
  token_type: string;
  "not-before-policy": number;
  session_state: string;
  scope: string;
}

export interface IFixturePayloadResponse {
  header: {
    timestamp: Date;
    trackingId: string;
  };
  code: string;
}

export interface IFixtureBodyPayload {
  header: Header;
  fixtureId: string;
  fixture?: Fixture;
  markets?: Market[];
}

export interface Fixture {
  sport: Sport;
  competition: Competition;
  participants: Participant[];
  type: FixtureType;
  id: string;
  name: string;
  startTime: string;
  matchState: MatchState;
  offeredInRunning: boolean;
  status: FixtureStatusType;
  venue: string;
}

export interface Competition {
  id: string;
  name: string;
  tags: Tags;
}

export interface Tags {
  COUNTRY: string;
}

export interface Participant {
  id: string;
  name: string;
  side: string;
  type: string;
  // eslint-disable-next-line id-denylist
  number?: string;
}

export interface Sport {
  id: string;
  name: string;
}

export interface Header {
  timestamp: string;
  trackingId: string;
}

export interface Market {
  cfsMarketType: CfsMarketType;
  id: string;
  name: string;
  parameters?: Parameters;
  offeredInRunning: boolean;
  selections: Selection[];
  status: MarketStatus;
  typeId: string;
}

export interface CfsMarketType {
  specifiers: CfsMarketTypeSpecifiers;
}

export interface CfsMarketTypeSpecifiers {
  TYPE: string;
  SHAPE: string;
  PERIOD: string;
  FACT: string;
}

export interface Selection {
  cfsSelectionType: CfsSelectionType;
  id: string;
  name: string;
  parameters: Parameters;
  result: MarketSelectionResultStatus;
  tradingData: TradingData;
  typeId: "PLAYER" | "HeatWinner";
}

export interface CfsSelectionType {
  specifiers: CfsSelectionTypeSpecifiers;
}

export interface CfsSelectionTypeSpecifiers {
  TYPE: "PARTICIPANT" | "PARTICIPANT_1" | "PARTICIPANT_2";
}

export interface Parameters {
  PLAYER?: string;
  HEAT?: string;
  MARKET_PLAYERS?: string;
}

export interface TradingData {
  odds: Odds;
  status: MarketStatus;
}

export interface Odds {
  decimal: string;
}

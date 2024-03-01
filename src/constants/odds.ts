export enum Derivatives {
  EVENT_WINNER = 1,
  EVENT_SECOND_PLACE = 2,
  HEAD_TO_HEAD = 3,
  HEAT_WINNER = 4,
}

export enum PublicOddTypes {
  EVENT_WINNER = "eventWinner",
  EVENT_SECOND_PLACE = "secondPlace",
  HEAT_WINNER = "heatWinner",
  HEAD_TO_HEAD = "headToHead",
  SHOWS = "shows",
  PODIUMS = "podiums",
  PROP_BETS = "propBets",
  DREAM_TEAM = "dreamTeam",
  EVENT_EXACTA = "eventExacta",
  HEAT_EXACTA = "heatExacta",
}

export enum OddMarketStatus {
  OPEN = "OPEN",
  VOID = "VOID",
  CLOSE = "CLOSE",
}

export enum BetStatus {
  OPEN = "OPEN",
  PAYOUT = "PAYOUT",
  DRAW = "DRAW",
  VOID = "VOID",
}

export enum JAMarketTypes {
  SERVE = 1,
  EVENT = 2,
  MATCH = 3,
  SETS = 4,
  PROPS = 5,
}

export enum JABetTypes {
  CORRECT_SETS = 1,
  TOTAL_SETS = 2,
  MATCH_WINNER = 3,
  EVENT_WINNER = 4,
  WINS_NEXT_SERVE = 5,
}

export enum JASubMarketTypes {
  MONEYLINE = 1,
  SPREAD = 2,
  TOTAL = 3,
  OUTCOME_1 = 4,
  OUTCOME_2 = 5,
  OUTCOME_3 = 6,
  OUTCOME_4 = 7,
}

export enum JAValueTypes {
  POSITIVE = 1,
  NEGATIVE = 2,
  OVER = 3,
  UNDER = 4,
}

export enum MASLMarketTypes {
  REGULATION = 1,
  FULL_MATCH = 2,
}

export enum MASLBetTypes {
  EVENT_WINNER = 1,
  TOTALS = 2,
}

export enum MASLSubMarketTypes {
  MONEYLINE = 1,
  SPREAD = 2,
  TOTAL = 3,
}

export enum MASLValueTypes {
  POSITIVE = 1,
  NEGATIVE = 2,
  OVER = 3,
  UNDER = 4,
}

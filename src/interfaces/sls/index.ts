export interface IAthlete {
  athleteId: string;
  seedNo: number;
  roundScore: number;
}

export interface IRoundKey {
  [key: number]: number[];
}

export interface RoundState<T> {
  eventRoundId: string;
  roundId: string;
  name: string;
  roundNo: number;
  status: number;
  eventRoundNo: T;
}

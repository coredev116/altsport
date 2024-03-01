export interface IAthlete {
  athleteId: string;
  seedNo: number;
  tier?: string;
  tierSeed?: number;
  // this is only required for WSL for pre-cut round of 32 athlete placement
  roundPlace?: number;
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

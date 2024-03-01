export interface IRoundScore {
  id: string;
  roundSeed: number;
  roundScore: number;
  lineScore1: number;
  lineScore2: number;
  heatPosition: number;
  athlete: IAthlete;
}

interface IAthlete {
  id: string;
  firstName: string;
  lastName: string;
}

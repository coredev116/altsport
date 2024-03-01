export interface IRoundScore {
  id: string;
  roundSeed: number;
  heatScore: number;
  heatPosition: number;
  athlete: IAthlete;
}

interface IAthlete {
  id: string;
  firstName: string;
  lastName: string;
}

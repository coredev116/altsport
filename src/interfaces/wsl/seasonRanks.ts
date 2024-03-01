export default interface ISeasonRank {
  athlete: Athlete;
  rank: number;
  points: number;
  heatWinPercent: number;
  avgHeatScore: number;
  maxHeatScore: number;
  avgWaveScore: number;
  maxWaveScore: number;
}

export interface Athlete {
  athleteId: string;
  firstName: string;
  lastName: string;
  gender: string;
  nationAbbr: string;
  stance: string;
  jerseyNumber: string;
  memberproMemberNumber: string;
  memberproAthleteId: string;
  headshotImageUrl: string;
  headshotLargeImageUrl: string;
  heroImageUrl: null | string;
  nationImageUrl: string;
  hometown: null | string;
  birthdate: string | null;
  height: number;
  weight: number;
  countryId: string;
}

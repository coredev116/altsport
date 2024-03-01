export default interface IAthleteRanks {
  ranks: Ranks;
  regions: Regions;
  tours: Tours;
  athletes: { [key: string]: Athlete };
  countries: { [key: string]: Country };
}

export interface Athlete {
  athleteId: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  nationAbbr: string;
  stance: Stance;
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
  rankStats: RankStats;
}

export enum Gender {
  M = "M",
}

export interface RankStats {
  [key: string]: IAthleteRankItem;
}

export interface IAthleteRankItem {
  rank: number;
  rankChange: number;
  points: number;
  prizeMoney: number;
  numEvents: number;
  avgPlace: number;
  numWins: number;
  numFinals: number;
  numSemifinals: number;
  numQuarterfinals: number;
  numPerfectHeatScores: number;
  numPerfectWaveScores: number;
  numExcellentHeatScores: number;
  numExcellentWaveScores: number;
  numHeats: number;
  numHeatWins: number;
  heatWinPercent: number;
  avgHeatScore: number;
  maxHeatScore: number;
  avgWaveScore: number;
  maxWaveScore: number;
}

export enum Stance {
  Goofy = "Goofy",
  Regular = "Regular",
}

export interface Country {
  countryId: string;
  name: string;
  abbr2: string;
  abbr3: string;
  flagUrl: string;
}

export interface Ranks {
  [key: string]: RankItem;
}

export interface RankItem {
  rankId: string;
  name: string;
  displayName: string;
  tourId: string;
  regionId: string;
  seriesId: null;
  rankType: string;
  year: string;
  seasonNumber: number;
  searchResults: SearchResults;
}

export interface SearchResults {
  rankAthletes: RankAthletes;
}

export interface RankAthletes {
  params: Params;
  athleteIds: string[];
}

export interface Params {
  count: number;
  offset: number;
  totalCount: number;
  rankId: string;
}

export interface Regions {
  "1": Regions1;
}

export interface Regions1 {
  regionId: string;
  name: string;
}

export interface Tours {
  "1": Tours1;
}

export interface Tours1 {
  tourId: string;
  name: string;
  nameWithoutGender: string;
  sponsorName: null;
  code: string;
  displayCode: string;
  gender: Gender;
  featuredEventId: string;
}

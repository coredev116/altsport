export default interface ITourRanks {
  tours: ToursHolder;
}

export interface ToursHolder {
  [key: string]: Tours;
}

export interface Tours {
  searchResults: SearchResults;
  tourId: string;
  name: string;
  nameWithoutGender: string;
  sponsorName: null;
  code: string;
  displayCode: string;
  gender: string;
  featuredEventId: string;
}

export interface SearchResults {
  tourRanks: TourRanks;
}

export interface TourRanks {
  params: Params;
  totalRanksCount: number;
  rankIds: string[];
}

export interface Params {
  count: number;
  offset: number;
  tourId: string;
  regionId: null;
  totalCount: number;
}

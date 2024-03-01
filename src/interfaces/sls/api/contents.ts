export default interface IEventContest {
  externalId: string;
  name: string;
  order: number;
  state: string;
  date: DateClass;
  results: any[];
  categories: IEventContestCategory[];
}

export interface IEventContestCategory {
  name: string;
  order: number;
  externalId: number;
  rounds: Round[];
  entries: any[];
  results: any[];
  _id: string;
}

export interface Round {
  externalId: string;
  order: number;
  name: string;
  topCount: number;
  numberOfRuns: number;
  bestRuns: number;
  resultLabel: Label;
  cut: number;
  maxValueLength: number;
  showNeeds: boolean;
  focus: boolean;
  info: string;
  heats: Heat[];
  entries: Entry[];
  results: Result[];
  type: Type;
  state: string;
  heatMode: string;
  updated?: string;
  externalContestId: string;
  date: {
    start: string;
    end: string;
  };
}

export interface Entry {
  order: number;
  bib: string;
  category: string;
  isNext: boolean;
  athlete: Athlete;
  details: any[];
}

export interface Athlete {
  externalId: string;
  thirdPartyId: string;
  firstName: string;
  lastName: string;
  nationality: string;
  gender: Gender;
  homeTown: string;
  sponsor: string;
  doB: string;
  age: number;
  stance: Stance;
  fullName: string;
  shortName: string;
  filename: string;
}

export enum Gender {
  Man = "Man",
  Woman = "Woman",
}

export enum Stance {
  Goofy = "Goofy",
  Regular = "Regular",
}

export interface Heat {
  externalId: string;
  name: string;
  order: number;
  startList: Entry[];
  results: Result[];
  categories: HeatCategory[];
  externalContestId: string;
  externalRoundId: string;
  updated: string;
}

export interface HeatCategory {
  key: string;
  label: string;
}

export interface Result {
  externalId: string;
  externalAthleteId: string;
  rank: number;
  order: number;
  bib: string;
  valueLabel: Label;
  value: string;
  valueDiff: string;
  isLive: boolean;
  advanced: boolean;
  isValid: boolean;
  isOfficial: boolean;
  isNext: boolean;
  details: GroupElement[];
}

export interface GroupDetail {
  order: number;
  values: string[];
  groups: GroupElement[];
}

export interface GroupElement {
  name: Name;
  order: number;
  fields: Type[];
  groups: any[];
  details: GroupDetail[];
}

export enum Type {
  Discard = "Discard",
  Drop = "Drop",
  ID = "Id",
  IsCurrent = "IsCurrent",
  IsValid = "IsValid",
  Judge = "Judge",
  Points = "Points",
  Rank = "Rank",
  Run = "Run",
  Score = "Score",
  Section = "Section",
  Type = "Type",
  Value = "Value",
}

export enum Name {
  External = "External",
  Needs = "Needs",
  Runs = "Runs",
  Scores = "Scores",
}

export enum Label {
  Total = "Total",
}

export interface DateClass {
  start: string;
  end: string;
}

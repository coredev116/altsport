import NRXScores from "../../entities/nrx/scores.entity";

import { NRXEventCategoryType } from "../../constants/system";

export interface IAthleteLapHolder {
  [athleteId: string]: NRXScores[];
}

export interface IAthleteLap {
  athleteId: string;
  lapTime: number;
}

export interface IHeatScoreHolder {
  [roundhHeatId: string]: NRXScores[];
}

export interface IRoundResult {
  [heatNo: number]: IAthleteLap[];
}

export interface IQualifyingParticipants {
  seedNo: number;
  athleteId: string;
}

export interface INRXRoundConfig {
  // stores the number of heats for each round
  [key: number]: INRXConfigItem;
}

export interface INRXConfigItem {
  name: string;
  heats: number;
}

export interface IResultCategory {
  [key: string]: IResultCategoryItem;
}

export interface IResultCategoryItem {
  name: string;
  eventCategory: NRXEventCategoryType;
}

export interface ISimScoresList {
  [roundhHeatId: string]: NRXScores[];
}

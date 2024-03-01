import { TASK_TYPE } from "../../constants/slackbot";
import { SportsTypes, EventStatus } from "../../constants/system";

export interface ITask {
  taskType: TASK_TYPE;
}

export interface IScheduleTask<T> extends ITask {
  payload: T | T[];
}

export interface IEvent {
  sportName: string;
  sportType: SportsTypes;
  tourName: string;
  eventNumber: string;
  eventName: string;
  startDate: string;
  endDate: string | null;
  eventId: string;
  adminUrl: string;
}

export interface IOddsPublish<T> extends ITask {
  sportType: SportsTypes;
  payload: T;
}

export interface IJaiAlaiOdds {
  homeTeamName: string;
  awayTeamName: string;
  startTime?: string;
  endTime?: string;

  homeTeamMoneylineOdds: number;
  awayTeamMoneylineOdds: number;

  result?: IJaiAlaiOddsItem;
  odds: IJaiAlaiOddsItem[];
}

export interface IJaiAlaiOddsItem {
  eventNumber: number;
  homeTeamAthlete1Name: string;
  homeTeamAthlete2Name?: string;
  awayTeamAthlete1Name: string;
  awayTeamAthlete2Name?: string;

  homeTeamMoneylineOdds: number;
  awayTeamMoneylineOdds: number;

  homeTeamSpreadOdds: number;
  awayTeamSpreadOdds: number;

  homeTeamSpreadValue?: number;
  awayTeamSpreadValue?: number;
}

export interface IResultsPublish<T> extends ITask {
  sportType: SportsTypes;
  payload: T;
}

export interface IResult {
  title?: string;
  eventName: string;
  tourName: string;
  startTime: string;
  endTime: string;
  eventStatus: EventStatus;
  round: {
    name: string;
  } | null;
  heatName?: string | null;
  results: IResultItem[];
}

export interface IResultItem {
  name: string;
  position?: number;
  score: string;
  outcome?: "Win" | "Loss" | "Draw";
}

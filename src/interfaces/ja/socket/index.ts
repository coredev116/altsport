export interface IStorePoint {
  winner: IStorePointItem;
  loser: IStorePointItem;
}

interface IStorePointItem {
  id: number;
  set_scoring_id: string;
  point_value: string;
  match_id: string;
  match_type: "D" | "S";
  set_id: string;
  player_id_p1: string;
  player_id_p2?: string;
  // eslint-disable-next-line id-denylist
  number: string;
  serve_receive: string;
  date_time: string;
  action_id: string;
  created_at: string;
  updated_at: string;
}

export interface IFinishSet {
  setData: SetData;
}

interface SetData {
  id: number;
  winner: string;
  start: string;
  end: string;
  setScorings: SetScorings;
  status: string;
}

interface SetScorings {
  id_winner: string;
  points_winner: string;
  position_winner: string;
  id_loser: string;
  points_loser: string;
  position_loser: string;
}

export interface IFinishMatch {
  id: string;
  winner: string;
}

export interface IMatchStatus {
  status: MatchStatusItem;
}

interface MatchStatusItem {
  match_id: string;
  status: string;
  description: string;
  date_time: Date;
}

export interface INewSet {
  newSetData: NewSetData;
}

interface NewSetData {
  set: Set;
  setScorings: SetScoring[];
  setPlayers: SetPlayer[];
}

interface Set {
  id: number;
  match_id: string;
  // eslint-disable-next-line id-denylist
  number: string;
  status: string;
  win_setScoringID: null;
  start: null;
  end: null;
  created_at: Date;
  updated_at: Date;
}

interface SetPlayer {
  id: number;
  set_scoring_id: string;
  player_id: string;
  created_at: Date;
  updated_at: Date;
}

interface SetScoring {
  id: number;
  set_id: string;
  position: string;
  points: string;
  color: string;
  created_at: Date;
  updated_at: Date;
  group_id: string;
  local_odds: string;
}

export interface IMatchCancelled {
  match: Match;
}

export interface Match {
  match_id: number;
  status_id: number;
  status_name: string;
  winner: number;
}

export interface IMatchFinish {
  id: string;
  winner: string;
}

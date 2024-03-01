export enum Fieldset {
  Full = "full",
}

export enum OfficialTypeElement {
  AssistantReferee = "Assistant Referee",
  GoalJudge = "Goal Judge",
  Linesman = "Linesman",
  OffFieldOfficial = "Off-field Official",
  Referee = "Referee",
  Scorekeeper = "Scorekeeper",
  SeniorReferee = "Senior Referee",
  The4ThOfficial = "4th Official",
}

export default interface Leagues {
  leagues: League[];
  version: number;
  ticket: Ticket;
  references: References;
}

export enum VariantElement {
  Futsal = "Futsal",
  IndoorSoccer = "Indoor Soccer",
  OutdoorSoccer = "Outdoor Soccer",
}

export enum Type {
  Official = "official",
}

export enum Permission {
  Read = "read",
}

export interface League {
  id: number;
  name: string;
  time_zone: string;
  type: VariantElement;
  game_time_remaining: boolean;
  official_types: OfficialTypeElement[];
  view_settings: LeagueViewSettings;
  player_stats: boolean;
  official_ids: number[];
  facility_ids: any[];
  visibility: string;
  logo_url: null;
  sport: string;
  sport_conf: SportConf;
  regulation_period_lengths: number[];
  overtime_period_length: number;
  overtime_period_length_playoffs: number;
  game_ending: string;
  positions: string[];
  registration_default_positions: string[];
  created_at: string;
  created_by_id: string;
  updated_at: string;
  updated_by_id: string;
  $type: string;
  $fieldset: Fieldset;
}

export interface SportConf {
  id: string;
  name: string;
  variants: VariantElement[];
  player_stats: boolean;
  goalie_positions: string[];
  player_types: string[];
}

export interface LeagueViewSettings {
  allow_players: boolean;
  scoring_method: string;
  abbreviation: null | string;
  date_format: number;
  time_format: number;
  show_time_zone: boolean;
  show_team_logos: boolean;
  show_player_photos: boolean;
  url: null | string;
  watch_live_url: null;
  default_season_id: null;
  tables: { [key: string]: string[] };
  player_shots: boolean;
  tabular_player_shots: boolean;
  shot_blocked_on_goal: boolean;
  shot_type: boolean;
  record_blocks: boolean;
  record_misses: boolean;
  record_assists: boolean;
  record_faceoffs: boolean;
  record_loose_balls: boolean;
  record_plus_minus: null;
  record_saves: boolean;
  record_shootout_game_winning_goal: boolean;
  penalty_victim: boolean;
  shootouts: boolean;
  stars: boolean;
  timeouts: boolean;
  substitutions: boolean;
  turnover_type: boolean;
  turnovers: boolean;
  clears: boolean;
  corner_kicks: boolean;
  hits: boolean;
  offsides: boolean;
  rebounds: boolean;
  autosuspend: string[];
  autosuspend_notification_emails: any[];
  public_suspension_reason: boolean;
  combine_leader_stats: boolean;
  division_groups: boolean;
  enable_game_clock: boolean;
  enable_travel_teams: boolean;
  faceoff_format: string;
  game_event_time: string;
  game_format: string;
  game_verification: boolean;
  gamesheet_roster_order: string;
  goalie_gp_if_mp: boolean;
  goalie_leaders_played_percent: number;
  leader_metrics: string[];
  leaders_featured: number;
  penalty_format: string;
  player_name_format: string;
  playoff_eligibility: number | null;
  playoff_format: null | string;
  show_add_games_officials: boolean;
  teams_displayed_as: string;
  scorekeeper_stop_clock: string[];
  scorekeeper_fouls_per: string;
  game: Game;
  schedule: Schedule;
  user_system: UserSystem;
  gamesheet: Gamesheet;
  sign_in_sheet: SignInSheet;
  standings: Standings;
  player_leaders_played_percent: number;
  suspension_return: string;
}

export interface Game {
  show_officials: boolean;
  show_notes: boolean;
  show_stars: boolean;
}

export interface Gamesheet {
  roster_format: string;
  fouls_tally: boolean;
  scoring_tally: boolean;
  play_by_play_player_stats: boolean;
  add_sign_in_sheets: boolean;
}

export interface Schedule {
  show_played_games: boolean;
  show_officials_schedule: boolean;
  show_tournament_schedule: boolean;
  show_facility_filter: boolean;
  show_team_logos: boolean;
}

export interface SignInSheet {
  signatures: boolean;
}

export interface Standings {
  show_league_toggle: boolean;
  note: null;
}

export interface UserSystem {
  team_manager_create_delete_players: boolean;
  team_manager_create_people: boolean;
  team_manager_manage_managers: boolean;
  team_manager_update_player: boolean;
  update_own_player: boolean;
  team_members_view_distributed_payments: boolean;
  team_manager_update_logo: boolean;
  update_own_photo: boolean;
  update_own_bio: boolean;
  game_reminder_note: null;
}

export interface References {
  official: Official[];
  facility: any[];
}

export interface Official {
  id: number;
  type: OfficialTypeElement[];
  first_name: string;
  last_name: string;
  home_phone: null;
  cell_phone: null | string;
  email: null | string;
  has_code: boolean;
  league_ids: number[];
  created_at: string;
  created_by_id: string;
  updated_at: null | string;
  updated_by_id: null | string;
  $type: Type;
  $fieldset: Fieldset;
}

export interface Ticket {
  $type: string;
  hash: string;
  user_service_id: string;
  user_service: UserService;
  client_service_id: string;
  client_service: ClientService;
  user_id: string;
  user: User;
}

export interface ClientService {
  $type: string;
  id: string;
  client: Client;
  name: string;
  service_type: string;
  is_suspended: null;
  settings: Settings;
  features: string[];
  type: string;
  level: string;
  status: string;
  stats_only: null;
}

export interface Client {
  id: string;
  name: string;
}

export interface Settings {
  country: string;
  registration: Registration;
  public_person_birthdate: boolean;
}

export interface Registration {
  notification_emails: any[];
  minor_age: number;
}

export interface User {
  $type: string;
  id: string;
  username: null;
  first_name: string;
  last_name: null;
}

export interface UserService {
  $type: string;
  id: string;
  client_service_id: string;
  user_id: string;
  label: null;
  permissions: Permissions;
}

export interface Permissions {
  all_leagues: boolean;
  all_clients: boolean;
  current_seasons_only: boolean;
  league_ids: any[];
  permissions: { [key: string]: Permission[] };
  view_settings: PermissionsViewSettings;
}

export interface PermissionsViewSettings {
  game_listview_columns: any[];
  schedule_types: any[];
}

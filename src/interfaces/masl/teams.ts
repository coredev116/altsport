export default interface Teams {
  teams: Team[];
  version: number;
  ticket: Ticket;
  references: References;
}

export interface References {
  division: Division[];
  season: Season[];
  tournament: any[];
  league: League[];
  official: Official[];
  facility: any[];
}

export interface Division {
  id: number;
  name: string;
  sort_key: null;
  tournament_id: null;
  season_id: number;
  allow_players: boolean;
  scoring_method: string;
  games_played: number;
  visibility: Visibility;
  regulation_period_lengths: number[];
  overtime_period_length: number;
  overtime_period_length_playoffs: number;
  game_ending: string;
  created_at: string;
  created_by_id: string;
  updated_at: null;
  updated_by_id: null;
  $type: string;
  $fieldset: Fieldset;
}

export enum Fieldset {
  Full = "full",
  List = "list",
}

export enum Visibility {
  Public = "public",
}

export interface League {
  id: number;
  name: string;
  time_zone: string;
  type: string;
  game_time_remaining: boolean;
  official_types: Type[];
  view_settings: LeagueViewSettings;
  player_stats: boolean;
  official_ids: number[];
  facility_ids: any[];
  visibility: Visibility;
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

export enum Type {
  AssistantReferee = "Assistant Referee",
  GoalJudge = "Goal Judge",
  Linesman = "Linesman",
  OffFieldOfficial = "Off-field Official",
  Referee = "Referee",
  Scorekeeper = "Scorekeeper",
  SeniorReferee = "Senior Referee",
  The4ThOfficial = "4th Official",
}

export interface SportConf {
  id: string;
  name: string;
  variants: string[];
  player_stats: boolean;
  goalie_positions: string[];
  player_types: string[];
}

export interface LeagueViewSettings {
  date_format: number;
  time_format: number;
  schedule: Schedule;
  player_shots: boolean;
  autosuspend: string[];
  game_verification: boolean;
  show_team_logos: boolean;
  show_player_photos: boolean;
  user_system: UserSystem;
  goalie_leaders_played_percent: number;
  gamesheet_roster_order: GamesheetRosterOrder;
  combine_leader_stats: boolean;
  record_faceoffs: boolean;
  enable_game_clock: boolean;
  faceoff_format: string;
  enable_travel_teams: boolean;
  record_saves: boolean;
  abbreviation: string;
  url: string;
  teams_displayed_as: string;
  leaders_featured: number;
  leader_metrics: string[];
  show_add_games_officials: boolean;
  record_plus_minus: null;
  game_format: string;
  record_blocks: boolean;
  goalie_gp_if_mp: boolean;
  watch_live_url: null;
  show_time_zone: boolean;
  player_name_format: string;
  game_event_time: string;
  penalty_format: string;
  public_suspension_reason: boolean;
  playoff_format: string;
  shootouts: boolean;
  stars: boolean;
  timeouts: boolean;
  hits: boolean;
  turnovers: boolean;
  record_loose_balls: boolean;
  game: Game;
  tables: { [key: string]: string[] };
  allow_players: boolean;
  clears: boolean;
  offsides: boolean;
  corner_kicks: boolean;
  playoff_eligibility: number;
  standings: Standings;
  shot_blocked_on_goal: boolean;
  rebounds: boolean;
  substitutions: boolean;
  penalty_victim: boolean;
  turnover_type: boolean;
  shot_type: boolean;
  scorekeeper_stop_clock: any[];
  scorekeeper_fouls_per: string;
  tabular_player_shots: boolean;
  default_season_id: null;
  autosuspend_notification_emails: any[];
  scoring_method: string;
  record_shootout_game_winning_goal: boolean;
  division_groups: boolean;
  gamesheet: Gamesheet;
  sign_in_sheet: SignInSheet;
  record_misses: boolean;
  record_assists: boolean;
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
  add_sign_in_sheets: boolean;
  play_by_play_player_stats: boolean;
}

export enum GamesheetRosterOrder {
  Birthdate = "birthdate",
  Name = "name",
  // Number = "number",
  Position = "position",
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

export interface Official {
  id: number;
  type: Type[];
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
  $type: OfficialType;
  $fieldset: Fieldset;
}

export enum OfficialType {
  Official = "official",
}

export interface Season {
  id: number;
  league_id: number;
  name: string;
  type: string;
  active: boolean;
  sort_key: number;
  standings_sort_keys: string[];
  win_percentage_calculation: string;
  visibility: Visibility;
  schedule_visibility: Visibility;
  stats: SeasonStats;
  period_number: number;
  period_length: number;
  overtime_length: number;
  playoff_overtime_length: number;
  game_ending: string;
  start_date: Date;
  end_date: Date;
  view_settings: SeasonViewSettings;
  created_at: string;
  created_by_id: string;
  updated_at: string;
  updated_by_id: string;
  $type: string;
  $fieldset: Fieldset;
}

export interface SeasonStats {
  Exhibition: PurpleExhibition;
  "Regular Season": PurpleExhibition;
  Playoffs: PurpleExhibition;
}

export interface PurpleExhibition {
  season_id: number;
  game_type: GameType;
  games_played: number;
  created_at: string;
  updated_at: string;
  $type: string;
  $fieldset: Fieldset;
}

export enum GameType {
  Exhibition = "Exhibition",
  Playoffs = "Playoffs",
  RegularSeason = "Regular Season",
}

export interface SeasonViewSettings {
  points: Points;
  show_standings: boolean;
  wildcard_top_from_divs: number;
  wildcard_top_from_league: number;
  record_saves: boolean;
  fields: Fields;
}

export interface Fields {
  game: string[];
  player: string[];
  gamesheet: string[];
}

export interface Points {
  win: number;
  loss: number;
  tie: number;
  otw: number;
  otl: number;
  sow: number;
  sol: number;
}

export interface Team {
  id: number;
  division_id: number;
  name: string;
  short_name: string;
  city: string;
  logo_url: LogoURL;
  jersey_home: null | string;
  jersey_away: null | string;
  rostered_players: number;
  status: Status;
  hide_from_standings: boolean;
  override_division_rank: null;
  travel_team_opponent: boolean;
  visibility: Visibility;
  color: string;
  roster_sort: RosterSort;
  roster_group: null;
  roster_columns: GamesheetRosterOrder[] | number[];
  roster_photo_url: PhotoURL | null;
  schedule_photo_url: PhotoURL | null;
  roster_photo_link: null | string;
  schedule_photo_link: null | string;
  roster_style: Fieldset;
  url: string;
  photo_url: PhotoURL | null;
  tickets_url: null | string;
  player_status_to_show: PlayerStatusToShow[];
  stats_player_status_to_show: PlayerStatusToShow[];
  display_name: string;
  playoff_status: null | string;
  division_group: null;
  stats: TeamStats;
  invite_code: null;
  created_at: string;
  created_by_id: string;
  updated_at: string;
  updated_by_id: string;
  $type: TeamType;
  $fieldset: Fieldset;
}

export enum TeamType {
  Team = "team",
}

export interface LogoURL {
  "50": string;
  "100": string;
  "200": string;
  full: string;
  small: string;
  medium: string;
  large: string;
}

export interface PhotoURL {
  "480": string;
  "600": string;
  "720": string;
  "1023": string;
  "1223": string;
  full: string;
}

export enum PlayerStatusToShow {
  Reserved = "reserved",
}

export enum RosterSort {
  NameAsc = "name:asc",
  NumberAsc = "number:asc",
}

export interface TeamStats {
  Exhibition: FluffyExhibition;
  "Regular Season": FluffyExhibition;
  Playoffs: FluffyExhibition;
}

export interface FluffyExhibition {
  team_id: number;
  game_type: GameType;
  games_played: number;
  regulation_wins: number;
  regulation_losses: number;
  ties: number;
  overtime_losses: number;
  points: number;
  goals_for: number;
  goals_against: number;
  power_plays: number;
  penalty_kills: number;
  power_play_goals: number;
  power_play_goals_against: number;
  shots_for: number;
  shots_against: number;
  power_play_percentage: string;
  penalty_kill_percentage: string;
  goals_for_average: string;
  goals_against_average: string;
  goal_differential: number;
  shots_for_average: string;
  shots_against_average: string;
  shot_differential: number;
  shooting_percentage: string;
  win_percentage: string;
  created_at: string;
  updated_at: string;
  games_scheduled: number;
  last_n_regulation_wins: number;
  last_n_regulation_losses: number;
  last_n_ties: number;
  last_n_overtime_losses: number;
  streak_type: StreakType;
  streak_count: number;
  penalty_minutes: number;
  division_rank: number;
  overtime_wins: number;
  short_handed: number;
  short_handed_goals: number;
  short_handed_goals_against: number;
  games_behind: string;
  home_record_regulation_wins: number;
  home_record_regulation_losses: number;
  home_record_ties: number;
  home_record_overtime_losses: number;
  home_record_overtime_wins: number;
  away_record_regulation_wins: number;
  away_record_regulation_losses: number;
  away_record_ties: number;
  away_record_overtime_losses: number;
  away_record_overtime_wins: number;
  attendance: number;
  penalty_time: number;
  shots: number;
  shots_missed: number;
  shots_blocked: number;
  shots_average: string;
  regulation_overtime_wins: number;
  shootout_wins: number;
  shootout_losses: number;
  faceoff_wins: number;
  faceoff_losses: number;
  hits: number;
  blocks: number;
  giveaways: number;
  takeaways: number;
  home_games_scheduled: number;
  away_games_scheduled: number;
  home_games_played: number;
  away_games_played: number;
  division_record_regulation_wins: number;
  division_record_regulation_losses: number;
  division_record_ties: number;
  division_record_overtime_losses: number;
  division_record_overtime_wins: number;
  league_rank: number;
  games_behind_league: string;
  shots_saved: number;
  shots_saved_against: number;
  shots_blocked_against: number;
  shots_missed_against: number;
  scored_goals: number;
  scored_goals_against: number;
  assists: number;
  assists_per_game_average: string;
  penalty_time_per_game_average: string;
  forfeits: number;
  tie_breaker_ratio: string;
  goal_quotient: string;
  wins: number;
  losses: number;
  overtime_shootout_losses: number;
  home_record_shootout_wins: number;
  home_record_shootout_losses: number;
  away_record_shootout_wins: number;
  away_record_shootout_losses: number;
  division_record_shootout_wins: number;
  division_record_shootout_losses: number;
  last_n_overtime_wins: number;
  last_n_shootout_wins: number;
  last_n_shootout_losses: number;
  fouls: number;
  yellow_cards: number;
  red_cards: number;
  blue_cards: number;
  fouls_per_game_average: string;
  yellow_cards_per_game_average: string;
  red_cards_per_game_average: string;
  blue_cards_per_game_average: string;
  $type: ExhibitionType;
  $fieldset: Fieldset;
}

export enum ExhibitionType {
  TeamResult = "team_result",
}

export enum StreakType {
  Empty = " ",
  L = "L",
  W = "W",
}

export enum Status {
  Active = "active",
  Inactive = "inactive",
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

export enum Permission {
  Read = "read",
}

export interface PermissionsViewSettings {
  game_listview_columns: any[];
  schedule_types: any[];
}

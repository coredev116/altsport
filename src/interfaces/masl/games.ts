export default interface Games {
  games: GameElement[];
  version: number;
  ticket: Ticket;
  references: References;
}

export interface Summary {
  id: number;
  gamesheet_id: string;
  datetime: string;
  datetime_tz: string;
  time_zone: TimeZone;
  //number: string;
  notes: null;
  allow_players: boolean;
  scoring_method: string;
  regulation_period_lengths: [];
  overtime_period_length: number;
  first_star_id: number;
  second_star_id: number;
  third_star_id: number;
  forfeit: string;
  status: string;
  final_status: null;
  clock: {
    period: string;
    time: number;
    running: boolean;
  };
  type: string;
  home_team_unknown: null;
  away_team_unknown: null;
  stats: GameStats;
  periods: string[];
  home_team: {
    name: string;
  };
  away_team: {
    name: string;
  };
  home_divison: object;
  away_division: object;
  facility: Facility;
  rink: null;
  started_at: null;
  ended_at: null;
  attendance: null;
  has_play_by_play: boolean;
  created_at: string;
  created_by_id: string;
  updated_at: string;
  updated_by_id: string;
  league: League;
  season: Season;
  home_roster: [];
  away_roster: [];
  home_coaches: [];
  away_coaches: [];
  officials: GameOfficial[];
  home_timeouts: [];
  away_timeouts: [];
  goalies: [];
  goals: [];
  shots: [];
  penalties: [];
  penalty_shots: [];
  timeouts: [];
  offsides: [];
  corner_kicks: [];
  fouls: [];
  shootout: [];
  events: GameEvent[];
}

export interface GameSummary {
  summary: Summary;
  version: number;
  ticket: Ticket;
  references: object;
}

export interface GameEvent {
  $type: string;
  id: number;
}

export interface GameElement {
  id: number;
  gamesheet_id: string;
  datetime: string;
  datetime_tz: string;
  time_zone: TimeZone;
  time_zone_abbr: TimeZoneAbbr;
  // number: string;
  notes: null | string;
  regulation_period_lengths: number[];
  overtime_period_length: number;
  home_dressing_room_id: null;
  away_dressing_room_id: null;
  home_team_id: number;
  away_team_id: number;
  home_division_id: number;
  away_division_id: number;
  facility_id: number;
  rink_id: null;
  first_star_id: number | null;
  second_star_id: number | null;
  third_star_id: number | null;
  forfeit: Forfeit;
  status: string;
  final_status: null;
  type: GameTypeEnum;
  home_team_unknown: null;
  away_team_unknown: null;
  is_finalized: boolean;
  officials: GameOfficial[];
  stats: GameStats;
  allow_players: boolean;
  allow_quick_scoring: boolean;
  clock: Clock;
  scoring_method: ScoringMethod;
  verified_by_id: null;
  verified_at: null;
  started_at: null | string;
  ended_at: null | string;
  home_timeouts: Timeout[];
  away_timeouts: Timeout[];
  tickets_url: null | string;
  watch_live_url: null | string;
  attendance: number | null;
  highlight_color: null;
  external_url: null;
  has_play_by_play: boolean;
  created_at: string;
  created_by_id: string;
  updated_at: string;
  updated_by_id: string;
  $type: GameType;
  $fieldset: Fieldset;
  home_score?: number;
  away_score?: number;
}

export enum Fieldset {
  Full = "full",
}

export enum GameType {
  Game = "game",
}

export interface Timeout {
  id: number;
  game_id: number;
  team_id: number;
  period: string;
  time: number;
  time_elapsed: number;
  time_remaining: number;
  type: null;
  created_at: string;
  created_by_id: string;
  updated_at: null | string;
  updated_by_id: null | string;
  $type: AwayTimeoutType;
  $fieldset: Fieldset;
}

export enum AwayTimeoutType {
  Timeout = "timeout",
}

export interface Clock {
  period: string;
  time: number;
  running: boolean;
}

export enum Forfeit {
  No = "No",
}

export interface GameOfficial {
  id: number;
  game_id: number;
  official_id: number;
  type: TypeElement;
  created_at: string;
  created_by_id: string;
  updated_at: null;
  updated_by_id: null;
  $type: PurpleType;
  $fieldset: Fieldset;
}

export enum PurpleType {
  GameOfficial = "game_official",
}

export enum TypeElement {
  AssistantReferee = "Assistant Referee",
  GoalJudge = "Goal Judge",
  Linesman = "Linesman",
  OffFieldOfficial = "Off-field Official",
  Referee = "Referee",
  Scorekeeper = "Scorekeeper",
  SeniorReferee = "Senior Referee",
  The4ThOfficial = "4th Official",
}

export enum ScoringMethod {
  PlayByPlay = "play-by-play",
}

export interface GameStats {
  game_id: number;
  home_goals: number;
  away_goals: number;
  home_score: number;
  away_score: number;
  home_shots: number;
  away_shots: number;
  home_penalties: number;
  away_penalties: number;
  overtime: boolean;
  shootout: boolean;
  home_goal_differential: number;
  away_goal_differential: number;
  created_at: string;
  updated_at: string;
  status: string;
  home_goals_by_period: ByPeriod;
  away_goals_by_period: ByPeriod;
  periods: string[];
  home_shots_by_period: ByPeriod;
  away_shots_by_period: ByPeriod;
  home_shots_saved_by_period: ByPeriod;
  away_shots_saved_by_period: ByPeriod;
  home_shots_blocked_by_period: ByPeriod;
  away_shots_blocked_by_period: ByPeriod;
  home_shots_missed_by_period: ByPeriod;
  away_shots_missed_by_period: ByPeriod;
  home_shots_saved: number;
  away_shots_saved: number;
  home_shots_blocked: number;
  away_shots_blocked: number;
  home_shots_missed: number;
  away_shots_missed: number;
  home_scored_goals_by_period: ByPeriod;
  away_scored_goals_by_period: ByPeriod;
  home_scored_goals: number;
  away_scored_goals: number;
  home_shots_on_goal_by_period: ByPeriod;
  away_shots_on_goal_by_period: ByPeriod;
  home_shots_on_goal: number;
  away_shots_on_goal: number;
  $type: FluffyType;
  $fieldset: Fieldset;
}

export enum FluffyType {
  GameResult = "game_result",
}

export interface ByPeriod {
  "1": number;
  "2": number;
  "3": number;
  "4": number;
  OT?: number;
  SO?: number;
}

/* export enum StatsStatus {
  Cancelled = "Cancelled",
  Final = "Final",
} */

export enum TimeZone {
  AmericaLosAngeles = "America/Los_Angeles",
  USCentral = "US/Central",
  USEastern = "US/Eastern",
  USMountain = "US/Mountain",
}

export enum TimeZoneAbbr {
  Cdt = "CDT",
  Cst = "CST",
  Edt = "EDT",
  Est = "EST",
  Mst = "MST",
  Pdt = "PDT",
  Pst = "PST",
}

export enum GameTypeEnum {
  Exhibition = "Exhibition",
  Playoffs = "Playoffs",
  RegularSeason = "Regular Season",
}

export interface References {
  team: Team[];
  division: Division[];
  facility: Facility[];
  rink: any[];
  dressing_room: any[];
  roster: Roster[];
  official: ReferencesOfficial[];
  season: Season[];
  tournament: any[];
  player: Player[];
  league: League[];
  person: Person[];
  attribute: ReferencesAttribute[];
}

export interface ReferencesAttribute {
  id: number;
  field_type: string;
  label: string;
  type: AttributeType;
  sort_key: number;
  settings: AttributeSettings;
  created_at: string;
  created_by_id: string;
  updated_at: null | string;
  updated_by_id: null | string;
  $type: string;
  $fieldset: Fieldset;
}

export interface AttributeSettings {
  public: boolean;
  unit?: string;
}

export enum AttributeType {
  Person = "person",
}

export interface Division {
  id: number;
  name: string;
  sort_key: null;
  tournament_id: null;
  season_id: number;
  allow_players: boolean;
  scoring_method: ScoringMethod;
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

export enum Visibility {
  Public = "public",
}

export interface Facility {
  id: number;
  name: string;
  email: null | string;
  address: string;
  city: string;
  province: null | string;
  country: Country | null;
  postal_code: null | string;
  phone: null | string;
  league_ids: any[];
  time_zone: TimeZone;
  full_address: string;
  created_at: string;
  created_by_id: string;
  updated_at: null | string;
  updated_by_id: null | string;
  $type: FacilityType;
  $fieldset: Fieldset;
}

export enum FacilityType {
  Facility = "facility",
}

export enum Country {
  MX = "MX",
  Us = "US",
}

export interface League {
  id: number;
  name: string;
  time_zone: TimeZone;
  type: string;
  game_time_remaining: boolean;
  official_types: TypeElement[];
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
  game: ViewSettingsGame;
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
  scoring_method: ScoringMethod;
  record_shootout_game_winning_goal: boolean;
  division_groups: boolean;
  gamesheet: Gamesheet;
  sign_in_sheet: SignInSheet;
  record_misses: boolean;
  record_assists: boolean;
  player_leaders_played_percent: number;
  suspension_return: string;
}

export interface ViewSettingsGame {
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
  // Position = "position",
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

export interface ReferencesOfficial {
  id: number;
  type: TypeElement[];
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
  $type: TentacledType;
  $fieldset: Fieldset;
}

export enum TentacledType {
  Official = "official",
}

export interface Person {
  id: number;
  client_service_id: string;
  first_name: string;
  last_name: string;
  biography: null | string;
  invited_at: null;
  birthdate: Date | null;
  email: null | string;
  photo_url: PhotoURL | null;
  hero_url: OURL | null;
  attributes: PersonAttribute[];
  created_at: string;
  created_by_id: string;
  updated_at: string;
  updated_by_id: string;
  $type: AttributeType;
  $fieldset: Fieldset;
}

export interface PersonAttribute {
  attribute_id: number;
  human_readable: string;
  value?: string;
  feet?: string;
  inches?: string;
}

export interface OURL {
  "480": string;
  "600": string;
  "720": string;
  "1023": string;
  "1223": string;
  full: string;
}

export interface PhotoURL {
  "50": string;
  "95": string;
  "100": string;
  "140": string;
  "200": string;
  full: string;
}

export interface Player {
  id: number;
  team_id: number;
  person_id: number;
  status: StatusElement;
  // number: string;
  position: Position;
  rank: null | string;
  suspended: boolean;
  manage_team: boolean;
  override_playoff_eligibility: null;
  playoff_eligible: null;
  playoff_eligible_games: number;
  first_name: string;
  last_name: string;
  stats: PlayerStats;
  goalie_stats: PlayerGoalieStats;
  created_at: string;
  created_by_id: string;
  updated_at: null | string;
  updated_by_id: null | string;
  $type: PlayerType;
  $fieldset: Fieldset;
}

export enum PlayerType {
  Player = "player",
}

export interface PlayerGoalieStats {
  Exhibition?: GoalieStatsExhibition;
  "Regular Season"?: GoalieStatsExhibition;
  Playoffs?: GoalieStatsExhibition;
}

export interface GoalieStatsExhibition {
  player_id: number;
  game_type: GameTypeEnum;
  games_played: number;
  time_played: number;
  shots_against: number;
  penalty_minutes: number;
  goals_against: number;
  wins: number;
  losses: number;
  ties: number;
  otl: number;
  saves: number;
  shutouts: number;
  save_percentage: string;
  goals_against_average: string;
  created_at: string;
  updated_at: string;
  goals: number;
  assists: number;
  shots: number;
  penalty_time: number;
  shots_missed: number;
  shots_blocked: number;
  games_started: number;
  shootout_wins: number;
  shootout_losses: number;
  penalty_shot_goals_against: number;
  penalty_shot_saves: number;
  shootout_goals_against: number;
  shootout_saves: number;
  number_stars: number;
  number_first_stars: number;
  number_second_stars: number;
  number_third_stars: number;
  star_points: number;
  shots_saved: number;
  scored_goals: number;
  scored_goals_against: number;
  blue_cards: number;
  yellow_cards: number;
  red_cards: number;
  fouls: number;
  minutes_played: number;
  shots_on_goal: number;
  $type: StickyType;
  $fieldset: Fieldset;
}

export enum StickyType {
  GoalieResult = "goalie_result",
}

export enum Position {
  D = "D",
  F = "F",
  G = "G",
  M = "M",
  MD = "M/D",
}

export interface PlayerStats {
  Exhibition?: PurpleExhibition;
  "Regular Season"?: PurpleExhibition;
  Playoffs?: PurpleExhibition;
}

export interface PurpleExhibition {
  player_id: number;
  game_type: GameTypeEnum;
  games_played: number;
  goals: number;
  assists: number;
  penalty_minutes: number;
  power_play_goals: number;
  short_handed_goals: number;
  shots: number;
  game_winning_goals: number;
  points: number;
  points_per_game_average: string;
  scoring_percentage: string;
  created_at: string;
  updated_at: string;
  number_stars: number;
  number_first_stars: number;
  faceoff_wins: number;
  faceoff_losses: number;
  faceoff_win_percentage: string;
  number_second_stars: number;
  number_third_stars: number;
  star_points: number;
  plus_minus: number;
  penalty_time: number;
  shots_missed: number;
  shots_blocked: number;
  hits: number;
  blocks: number;
  giveaways: number;
  takeaways: number;
  overtime_goals: number;
  shootout_goals: number;
  shootout_misses: number;
  penalty_shot_goals: number;
  penalty_shot_misses: number;
  assists_per_game_average: string;
  goals_per_game_average: string;
  shots_saved: number;
  scored_goals: number;
  time_played: number;
  time_played_per_game_average: string;
  giveaways_per_game_average: string;
  takeaways_per_game_average: string;
  blocks_per_game_average: string;
  shots_blocked_per_game_average: string;
  fouls: number;
  yellow_cards: number;
  red_cards: number;
  blue_cards: number;
  shots_on_goal: number;
  $type: IndigoType;
  $fieldset: Fieldset;
}

export enum IndigoType {
  PlayerResult = "player_result",
}

export enum StatusElement {
  Active = "active",
  Inactive = "inactive",
  Reserved = "reserved",
}

export interface Roster {
  id: number;
  game_id: number;
  player_id: number;
  team_id: null;
  // number: string;
  suspended: boolean;
  shots: null;
  blocks: null;
  position: Position;
  stats: RosterStats;
  goalie_stats: RosterGoalieStats;
  created_at: string;
  created_by_id: string;
  updated_at: null | string;
  updated_by_id: null | string;
  $type: RosterType;
  $fieldset: Fieldset;
}

export enum RosterType {
  Roster = "roster",
}

export interface RosterGoalieStats {
  roster_id: number;
  time_played: number;
  shots_against: number;
  penalty_minutes: number;
  goals_against: number;
  saves: number;
  save_percentage: string;
  created_at: null | string;
  updated_at: null | string;
  goals: number;
  assists: number;
  shots: number;
  penalty_time: number;
  shots_missed: number;
  shots_blocked: number;
  penalty_shot_goals_against: number;
  penalty_shot_saves: number;
  shootout_goals_against: number;
  shootout_saves: number;
  shots_saved: number;
  scored_goals: number;
  scored_goals_against: number;
  blue_cards: number;
  yellow_cards: number;
  red_cards: number;
  fouls: number;
  minutes_played: number;
  shots_on_goal: number;
  $type: GoalieStatsType;
  $fieldset: Fieldset;
}

export enum GoalieStatsType {
  RosterGoalieResult = "roster_goalie_result",
}

export interface RosterStats {
  roster_id: number;
  goals: number;
  assists: number;
  penalty_minutes: number;
  power_play_goals: number;
  short_handed_goals: number;
  shots: number;
  game_winning_goals: number;
  points: number;
  scoring_percentage: string;
  created_at: null | string;
  updated_at: null | string;
  faceoff_wins: number;
  faceoff_losses: number;
  faceoff_win_percentage: string;
  plus_minus: number;
  penalty_time: number;
  shots_missed: number;
  shots_blocked: number;
  hits: number;
  blocks: number;
  giveaways: number;
  takeaways: number;
  overtime_goals: number;
  shootout_goals: number;
  shootout_misses: number;
  penalty_shot_goals: number;
  penalty_shot_misses: number;
  shots_saved: number;
  scored_goals: number;
  time_played: number;
  fouls: number;
  yellow_cards: number;
  red_cards: number;
  blue_cards: number;
  shots_on_goal: number;
  $type: IndecentType;
  $fieldset: Fieldset;
}

export enum IndecentType {
  RosterResult = "roster_result",
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
  Exhibition: FluffyExhibition;
  "Regular Season": FluffyExhibition;
  Playoffs: FluffyExhibition;
}

export interface FluffyExhibition {
  season_id: number;
  game_type: GameTypeEnum;
  games_played: number;
  created_at: string;
  updated_at: string;
  $type: string;
  $fieldset: Fieldset;
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
  status: StatusElement;
  hide_from_standings: boolean;
  override_division_rank: null;
  travel_team_opponent: boolean;
  visibility: Visibility;
  color: string;
  roster_sort: RosterSort;
  roster_group: null;
  roster_columns: GamesheetRosterOrder[] | number[];
  roster_photo_url: OURL | null;
  schedule_photo_url: OURL | null;
  roster_photo_link: null | string;
  schedule_photo_link: null | string;
  roster_style: Fieldset;
  url: string;
  photo_url: OURL | null;
  tickets_url: null | string;
  player_status_to_show: StatusElement[];
  stats_player_status_to_show: StatusElement[];
  display_name: string;
  playoff_status: string;
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

export enum RosterSort {
  NumberAsc = "number:asc",
}

export interface TeamStats {
  Exhibition: TentacledExhibition;
  "Regular Season": TentacledExhibition;
  Playoffs: TentacledExhibition;
}

export interface TentacledExhibition {
  team_id: number;
  game_type: GameTypeEnum;
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
  $type: HilariousType;
  $fieldset: Fieldset;
}

export enum HilariousType {
  TeamResult = "team_result",
}

export enum StreakType {
  Empty = " ",
  L = "L",
  W = "W",
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
  settings: ClientServiceSettings;
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

export interface ClientServiceSettings {
  country: Country;
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

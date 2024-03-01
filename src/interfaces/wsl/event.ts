export default interface IEvent {
  events: { [key: string]: Event };
  tours: { [key: string]: Tour };
  locations: Locations;
  countries: { [key: string]: Country };
  athletes: { [key: string]: IEventAthlete };
  heats: { [key: string]: Heat };
  rounds: { [key: string]: Round };
  eventGroups: EventGroups;
  jointEvents: JointEvents;
  ranks: Ranks;
  regions: Regions;
  contents: { [key: string]: Content };
  categories: { [key: string]: IEventCategory };
  waves: { [key: string]: Wave };
}

export interface IEventAthlete {
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
  eventStats: { [key: string]: EventStat };
}

export interface EventStat {
  seed: number;
  seedPoints: number;
  tier: number;
  place: number;
  points: number;
  prizeMoney: number;
  status: null | string;
  eliminatedHeatId: null | string;
}

export enum Gender {
  F = "F",
  M = "M",
}

export enum Stance {
  Goofy = "Goofy",
  Regular = "Regular",
}

export interface IEventCategory {
  categoryId: string;
  name: string;
  code: string;
}

export interface Content {
  contentId: string;
  title: string;
  shortTitle: null;
  description: string;
  shortDescription: null;
  contentType: string;
  publishedTimestamp: string;
  websiteUrl: string;
  author: null;
  keyArt: KeyArt;
  pixelTrackingPreviewUrl: null;
  pixelTrackingFullUrl: null;
  pixelTrackingClickUrl: null;
  ctaText: null;
  assets: ContentAssets;
  videoContent: VideoContent;
  heatId: string;
  alternativeContents: AlternativeContents;
  tags?: Tags;
}

export interface AlternativeContents {
  categories: { [key: string]: AlternativeContentsCategory };
}

export interface AlternativeContentsCategory {
  categoryId: string;
  alternativeCategoryId: string;
  alternativeContentId: string;
}

export interface ContentAssets {
  connectedDevices: PurpleConnectedDevices;
}

export interface PurpleConnectedDevices {
  heroAssetUrl: null;
  herolcrAssetUrl: null;
}

export interface KeyArt {
  originalImageUrl: null | string;
  verticalImageUrl: null | string;
  horizontalImageUrl: null | string;
  squareImageUrl: null | string;
  heroImageUrl: null;
  connectedDeviceHeroImageUrl: null | string;
  hqGifUrls?: { [key: string]: HqGIFURL };
}

export interface HqGIFURL {
  video: string;
  image: string;
}

export interface Tags {
  categoryIds: string[];
}

export interface VideoContent {
  providerCode: string;
  providerName: string;
  providerVideoId: string;
  providerImageUrl: string;
  duration: number;
  inlinePlaybackEnabled: boolean;
}

export interface Country {
  countryId: string;
  name: string;
  abbr2: string;
  abbr3: string;
  flagUrl: string;
}

export interface EventGroups {
  "38": The38;
}

export interface The38 {
  eventGroupId: string;
  name: string;
}

export interface Event {
  eventId: string;
  name: string;
  code: string;
  year: number;
  tourId: string;
  stopNumber: number;
  category: null;
  startDate: string;
  endDate: string;
  startTimestamp: string;
  endTimestamp: string;
  locationId: string;
  locationName: string;
  regionId: string;
  eventGroupId: string;
  timezone: string;
  hubId: string;
  websiteUrl: string;
  minisiteUrl: null;
  isMinisiteUrlOpenExternal: boolean;
  minisiteLiveUrl: null;
  isMinisiteLiveUrlOpenExternal: boolean;
  keyArtPrimaryTextColor: null;
  keyArtSecondaryTextColor: null;
  eventStatus: string;
  bigWaveAlertStatus: null;
  statusMessage: string;
  nextStatusTimestamp: string;
  broadcastStatus: string;
  broadcastStatusMessage: null;
  broadcastStatusTimestamp: null;
  broadcastImageUrl: null;
  windowNumDays: number;
  currentWindowDayNumber: number;
  isStarted: boolean;
  isOver: boolean;
  isActive: boolean;
  isLive: boolean;
  winnerAthleteId: string;
  hasForecast: boolean;
  eventType: string;
  isTeamEvent: boolean;
  titleSponsorName: null;
  countdownTimestamp: null;
  countdownMessage: null;
  isCountdownVisible: boolean;
  isLinkableFromSchedule: boolean;
  jointEventId: string;
  assets: EventAssets;
  keyArt?: KeyArt;
  rankIds?: string[];
  athleteIds?: string[];
  roundIds?: string[];
  DEPRECIATED_DO_NOT_USE?: string;
  broadcastLanguages?: any[];
  broadcasts?: null;
  broadcastData?: null;
  currentRoundId?: string;
  currentHeatIds?: string[];
  liveHeatIds?: any[];
  liveVideoContentIds?: any[];
  hasReplayVideos?: boolean;
  firstReplayHeatIdOfDay?: string;
  firstReplayHeatOfDayLabel?: string;
}

export interface EventAssets {
  connectedDevices: FluffyConnectedDevices;
}

export interface FluffyConnectedDevices {
  keyartAssetUrl: string;
  keyartlcrAssetUrl: null;
  logoAssetUrl: null;
  heroAssetUrl: string;
  herolcrAssetUrl: null;
  posterAssetUrl: string;
  posterlcrAssetUrl: null;
}

export interface Heat {
  heatId: string;
  eventId: string;
  roundId: string;
  heatNumber: number;
  numAthletes: number;
  startTime: string;
  endTime: string;
  endUnixTS: number;
  duration: number;
  timeRemaining: number;
  isStarted: boolean;
  isOver: boolean;
  isActive: boolean;
  isLive: boolean;
  status: HeatStatus;
  athleteIds: string[];
  conditions: Conditions;
  athletes: { [key: string]: HeatAthlete };
  preStartOrderedAthleteIds: string[];
  avgWaveScore?: number;
  replayVideoContentId?: string;
  replayVideoCategoryId?: string;
}

export interface HeatAthlete {
  athleteId: string;
  place: number;
  score: number;
  singlet: Singlet;
  interference: boolean;
  interferenceType: null | string;
  needsText: string;
  needsLabel: Label;
  needsValue: string;
  toAdvanceLabel: Label | null;
  toAdvance: null | string;
  status: AthleteStatus;
  priority: null | string;
  isSuspendedPriority: boolean;
  seedNumber: number;
  waveIds?: string[];
}

export enum Label {
  Combo = "combo",
  Needs = "needs",
  WinBy = "win by",
}

export enum Singlet {
  Black = "black",
  Red = "red",
  White = "white",
  Yellow = "yellow",
}

export enum AthleteStatus {
  Active = "active",
}

export interface Conditions {
  waves: Waves;
  wind: Wind;
  airTempF: null;
  seaTempF: null;
  tideHighTime: null;
  tideLowTime: null;
}

export enum Waves {
  The46 = "4-6'",
  The68 = "6-8'",
}

export enum Wind {
  Calm = "calm",
  Onshore = "onshore",
}

export enum HeatStatus {
  Scored = "scored",
}

export interface JointEvents {
  [jointEventId: string]: JointEventItem;
}

export interface JointEventItem {
  jointEventId: string;
  name: string;
  hubContentId: string;
  startDate: string;
  endDate: string;
  countdownThresholdDays: number;
  stopNumber: string;
  isLinkable: boolean;
  jointEventStatus: string;
  nextStatusTimestamp: null;
  statusHeader: string;
  statusMessage: string;
  statusHeaderColor: string;
  statusMessageColor: string;
  isLive: boolean;
  minisiteUrl: null;
  isMinisiteUrlOpenExternal: boolean;
  minisiteLiveUrl: null;
  isMinisiteLiveUrlOpenExternal: boolean;
  json: any[];
  eventIds: string[];
  featuredEventId: string;
  locationId: string;
  keyArt: KeyArt;
}

export interface Locations {
  [locationId: string]: LocationItem;
}

export interface LocationItem {
  DEPRECIATED_DO_NOT_USE: string;
  locationId: string;
  name: string;
  town: string;
  city: string;
  state: null;
  country: string;
  countryId: string;
  zipCode: string;
  timezone: string;
  format: string;
  formattedName: string;
}

export interface Ranks {
  [rankId: string]: RankItem;
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
  eventPlaces: EventPlaces;
}

export interface EventPlaces {
  [eventPlaceId: string]: EventPlaceItem[];
}

export interface EventPlaceItem {
  place: number;
  points: number;
  prizeMoney: number;
}

export interface Regions {
  [regionId: string]: RegionItem;
}

export interface RegionItem {
  regionId: string;
  name: string;
}

export interface Round {
  roundId: string;
  eventId: string;
  roundNumber: number;
  name: string;
  shortName: string;
  abbr: string;
  startTime: string;
  endTime: string;
  isStarted: boolean;
  isOver: boolean;
  isActive: boolean;
  avgWaveScore: number;
  maxHeatScore: number;
  roundIsTrial: boolean;
  heatIds?: string[];
}

export interface Tour {
  tourId: string;
  name: string;
  nameWithoutGender: string;
  sponsorName: null;
  code: string;
  displayCode: string;
  gender: Gender;
  featuredEventId: string;
}

export interface Wave {
  waveId: string;
  eventId: string;
  roundId: string;
  heatId: string;
  athleteId: string;
  waveNumber: number;
  heatWaveNumber: number;
  startTime: string;
  endTime: string;
  scoreTime: string;
  heatTimeRemaining: number;
  score: number;
  rawScore: number;
  counted: boolean;
  interference: boolean;
  interferenceType: null;
  halfScore: boolean;
  replayVideoContentId: null;
}

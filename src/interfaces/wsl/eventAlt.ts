export default interface IEventAlt {
  events: { [key: string]: Event };
  tours: { [key: string]: Tour };
  locations: Locations;
  countries: { [key: string]: Country };
  eventGroups: EventGroups;
  jointEvents: JointEvents;
  sponsors: Sponsors;
  rounds: { [key: string]: Round };
  heats: { [key: string]: Heat };
  athletes: { [key: string]: IEventAltAthlete };
  contents: { [key: string]: Content };
  categories: { [key: string]: IEventAltCategory };
}

export interface IEventAltAthlete {
  athleteId: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  nationAbbr: string;
  stance: Stance | null;
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
}

export enum Gender {
  M = "M",
}

export enum Stance {
  Goofy = "Goofy",
  Regular = "Regular",
}

export interface IEventAltCategory {
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
  contentType: ContentType;
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

export enum ContentType {
  Video = "video",
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
  providerCode: ProviderCode;
  providerName: ProviderName;
  providerVideoId: string;
  providerImageUrl: string;
  duration: number;
  inlinePlaybackEnabled: boolean;
}

export enum ProviderCode {
  Aws = "aws",
}

export enum ProviderName {
  Aws = "AWS",
}

export interface Country {
  countryId: string;
  name: string;
  abbr2: string;
  abbr3: string;
  flagUrl: string;
}

export interface EventGroups {
  "6": EventGroups6;
}

export interface EventGroups6 {
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
  endTimestamp: null;
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
  broadcastStatusMessage: null | string;
  broadcastStatusTimestamp: string | null;
  broadcastImageUrl: null;
  windowNumDays: number;
  currentWindowDayNumber: number;
  isStarted: boolean;
  isOver: boolean;
  isActive: boolean;
  isLive: boolean;
  winnerAthleteId: null;
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
  roundIds?: string[];
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
  startTime: string | null;
  endTime: string | null;
  endUnixTS: number;
  duration: number | null;
  timeRemaining: number;
  isStarted: boolean;
  isOver: boolean;
  isActive: boolean;
  isLive: boolean;
  status: HeatStatus;
  athleteIds: string[];
  conditions: Conditions;
  athletes?: { [key: string]: HeatAthlete };
  preStartOrderedAthleteIds: string[];
  replayVideoContentId?: string;
}

export interface HeatAthlete {
  athleteId: string;
  place: number;
  score: number;
  singlet: Singlet;
  interference: boolean;
  interferenceType: null;
  needsText: null | string;
  needsLabel: Label | null;
  needsValue: null | string;
  toAdvanceLabel: Label | null;
  toAdvance: null | string;
  status: AthleteStatus;
  priority: null;
  isSuspendedPriority: boolean;
  seedNumber: number;
}

export enum Label {
  Needs = "needs",
  WinBy = "win by",
}

export enum Singlet {
  Blue = "blue",
  Red = "red",
  White = "white",
  Yellow = "yellow",
}

export enum AthleteStatus {
  Active = "active",
}

export interface Conditions {
  waves: boolean | WavesEnum;
  wind: boolean | WindEnum;
  airTempF: boolean | null;
  seaTempF: boolean | null;
  tideHighTime: boolean | null;
  tideLowTime: boolean | null;
}

export enum WavesEnum {
  The14 = "1-4'",
}

export enum WindEnum {
  Cross = "cross",
  Light = "light",
}

export enum HeatStatus {
  Scored = "scored",
  Upcoming = "upcoming",
}

export interface JointEvents {
  "69": The69;
}

export interface The69 {
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
  titleSponsorId: string;
  locationId: string;
  keyArt: KeyArt;
}

export interface Locations {
  "6": Locations6;
}

export interface Locations6 {
  DEPRECIATED_DO_NOT_USE: string;
  locationId: string;
  name: string;
  town: string;
  city: string;
  state: string;
  country: string;
  countryId: string;
  zipCode: string;
  timezone: string;
  format: string;
  formattedName: string;
}

export interface Round {
  roundId: string;
  eventId: string;
  roundNumber: number;
  name: string;
  shortName: string;
  abbr: string;
  startTime: string | null;
  endTime: string | null;
  isStarted: boolean;
  isOver: boolean;
  isActive: boolean;
  avgWaveScore: number | null;
  maxHeatScore: number | null;
  roundIsTrial: boolean;
  currentHeatId: string;
  heatIds: string[];
}

export interface Sponsors {
  "199": The199;
}

export interface The199 {
  sponsorId: string;
  name: string;
  details: Details;
  code: string;
}

export interface Details {
  textColor: null;
  backgroundColor: null;
  prefix: string;
  lightThemeLogoUrl: null;
  darkThemeLogoUrl: null;
}

export interface Tour {
  tourId: string;
  name: string;
  nameWithoutGender: string;
  sponsorName: null;
  code: string;
  displayCode: string;
  gender: string;
  featuredEventId: string;
}

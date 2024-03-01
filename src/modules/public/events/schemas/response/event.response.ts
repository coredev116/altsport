import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

class ScoresListing {
  @ApiProperty({
    name: "id",
    type: "string",
    required: true,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
    description: "Unique ID related to the score.",
  })
  id: string;

  @ApiProperty({
    name: "teamId",
    type: "string",
    required: true,
    example: "c47a24b5-3c68-4884-9e97-b575ab1771cf",
    description: "ID for the team that scored the goals.",
  })
  teamId: string;

  @ApiProperty({
    name: "goals",
    type: "integer",
    example: 1,
    description: "Number of goals scored for the round.",
  })
  goals: number;
}

class TeamsListing {
  @ApiProperty({
    name: "id",
    type: "string",
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  id: string;

  @ApiProperty({
    name: "name",
    type: "string",
    example: "Strykers",
  })
  name: string;

  @ApiProperty({
    name: "shortName",
    type: "string",
    example: "Strykers",
  })
  shortName: string;

  @ApiProperty({
    name: "logo",
    type: "string",
    example:
      "https://img.shiftstats.com/bfbdcb2a-4f27-40fd-8e9d-0c31cbc1b1f6/team-logo_url-214529-strykers-1663790864878505113.png",
  })
  logo: string;

  @ApiProperty({
    name: "isHomeTeam",
    type: "boolean",
    example: true,
  })
  isHomeTeam: boolean;
}

class EventRoundHeatListing {
  @ApiProperty({
    name: "id",
    type: "uuid",
    required: true,
    example: "2127ea10-6110-4ffd-9403-3e33fc0929de",
    description: "Unique ID related to the heat sub-segment.",
  })
  id: string;

  @ApiProperty({
    name: "heatName",
    type: "string",
    required: true,
    example: "Heat 1",
    description: "The name of the heat sub-segment.",
  })
  heatName: string;

  @ApiProperty({
    name: "heatNo",
    type: "number",
    example: 1,
    required: true,
    description:
      "The sequential number of the heat sub-segment within the round segment, for chronological record.",
  })
  heatNo: number;

  @ApiProperty({
    name: "heatStatus",
    type: "string",
    example: "UPCOMING",
    required: false,
    description:
      "Heat statuses are the same as contest or event and round statuses, and each will be applied to the heat sub-segments.",
  })
  heatStatus: string;

  @ApiProperty({
    name: "startDate",
    type: "string",
    format: "date",
    required: false,
    example: "2022-04-18T15:25:24Z",
    description: "The start date of the heat sub-segment.",
  })
  startDate: Date;

  @ApiProperty({
    name: "endDate",
    type: "string",
    format: "date",
    required: false,
    example: "2022-04-18T15:25:24Z",
    description: "The end date of the heat sub-segment.",
  })
  endDate: Date;
}

class EventRoundListing {
  @ApiProperty({
    name: "id",
    type: "uuid",
    required: true,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
    description: "Unique ID related to the round segment.",
  })
  id: string;

  @ApiProperty({
    name: "roundName",
    type: "string",
    required: true,
    example: "Seeding Round",
    description:
      "The name of the round segment - for example, Round 1, Qualifying Round or Battle Bracket Final.",
  })
  roundName: string;

  @ApiProperty({
    name: "roundNo",
    type: "number",
    required: true,
    example: 1,
    description:
      "The sequential number of the round segment within the contest, for chronological record.",
  })
  roundNo: number;

  @ApiProperty({
    name: "roundStatus",
    type: "string",
    required: true,
    example: "COMPLETED",
    description:
      "Round statuses are the same as contest or event statuses, and each will be applied to round segments.",
  })
  roundStatus: string;

  @ApiProperty({
    name: "startDate",
    type: "string",
    format: "date",
    required: false,
    example: "2022-04-18T15:25:24Z",
    description: "The start date of the round segment.",
  })
  startDate: Date;

  @ApiProperty({
    name: "endDate",
    type: "string",
    format: "date",
    required: false,
    example: "2022-04-18T15:25:24Z",
    description: "The end date of the round segment.",
  })
  endDate: Date;

  @ApiProperty({ type: EventRoundHeatListing, isArray: true })
  heats: EventRoundHeatListing[];

  @ApiProperty({ type: ScoresListing, isArray: true })
  scores: ScoresListing[];
}

export default class EventResponse {
  @ApiProperty({
    type: "uuid",
    example: "nrx:2127ea10-6110-4ffd-9403-3e33fc0929de",
    description: "Unique ID related to the contest.",
  })
  id: string;

  @ApiProperty({
    name: "tourName",
    type: "string",
    example: "World Surf League",
    description:
      "The name of the tour or league that is hosting the contest (tour is a general sub-category within a sports league, and may not necessarily apply directly to a tour as defined by the official association).",
  })
  @IsString()
  tourName: string;

  @ApiProperty({
    name: "name",
    type: "string",
    example: "Billabong Pro Pipeline",
    description: "The name of the contest, which may not be unique.",
  })
  @IsString()
  name: string;

  @ApiProperty({
    name: "startDate",
    type: "string",
    format: "date",
    example: "2022-04-18T15:25:24Z",
    description: "The expected start date for the contest.",
  })
  startDate: Date;

  @ApiProperty({
    name: "endDate",
    type: "string",
    format: "date",
    example: "2022-04-18T15:25:24Z",
    description: "The expected end date for the contest.",
  })
  endDate: Date;

  @ApiProperty({
    name: "year",
    type: "number",
    example: 2019,
    description:
      "The year in which the season of the contest started (for seasons that span more than a single calendar year, we use only the first year to apply for each contest - for example, if the 2021 Nitrocross season concludes in 2022, the year applied to a contest held in March of 2022 will be 2021, while the endDate will be in 2022).",
  })
  year: number;

  @ApiProperty({
    name: "eventNumber",
    type: "number",
    example: 1,
    description:
      "The sequential number of the event within the season for that league and year - for example, the first contest of a season will show an eventNumber of 1.",
  })
  eventNumber: number;

  @ApiProperty({
    name: "eventStatus",
    type: "string",
    example: "UPCOMING",
    description:
      "The status of the contest, to indicate if it is scheduled and upcoming, live, completed, canceled or postponed.",
  })
  eventStatus: string;

  @ApiProperty({
    name: "eventLocation",
    type: "string",
    example: "Canterbury, UK",
    description:
      "The geographical location of the contest to the best standardization possible - for example, while we can format contest locations for the United States as City, State, USA, it is not always the same format internationally and we may adapt these formats as necessary.",
  })
  eventLocation: string;

  @ApiProperty({
    name: "eventLocationGroup",
    type: "string",
    example: "Canterbury, UK",
    description:
      "(Applies to World Surf League only) This is similar to eventLocation, but denotes a contest lineage that may be held at different geographical locations - for example, the Gold Coast Pro is typically held at Kirra Beach in Coolangatta, Queensland, Australia. However, due to surf conditions, it may be held at another beach in the neighboring city of Tweed Heads, Queensland, Australia. As such, eventLocationGroup will still be the same for both contests, while the eventLocation will be different.",
  })
  eventLocationGroup: string;

  @ApiProperty({
    type: EventRoundListing,
    isArray: true,
    description:
      "A round is the same as any contest segment at the highest level, regardless of whether it is defined as a Round by the official sports organization. It is an array of objects that provide details about the round, as well as further segmentation of the contest formats as applicable.",
  })
  rounds: EventRoundListing[];

  @ApiProperty({ type: TeamsListing, isArray: true })
  teams: TeamsListing[];
}

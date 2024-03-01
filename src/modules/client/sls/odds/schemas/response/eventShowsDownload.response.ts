import { ApiProperty, ApiExtraModels } from "@nestjs/swagger";

class EventShowsAthlete {
  @ApiProperty({
    type: "string",
    example: "2127ea10-6110-4ffd-9403-3e33fc0929de",
  })
  id: string;

  @ApiProperty({
    example: "Jane",
  })
  firstName: string;

  @ApiProperty({
    example: "M",
  })
  middleName: string;

  @ApiProperty({
    example: "Doe",
  })
  lastName: string;
}

class EventShows {
  @ApiProperty({
    type: "string",
    example: "2127ea10-6110-4ffd-9403-3e33fc0929de",
  })
  id: string;

  @ApiProperty({
    name: "eventParticipantId",
    type: "string",
    required: true,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  eventParticipantId: string;

  @ApiProperty({
    name: "odds",
    example: 30.2,
    type: "decimal",
  })
  odds: number;

  @ApiProperty({
    name: "probability",
    example: 30.2,
    type: "decimal",
  })
  probability: number;

  @ApiProperty({
    name: "trueProbability",
    example: 30.2,
    type: "decimal",
  })
  trueProbability: number;

  @ApiProperty({
    name: "hasModifiedProbability",
    example: true,
    type: "boolean",
  })
  hasModifiedProbability: boolean;

  @ApiProperty({
    type: EventShowsAthlete,
  })
  athlete: EventShowsAthlete;

  @ApiProperty({
    example: "2022-12-27T13:57:53.866Z",
    type: "Date",
  })
  createdAt: Date;
}

@ApiExtraModels(EventShows)
export default class EventShowsOddsDownload {
  @ApiProperty({
    type: "string",
    example: "Skateboarding League",
  })
  sport: string;

  @ApiProperty({
    type: "string",
    example: "SLS",
  })
  league: string;

  @ApiProperty({
    type: "number",
    example: 2021,
  })
  year: number;

  @ApiProperty({
    type: "string",
    example: "Elk River",
  })
  eventName: string;

  @ApiProperty({
    name: "startDate",
    type: "string",
    format: "date",
    example: "2022-04-18T15:25:24Z",
    required: false,
  })
  startDate: Date;

  @ApiProperty({
    name: "endDate",
    type: "string",
    format: "date",
    example: "2022-04-18T15:25:24Z",
    required: false,
  })
  endDate: Date;

  @ApiProperty({ name: "eventNumber", type: "number", example: 1, required: true })
  eventNumber: number;

  @ApiProperty({
    name: "eventLocation",
    type: "string",
    required: true,
    example: "Banzai Pipeline",
  })
  eventLocation: string;

  @ApiProperty({
    name: "eventLocationGroup",
    type: "string",
    required: false,
    example: "Margaret River",
  })
  eventLocationGroup: string;

  @ApiProperty({ name: "eventStatus", type: "number", example: 1, required: false })
  eventStatus: number;

  @ApiProperty({
    type: Object,
    properties: {
      [new Date().toISOString()]: {
        type: "array",
        items: { $ref: "#/components/schemas/EventShows" },
      },
    },
  })
  publishes: Record<string, EventShows[]>;
}

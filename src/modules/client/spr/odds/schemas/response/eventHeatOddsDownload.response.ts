import { ApiProperty, ApiExtraModels } from "@nestjs/swagger";

class ClientHeatOdds {
  @ApiProperty({
    type: "string",
    example: "2127ea10-6110-4ffd-9403-3e33fc0929de",
  })
  id: string;

  @ApiProperty({
    type: "string",
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  athleteId: string;

  @ApiProperty({
    type: "string",
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  eventParticipantId: string;

  @ApiProperty({
    example: "Andrew",
  })
  firstName: string;

  @ApiProperty({
    example: "M",
  })
  middleName: string;

  @ApiProperty({
    example: "Carlson",
  })
  lastName: string;

  @ApiProperty({
    example: 30.2,
    type: "decimal",
  })
  odds: number;

  @ApiProperty({
    example: 1.2,
    type: "decimal",
  })
  probability: number;

  @ApiProperty({
    example: 3.2,
    type: "decimal",
  })
  trueProbability: number;
}

@ApiExtraModels(ClientHeatOdds)
class RoundHeats {
  @ApiProperty({
    type: "string",
    example: "2127ea10-6110-4ffd-9403-3e33fc0929de",
  })
  id: string;

  @ApiProperty({
    type: "string",
    example: "2127ea10-6110-4ffd-9403-3e33fc0929de",
  })
  heatWinnerAthleteId: string;

  @ApiProperty({
    type: "string",
    example: "Heat 1",
  })
  name: string;

  @ApiProperty({
    name: "heatNo",
    type: "number",
    example: 1,
  })
  heatNo: number;

  @ApiProperty({
    example: 1,
  })
  heatStatus: number;

  @ApiProperty({
    name: "isHeatWinnerMarketVoided",
    type: "boolean",
    example: true,
  })
  isHeatWinnerMarketVoided: number;

  @ApiProperty({
    name: "voidDate",
    type: "string",
    format: "date",
    example: "2022-02-18T15:25:24Z",
  })
  voidDate: Date;

  @ApiProperty({
    name: "startDate",
    type: "string",
    format: "date",
    example: "2022-01-08T15:25:24Z",
  })
  startDate: Date;

  @ApiProperty({
    name: "endDate",
    type: "string",
    format: "date",
    example: "2022-01-09T15:25:24Z",
  })
  endDate: Date;

  @ApiProperty({
    type: Object,
    properties: {
      [new Date().toISOString()]: {
        type: "array",
        items: { $ref: "#/components/schemas/ClientHeatOdds" },
      },
    },
  })
  publishes: Record<string, ClientHeatOdds[]>;
}

export default class EventHeadOddsDownload {
  @ApiProperty({
    type: "string",
    example: "SuperCross",
  })
  sport: string;

  @ApiProperty({
    type: "string",
    example: "KTM Junior Supercross",
  })
  tour: string;

  @ApiProperty({
    type: "number",
    example: 2021,
  })
  year: number;

  @ApiProperty({
    type: "string",
    example: "Arlington 3",
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
    example: "Arlington",
  })
  eventLocation: string;

  @ApiProperty({
    name: "eventLocationGroup",
    type: "string",
    required: false,
    example: "Arlington",
  })
  eventLocationGroup: string;

  @ApiProperty({ name: "eventStatus", type: "number", example: 1, required: false })
  eventStatus: number;

  @ApiProperty({
    type: "string",
    example: "Semifinals",
  })
  roundName: string;

  @ApiProperty({
    type: RoundHeats,
    isArray: true,
  })
  heats: RoundHeats[];
}

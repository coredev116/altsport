import { ApiProperty, ApiExtraModels } from "@nestjs/swagger";

class EventPropBetsAthlete {
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

class EventPropBets {
  @ApiProperty({
    type: "string",
    example: "2127ea10-6110-4ffd-9403-3e33fc0929de",
  })
  id: string;

  @ApiProperty({
    name: "betId",
    type: "string",
    example: "9202fa15-522b-44b7-9e0e-7032f6170f22",
  })
  betId: string;

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

  @ApiProperty({ name: "proposition", type: "string", example: "Reaches quarterfinals" })
  proposition: string;

  @ApiProperty({ name: "payout", type: "boolean", example: true, required: false, default: false })
  payout: boolean;

  @ApiProperty({ name: "voided", type: "boolean", example: true, required: false, default: false })
  voided: boolean;

  @ApiProperty({
    type: EventPropBetsAthlete,
  })
  athlete: EventPropBetsAthlete;

  @ApiProperty({
    example: "2022-12-27T13:57:53.866Z",
    type: "Date",
  })
  createdAt: Date;
}

@ApiExtraModels(EventPropBets)
export default class EventPropBetsDownload {
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
    type: Object,
    properties: {
      [new Date().toISOString()]: {
        type: "array",
        items: { $ref: "#/components/schemas/EventPropBets" },
      },
    },
  })
  publishes: Record<string, EventPropBets[]>;
}

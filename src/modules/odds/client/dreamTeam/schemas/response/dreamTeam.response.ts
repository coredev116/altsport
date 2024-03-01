import { ApiProperty } from "@nestjs/swagger";

import { IApexDreamTeamParticipantsJSON } from "../../../../../../interfaces/apex";

class Teams {
  @ApiProperty({
    name: "team",
    type: "string",
    example: "A",
  })
  team: string;

  @ApiProperty({
    name: "odds",
    type: "number",
    example: 30.5,
  })
  odds: number;

  @ApiProperty({
    name: "probability",
    type: "number",
    example: 30.5,
  })
  probability: number;

  @ApiProperty({
    example: 30.2,
    type: "decimal",
  })
  trueProbability: number;

  @ApiProperty({
    name: "hasModifiedProbability",
    type: "boolean",
    example: true,
  })
  hasModifiedProbability: boolean;

  @ApiProperty({
    type: Object,
    example: `
    [
        {
        "firstName": "Athlete name",
        "lastName": "Athlete name",
        "eventParticipantId": "a2ac2-0111-4b99-b402-08a19a731eda"
        }
    ]
`,
  })
  participants: IApexDreamTeamParticipantsJSON[];
}

export default class ProjectionDreamTeamResponse {
  @ApiProperty({
    name: "id",
    type: "string",
    required: true,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  id: string;

  @ApiProperty({
    name: "eventId",
    type: "string",
    example: "bc8a2ac2-0111-4b99-b402-08a19a731eda",
  })
  eventId: string;

  @ApiProperty({
    name: "voided",
    type: "boolean",
    example: true,
  })
  voided: boolean;

  @ApiProperty({
    name: "draw",
    type: "boolean",
    example: true,
  })
  draw: boolean;

  @ApiProperty({
    type: Teams,
    isArray: true,
  })
  teams: Teams[];
}

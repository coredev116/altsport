import { ApiProperty } from "@nestjs/swagger";

export default class TeamsResponse {
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

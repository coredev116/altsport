import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, ValidateNested } from "class-validator";

import { BetStatus } from "../../../../constants/odds";
import { IApexDreamTeamParticipantsJSON } from "../../../../interfaces/apex";

import ProjectionExactasResponse from "./projectionExactas.response";
import ProjectionExactasHeatResponse from "./projectionExactasHeat.response";
import AthleteResponse from "./athlete.response";
import EventHeatOddsResponse from "./eventHeadOdds.response";

class EventWinnerDto {
  @ApiProperty({
    name: "id",
    type: "string",
    required: true,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
    description: "ID related to the odd",
  })
  id: string;

  @ApiProperty({
    name: "position",
    type: "number",
    example: 1,
    description:
      "Indicates the position of the athlete with respect to the odd. This can be the likelihood of an athlete in first place or second place, wherein position will have the value of 1 or 2.",
  })
  position: number;

  @ApiProperty({
    name: "probability",
    type: "decimal",
    example: 0.6,
    description:
      "The probability between 0 and 1 for the athlete to win the heat against the other known heat athletes.",
  })
  probability: number;

  @ApiProperty({
    name: "odds",
    type: "decimal",
    example: 1.344,
    description:
      "The translated probability as well as any pre-agreed margin as odds for the athlete to win the heat against the other known heat athletes.",
  })
  odds: number;

  @ApiProperty({ type: AthleteResponse })
  athlete: AthleteResponse;
}

class SecondPlaceDto {
  @ApiProperty({
    name: "id",
    type: "string",
    required: true,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
    description: "ID related to the odd",
  })
  id: string;

  @ApiProperty({
    name: "position",
    type: "number",
    example: 1,
    description:
      "Indicates the position of the athlete with respect to the odd. This can be the likelihood of an athlete in first place or second place, wherein position will have the value of 1 or 2.",
  })
  position: number;

  @ApiProperty({
    name: "probability",
    type: "decimal",
    example: 0.6,
    description:
      "The probability between 0 and 1 for the athlete to win the heat against the other known heat athletes.",
  })
  probability: number;

  @ApiProperty({
    name: "odds",
    type: "decimal",
    example: 1.344,
    description:
      "The translated probability as well as any pre-agreed margin as odds for the athlete to win the heat against the other known heat athletes.",
  })
  odds: number;

  @ApiProperty({ type: AthleteResponse })
  athlete: AthleteResponse;
}

class PodiumsDto {
  @ApiProperty({
    type: "string",
    example: "2127ea10-6110-4ffd-9403-3e33fc0929de",
    description: "ID related to the odd",
  })
  id: string;

  @ApiProperty({
    example: 30.2,
    type: "decimal",
    description:
      "The translated probability as well as any pre-agreed margin as odds for the athlete to win the heat against the other known heat athletes.",
  })
  odds: number;

  @ApiProperty({
    example: 30.2,
    type: "decimal",
    description:
      "The probability between 0 and 1 for the athlete to win the heat against the other known heat athletes.",
  })
  probability: number;

  @ApiProperty({ type: AthleteResponse })
  athlete: AthleteResponse;
}

class ShowsDto {
  @ApiProperty({
    type: "string",
    example: "2127ea10-6110-4ffd-9403-3e33fc0929de",
    description: "ID related to the odd",
  })
  id: string;

  @ApiProperty({
    example: 30.2,
    type: "decimal",
    description:
      "The translated probability as well as any pre-agreed margin as odds for the athlete to win the heat against the other known heat athletes.",
  })
  odds: number;

  @ApiProperty({
    example: 30.2,
    type: "decimal",
    description:
      "The probability between 0 and 1 for the athlete to win the heat against the other known heat athletes.",
  })
  probability: number;

  @ApiProperty({ type: AthleteResponse })
  athlete: AthleteResponse;
}

export class PropBetsDto {
  @ApiProperty({
    name: "id",
    type: "string",
    example: "bc8a2ac2-0111-4b99-b402-08a19a731eda",
    description: "ID related to the odd",
  })
  id: string;

  @ApiProperty({ type: AthleteResponse })
  athlete: AthleteResponse;

  @ApiProperty({
    name: "proposition",
    type: "string",
    example: "Reaches quarterfinals",
    description: "Proposition for the bet",
  })
  proposition: string;

  @ApiProperty({
    name: "odds",
    format: "decimal",
    type: "number",
    example: 30.5,
    description:
      "The translated probability as well as any pre-agreed margin as odds for the athlete to win the heat against the other known heat athletes.",
  })
  odds: number;

  @ApiProperty({
    name: "probability",
    type: "decimal",
    example: 30.5,
    description:
      "The probability between 0 and 1 for the athlete to win the heat against the other known heat athletes.",
  })
  probability: number;

  // @ApiProperty({
  //   name: "payout",
  //   type: "boolean",
  //   example: true,
  //   required: false,
  //   default: false,
  //   description:
  //     "As current, a boolean value of true or false that indicates whether the market should be paid to bettors of the winning athlete. We will remove the boolean structure during the initial integration process and likely move towards a market status instead.",
  // })
  // payout: boolean;

  // @ApiProperty({
  //   name: "voided",
  //   type: "boolean",
  //   example: true,
  //   required: false,
  //   default: false,
  //   description:
  //     "As current, a boolean value of true or false that indicates whether the market should be paid to no bettors, and is voided by the trader for any reason. We will remove the boolean structure during the initial integration process and likely move towards a market status instead.",
  // })
  // voided: boolean;

  @ApiProperty({
    name: "betStatus",
    type: "string",
    example: BetStatus.PAYOUT,
    enum: BetStatus,
    description:
      "The status indicates whether the market should be paid to no bettors, and is voided by the trader for any reason or if the market should be paid to bettors of the winning athlete or if the outcome is a draw.",
  })
  betStatus: string;
}

class EventParticipant {
  @ApiProperty({
    name: "id",
    type: "string",
    required: true,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
    description: "ID related to the odd",
  })
  id: string;

  @ApiProperty({
    name: "position",
    type: "number",
    example: 1,
    description: "Indicates the position of the athlete in the event.",
  })
  position: number;

  @ApiProperty({
    name: "odds",
    type: "number",
    example: 30.5,
    description:
      "The translated probability as well as any pre-agreed margin as odds for the athlete to win the heat against the other known heat athletes.",
  })
  odds: number;

  @ApiProperty({ type: AthleteResponse })
  athlete: AthleteResponse;
}

class PlayerHeadToHeadDto {
  @ApiProperty({
    type: EventParticipant,
    description:
      "The athlete, their odds to win the head to head matchup versus the other athlete, and their final contest position if the contest is “Completed” (as a verification method).",
  })
  eventParticipant1: EventParticipant;

  @ApiProperty({
    type: EventParticipant,
    description:
      "The athlete, their odds to win the head to head matchup versus the other athlete, and their final contest position if the contest is “Completed” (as a verification method).",
  })
  eventParticipant2: EventParticipant;

  @ApiProperty({
    name: "winnerParticipantId",
    type: "string",
    example: "bc8a2ac2-0111-4b99-b402-08a19a731eda",
    description:
      "The athlete ID of the winning athlete. This structure will change during the initial integration process to meet client formatting.",
  })
  winnerParticipantId: string;

  // @ApiProperty({
  //   name: "payout",
  //   type: "boolean",
  //   example: true,
  //   required: false,
  //   default: false,
  //   description:
  //     "As current, a boolean value of true or false that indicates whether the market should be paid to bettors of the winning athlete. We will remove the boolean structure during the initial integration process and likely move towards a market status instead.",
  // })
  // payout: boolean;

  // @ApiProperty({
  //   name: "voided",
  //   type: "boolean",
  //   example: true,
  //   required: false,
  //   default: false,
  //   description:
  //     "As current, a boolean value of true or false that indicates whether the market should be paid to no bettors, and is voided by the trader for any reason. We will remove the boolean structure during the initial integration process and likely move towards a market status instead.",
  // })
  // voided: boolean;

  // @ApiProperty({
  //   name: "draw",
  //   type: "boolean",
  //   example: true,
  //   required: false,
  //   default: false,
  //   description:
  //     "As current, a boolean value of true or false that indicates whether the market resulted in a draw between the two athletes. It is intended as an indication along with a note, as each client may have different rules regarding how they govern head to head ties for their players. We will remove the boolean structure during the initial integration process and likely move towards a market status instead.",
  // })
  // draw: boolean;

  @ApiProperty({
    name: "betStatus",
    type: "string",
    example: BetStatus.DRAW,
    enum: BetStatus,
    description:
      "The status indicates whether the market should be paid to no bettors, and is voided by the trader for any reason or if the market should be paid to bettors of the winning athlete or if the outcome is a draw.",
  })
  betStatus: string;
}

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

class DreamTeamDto {
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
    name: "betStatus",
    type: "string",
    example: BetStatus.VOID,
    enum: BetStatus,
    description:
      "The status indicates whether the market should be paid to no bettors, and is voided by the trader for any reason or if the market should be paid to bettors of the winning athlete or if the outcome is a draw.",
  })
  betStatus: string;

  @ApiProperty({
    type: Teams,
    isArray: true,
  })
  teams: Teams[];
}

export class EventOddsResponse {
  @ApiProperty({
    name: "eventId",
    type: "string",
    required: true,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
    description: "ID related to the event",
  })
  eventId: string;

  @ApiProperty({
    name: "oddType",
    type: "string",
    required: true,
    example: "eventWinner",
    description: "The market for which odds will be returned.",
  })
  oddType: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EventWinnerDto)
  @ApiProperty({
    name: "eventWinner",
    type: EventWinnerDto,
    required: true,
    isArray: true,
    description: "Odds for each athlete to win the contest",
  })
  eventWinner: EventWinnerDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SecondPlaceDto)
  @ApiProperty({
    name: "secondPlace",
    type: SecondPlaceDto,
    required: true,
    isArray: true,
    description: " Odds for each athlete to place second in the contest, overall.",
  })
  secondPlace: SecondPlaceDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EventHeatOddsResponse)
  @ApiProperty({
    name: "heatWinner",
    type: EventHeatOddsResponse,
    required: true,
    isArray: true,
    description:
      " Odds for an athlete to win a heat or grouped matchup against one or more athletes within a heat. This is dependent on the known participants of the heat prior to markets opening.",
  })
  heatWinner: EventHeatOddsResponse[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PlayerHeadToHeadDto)
  @ApiProperty({
    name: "headToHead",
    type: PlayerHeadToHeadDto,
    required: true,
    isArray: true,
    description:
      "Odds for one athlete to finish the contest in a better overall position than another athlete. This is a matchup for formats that may not typically have head to head formats during any contest segment.",
  })
  headToHead: PlayerHeadToHeadDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PropBetsDto)
  @ApiProperty({
    name: "propBets",
    type: PropBetsDto,
    required: true,
    isArray: true,
    description:
      "Odds for any various number of propositions that are not considered standardized toplines or derivatives. Props may or may not be tied to an individual athlete.",
  })
  propBets: PropBetsDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ShowsDto)
  @ApiProperty({
    name: "shows",
    type: ShowsDto,
    required: true,
    isArray: true,
    description: "Odds for one athlete to finish the contest in either first or second place.",
  })
  shows: ShowsDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PodiumsDto)
  @ApiProperty({
    name: "podiums",
    type: PodiumsDto,
    required: true,
    isArray: true,
    description:
      "Odds for one athlete to finish the contest in either first, second or third place.",
  })
  podiums: PodiumsDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DreamTeamDto)
  @ApiProperty({
    name: "dreamTeam",
    type: DreamTeamDto,
    required: true,
    isArray: true,
    description: "Odds for dream team.",
  })
  dreamTeam: DreamTeamDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectionExactasResponse)
  @ApiProperty({
    name: "eventExacta",
    type: ProjectionExactasResponse,
    required: true,
    isArray: true,
    description: "Odds for event exacta.",
  })
  eventExacta: ProjectionExactasResponse[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectionExactasHeatResponse)
  @ApiProperty({
    name: "heatExacta",
    type: ProjectionExactasHeatResponse,
    required: true,
    isArray: true,
    description: "Odds for event heat.",
  })
  heatExacta: ProjectionExactasHeatResponse[];
}

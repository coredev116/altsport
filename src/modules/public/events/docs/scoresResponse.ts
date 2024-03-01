import { ApiProperty } from "@nestjs/swagger";

import AthleteResponse from "./athlete.response";

import { NRXLapStatus } from "../../../../constants/system";

export class RoundScoreResponse {
  @ApiProperty({
    name: "id",
    type: "string",
    required: true,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
    description: "The ID related to the score",
  })
  id: string;

  @ApiProperty({
    name: "eventId",
    type: "string",
    required: true,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
    description: "The ID related to the event.",
  })
  eventId: string;

  @ApiProperty({
    name: "heatId",
    type: "string",
    required: true,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
    description: "The ID related to the heat sub-segment.",
  })
  heatId: string;

  @ApiProperty({
    name: "athleteRoundSeed",
    type: "number",
    example: 1,
    description:
      "The round seed for an athlete. Round seeds are the ranking for each athlete within a round segment, if the contest format requires it for athlete placement. It is similar to, but often different from, an athlete’s event seed.",
  })
  athleteRoundSeed: number | null;

  @ApiProperty({
    name: "athleteRoundRank",
    type: "number",
    example: 1,
    description: "The final position of the athlete after the round segment has ended.",
  })
  athleteRoundRank: number | null;

  @ApiProperty({
    name: "athleteHeatScore",
    type: "number",
    example: 12,
    description: "An athlete’s score for a heat. ( Applicable for WSL & SLS only )",
  })
  athleteHeatScore: number | null;

  @ApiProperty({
    name: "athleteLapTime",
    type: "number",
    example: 66,
    description:
      "An athlete's lap time for a lap within a race. ( Applicable for Nitrocross & Supercross only )",
  })
  athleteLapTime: number | null;

  @ApiProperty({
    name: "athletePenaltyTime",
    type: "number",
    example: 66,
    description:
      "An athlete's penalty time for a lap within a race. ( Applicable for Nitrocross & Supercross only )",
  })
  athletePenaltyTime: number | null;

  @ApiProperty({
    name: "athleteJokerLapTime",
    type: "number",
    example: 66,
    description: "An athlete's joker lap time within a race. ( Applicable for Nitrocross only )",
  })
  athleteJokerLapTime: number | null;

  @ApiProperty({
    name: "athleteJokerLap",
    type: "number",
    example: 66,
    description: "An athlete's joker lap number. ( Applicable for Nitrocross only )",
  })
  athleteJokerLap: number | null;

  @ApiProperty({
    name: "athleteLapStatus",
    example: NRXLapStatus.ACTIVE,
    enum: NRXLapStatus,
    description: "The status of the lap. ( Applicable for Nitrocross only )",
  })
  athleteLapStatus: string;

  @ApiProperty({
    name: "totalLaps",
    type: "number",
    example: 2,
    description:
      "An athlete's total laps for a round. ( Applicable for Nitrocross & Supercross only )",
  })
  athleteTotalLaps: number | null;

  @ApiProperty({
    name: "roundScore",
    type: "number",
    example: 66,
    description:
      "An athlete's score for the round, equal to the sum of the highest three scores out of one Run and four to six individual tricks, all judged out of a maximum of 10 points for a maximum round score of 30 points. ( Applicable for SLS only )",
  })
  roundScore: number | null;

  @ApiProperty({
    name: "lineScore1",
    type: "number",
    example: 66,
    description:
      "A segment of an athlete's roundScore in Street League Skateboarding that applies to their Run - a series of tricks performed during a timed session, judged out of a maximum of 10 points. ( Applicable for SLS only )",
  })
  lineScore1: number | null;

  @ApiProperty({
    name: "lineScore2",
    type: "number",
    example: 66,
    description:
      "A segment of an athlete's roundScore in Street League Skateboarding that applies to their Run - a series of tricks performed during a timed session, judged out of a maximum of 10 points. ( Applicable for SLS only )",
  })
  lineScore2: number | null;

  @ApiProperty({
    name: "trick1Score",
    type: "number",
    format: "decimal",
    example: 10.3,
    required: true,
    description:
      "A segment of an athlete's roundScore in Street League Skateboarding that applies to one of their multiple,  individual tricks. In the Qualifying Round, each athlete has four individual tricks to attempt. In the Final, each athlete has four individual tricks to attempt and after each athlete attempts all four individual tricks, the athletes with the top four round scores each earn an additional two trick attempts for a total of six trick attempts in the Final. Tricks are each judged out of a maximum of 10 points and may contribute to the athlete's roundScore.",
  })
  trick1Score: number | null;

  @ApiProperty({
    name: "trick2Score",
    type: "number",
    format: "decimal",
    example: 10.3,
    required: true,
    description:
      "A segment of an athlete's roundScore in Street League Skateboarding that applies to one of their multiple,  individual tricks. In the Qualifying Round, each athlete has four individual tricks to attempt. In the Final, each athlete has four individual tricks to attempt and after each athlete attempts all four individual tricks, the athletes with the top four round scores each earn an additional two trick attempts for a total of six trick attempts in the Final. Tricks are each judged out of a maximum of 10 points and may contribute to the athlete's roundScore.",
  })
  trick2Score: number | null;

  @ApiProperty({
    name: "trick3Score",
    format: "decimal",
    type: "number",
    example: 10.3,
    required: true,
    description:
      "A segment of an athlete's roundScore in Street League Skateboarding that applies to one of their multiple,  individual tricks. In the Qualifying Round, each athlete has four individual tricks to attempt. In the Final, each athlete has four individual tricks to attempt and after each athlete attempts all four individual tricks, the athletes with the top four round scores each earn an additional two trick attempts for a total of six trick attempts in the Final. Tricks are each judged out of a maximum of 10 points and may contribute to the athlete's roundScore.",
  })
  trick3Score: number | null;

  @ApiProperty({
    name: "trick4Score",
    format: "decimal",
    type: "number",
    example: 10.3,
    required: true,
    description:
      "A segment of an athlete's roundScore in Street League Skateboarding that applies to one of their multiple,  individual tricks. In the Qualifying Round, each athlete has four individual tricks to attempt. In the Final, each athlete has four individual tricks to attempt and after each athlete attempts all four individual tricks, the athletes with the top four round scores each earn an additional two trick attempts for a total of six trick attempts in the Final. Tricks are each judged out of a maximum of 10 points and may contribute to the athlete's roundScore.",
  })
  trick4Score: number | null;

  @ApiProperty({
    name: "trick5Score",
    format: "decimal",
    type: "number",
    example: 10.3,
    required: true,
    description:
      "A segment of an athlete's roundScore in Street League Skateboarding that applies to one of their multiple,  individual tricks. In the Qualifying Round, each athlete has four individual tricks to attempt. In the Final, each athlete has four individual tricks to attempt and after each athlete attempts all four individual tricks, the athletes with the top four round scores each earn an additional two trick attempts for a total of six trick attempts in the Final. Tricks are each judged out of a maximum of 10 points and may contribute to the athlete's roundScore.",
  })
  trick5Score: number | null;

  @ApiProperty({
    name: "trick6Score",
    format: "decimal",
    type: "number",
    example: 10.3,
    required: true,
    description:
      "A segment of an athlete's roundScore in Street League Skateboarding that applies to one of their multiple,  individual tricks. In the Qualifying Round, each athlete has four individual tricks to attempt. In the Final, each athlete has four individual tricks to attempt and after each athlete attempts all four individual tricks, the athletes with the top four round scores each earn an additional two trick attempts for a total of six trick attempts in the Final. Tricks are each judged out of a maximum of 10 points and may contribute to the athlete's roundScore.",
  })
  trick6Score: number | null;

  @ApiProperty({ type: AthleteResponse })
  athlete: AthleteResponse;
}

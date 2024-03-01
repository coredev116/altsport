import { ApiProperty } from "@nestjs/swagger";
import {
  IsArray,
  ValidateNested,
  IsOptional,
  IsDate,
  IsUUID,
  IsNotEmpty,
  IsNumber,
  Min,
} from "class-validator";
import { Type } from "class-transformer";

class TraderPeriodTimesDto {
  @ApiProperty({
    name: "roundId",
    type: "string",
    required: true,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  @IsUUID()
  @IsNotEmpty()
  roundId: string;

  @Type(() => Date)
  @ApiProperty({
    name: "startDate",
    type: "string",
    format: "date",
    example: "2022-04-18T15:25:24Z",
    required: true,
  })
  @IsDate()
  @IsOptional()
  startDate: Date;

  @Type(() => Date)
  @ApiProperty({
    name: "endDate",
    type: "string",
    format: "date",
    example: "2022-04-18T15:25:24Z",
    required: true,
  })
  @IsDate()
  @IsOptional()
  endDate: Date;
}

class TraderTeamGoalsDto {
  @ApiProperty({
    name: "id",
    type: "string",
    required: true,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  @IsUUID()
  @IsOptional()
  id: string;

  @ApiProperty({
    name: "teamId",
    type: "string",
    required: true,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  @IsUUID()
  @IsNotEmpty()
  teamId: string;

  @ApiProperty({
    name: "roundId",
    type: "string",
    required: true,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  @IsUUID()
  @IsNotEmpty()
  roundId: string;

  @ApiProperty({ type: "number", example: 1, required: true })
  @IsNumber()
  @Min(0)
  goals: number;
}

export default class TraderScoresDto {
  @ApiProperty({
    name: "eventId",
    type: "string",
    required: true,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  @IsUUID()
  @IsNotEmpty()
  eventId: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => TraderPeriodTimesDto)
  @ApiProperty({ name: "roundTimes", type: TraderPeriodTimesDto, required: false, isArray: true })
  roundTimes: TraderPeriodTimesDto[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => TraderTeamGoalsDto)
  @ApiProperty({ name: "goals", type: TraderTeamGoalsDto, required: false, isArray: true })
  goals: TraderTeamGoalsDto[];
}

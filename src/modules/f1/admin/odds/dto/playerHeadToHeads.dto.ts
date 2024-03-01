import { ApiProperty } from "@nestjs/swagger";
import {
  IsUUID,
  IsInt,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsArray,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class createPlayerHeadToHeadsDto {
  @ApiProperty({
    name: "eventParticipant1Id",
    type: "string",
    required: true,
    example: "6c646203-455b-4740-8a6d-69f9fc7cc828",
  })
  @IsUUID()
  eventParticipant1Id: string;

  @ApiProperty({
    name: "eventParticipant2Id",
    type: "string",
    required: true,
    example: "7f9883e1-0981-4a48-bf0d-7660e0f2be8b",
  })
  @IsUUID()
  eventParticipant2Id: string;
}

class UpdatePlayerHeadToHeadsItem {
  @ApiProperty({
    name: "id",
    type: "string",
    required: false,
    example: "6e67b1c5-8ec3-4845-b8da-85411fd7e133",
  })
  @IsUUID()
  id: string;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  player1Position: number;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  player2Position: number;

  @ApiProperty({
    name: "player1TrueProbability",
    type: "number",
    example: 30.5,
  })
  @IsOptional()
  @IsNumber()
  player1TrueProbability: number;

  @ApiProperty({
    name: "player2TrueProbability",
    type: "number",
    example: 30.5,
  })
  @IsOptional()
  @IsNumber()
  player2TrueProbability: number;

  @ApiProperty({
    name: "player1HasModifiedProbability",
    type: "boolean",
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  player1HasModifiedProbability: boolean;

  @ApiProperty({
    name: "player2HasModifiedProbability",
    type: "boolean",
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  player2HasModifiedProbability: boolean;

  @ApiProperty({
    name: "player1Probability",
    type: "number",
    example: 30.5,
  })
  @IsOptional()
  @IsNumber()
  player1Probability: number;

  @ApiProperty({
    name: "player2Probability",
    type: "number",
    example: 30.5,
  })
  @IsOptional()
  @IsNumber()
  player2Probability: number;

  @ApiProperty({
    name: "player1Odds",
    type: "number",
    example: 30.5,
  })
  @IsOptional()
  @IsNumber()
  player1Odds: number;

  @ApiProperty({
    name: "player2Odds",
    type: "number",
    example: 30.5,
  })
  @IsOptional()
  @IsNumber()
  player2Odds: number;

  @ApiProperty({
    name: "holdingPercentage",
    type: "number",
    example: 30.5,
    default: 100,
  })
  @IsOptional()
  @IsNumber()
  holdingPercentage: number;
}

export class updatePlayerHeadToHeadsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdatePlayerHeadToHeadsItem)
  @ApiProperty({
    name: "items",
    type: UpdatePlayerHeadToHeadsItem,
    required: true,
    isArray: true,
  })
  items: UpdatePlayerHeadToHeadsItem[];
}

export class UpdatePlayerHeadToHeadsPayoutItem {
  @ApiProperty({
    name: "id",
    type: "string",
    required: false,
    example: "6e67b1c5-8ec3-4845-b8da-85411fd7e133",
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    name: "voided",
    type: "boolean",
    required: false,
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  voided: boolean;

  @ApiProperty({
    name: "draw",
    type: "boolean",
    required: false,
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  draw: boolean;

  @ApiProperty({
    name: "eventParticipantWinnerId",
    type: "string",
    required: false,
    example: "6c646203-455b-4740-8a6d-69f9fc7cc828",
  })
  @IsUUID()
  @IsOptional()
  eventParticipantWinnerId: string;
}

export class updatePlayerHeadToHeadsPayoutDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdatePlayerHeadToHeadsPayoutItem)
  @ApiProperty({
    name: "items",
    type: UpdatePlayerHeadToHeadsPayoutItem,
    required: true,
    isArray: true,
  })
  items: UpdatePlayerHeadToHeadsPayoutItem[];
}

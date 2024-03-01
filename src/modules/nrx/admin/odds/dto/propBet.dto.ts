import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type, TransformFnParams } from "class-transformer";
import {
  IsString,
  IsUUID,
  IsOptional,
  IsNotEmpty,
  IsNumber,
  ValidateNested,
  IsArray,
  IsBoolean,
} from "class-validator";

export class createPropBetDto {
  @ApiProperty({
    name: "eventParticipantId",
    type: "string",
    required: true,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  @IsUUID()
  @IsOptional()
  eventParticipantId: string;

  @ApiProperty({ name: "proposition", type: "string", required: true, example: "Test" })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsString()
  @IsNotEmpty()
  proposition: string;

  @ApiProperty({ name: "odds", type: "number", example: 10.3, required: false, default: 0 })
  @Transform(({ value }: TransformFnParams) => +value)
  @IsNumber()
  odds: number;
}

export class UpdatePropBetItem {
  @ApiProperty({
    name: "id",
    type: "string",
    required: true,
    example: "8d24-8d24-49d2-57ec650a4e0e-a9d8",
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    name: "eventParticipantId",
    type: "string",
    required: true,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  @IsOptional()
  @IsUUID()
  eventParticipantId: string;

  @ApiProperty({ name: "proposition", type: "string", required: true, example: "Test" })
  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsOptional()
  @IsString()
  proposition: string;

  @ApiProperty({ name: "odds", type: "number", example: 10.3, required: false, default: 0 })
  @IsNumber()
  @IsOptional()
  odds: number;
}

export class updatePropBetDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdatePropBetItem)
  @ApiProperty({ name: "items", type: UpdatePropBetItem, required: true, isArray: true })
  items: UpdatePropBetItem[];
}

class UpdatePropBetPayoutItem {
  @ApiProperty({
    name: "id",
    type: "string",
    required: true,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  @IsUUID()
  id: string;

  @ApiProperty({ name: "payout", type: "boolean", example: true, required: false })
  @IsBoolean()
  @IsOptional()
  payout: boolean;

  @ApiProperty({
    name: "voided",
    type: "boolean",
    required: false,
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  voided: boolean;
}

export class updatePropBetPayoutDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdatePropBetPayoutItem)
  @ApiProperty({ name: "items", type: UpdatePropBetPayoutItem, required: true, isArray: true })
  items: UpdatePropBetPayoutItem[];
}

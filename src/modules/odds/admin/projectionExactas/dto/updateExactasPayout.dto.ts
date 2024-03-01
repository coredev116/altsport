import { ApiProperty } from "@nestjs/swagger";
import { IsUUID, IsOptional, IsBoolean, IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class UpdateExactasPayoutItem {
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
}

export class UpdateExactasPayoutDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateExactasPayoutItem)
  @ApiProperty({
    name: "items",
    type: UpdateExactasPayoutItem,
    required: true,
    isArray: true,
  })
  items: UpdateExactasPayoutItem[];
}

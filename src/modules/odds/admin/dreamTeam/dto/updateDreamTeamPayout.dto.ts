import { ApiProperty } from "@nestjs/swagger";
import { IsUUID, IsOptional, IsBoolean, IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";

export class UpdateDreamTeamPayoutItem {
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

export class UpdateDreamTeamPayoutDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateDreamTeamPayoutItem)
  @ApiProperty({
    name: "items",
    type: UpdateDreamTeamPayoutItem,
    required: true,
    isArray: true,
  })
  items: UpdateDreamTeamPayoutItem[];
}

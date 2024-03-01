import { ApiProperty } from "@nestjs/swagger";
import {
  IsUUID,
  IsNotEmpty,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsNumber,
  Min,
} from "class-validator";
import { Type } from "class-transformer";

export class UpdateDreamTeamItem {
  @ApiProperty({
    name: "id",
    type: "string",
    required: true,
    example: "636d414b-8d24-49d2-a9d8-57ec650a4e0e",
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    name: "probability",
    type: "decimal",
    example: 0.6,
  })
  @IsNumber()
  @Min(0)
  probability: number;

  @ApiProperty({
    name: "hasModifiedProbability",
    example: true,
    type: "boolean",
  })
  @IsBoolean()
  hasModifiedProbability: boolean;

  @ApiProperty({
    name: "odds",
    type: "decimal",
    example: 1.344,
  })
  @IsNumber()
  @Min(0)
  odds: number;
}

export class UpdateDreamTeamDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateDreamTeamItem)
  @ApiProperty({
    name: "teams",
    type: UpdateDreamTeamItem,
    required: true,
    isArray: true,
  })
  teams: UpdateDreamTeamItem[];
}

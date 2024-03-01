import { Transform, TransformFnParams, Expose } from "class-transformer";
import { IsString, IsNotEmpty, IsNumber, IsEnum, IsOptional } from "class-validator";

import { NRXEventCategoryType } from "../../../../constants/system";

export default class BracketRoundScoreDto {
  @Expose({
    name: "Result_Name",
  })
  @Transform(({ value }: TransformFnParams) => value?.replace(/\s+/g, " ").trim())
  @IsString()
  @IsNotEmpty()
  resultName: string;

  @Expose({
    name: "POS1_Entry_ID",
  })
  @IsNumber()
  @IsOptional()
  athlete1EntryId: number;

  @Expose({
    name: "POS2_Entry_ID",
  })
  @IsNumber()
  @IsOptional()
  athlete2EntryId: number;

  @Expose({
    name: "RUN_ID",
  })
  @IsNumber()
  @IsNotEmpty()
  runId: number;

  @Expose({
    name: "Round_Name",
  })
  @Transform(({ value }: TransformFnParams) => value?.replace(/\s+/g, " ").trim())
  @IsString()
  @IsNotEmpty()
  roundName: string;

  @Expose({
    name: "RoundNumber",
  })
  @IsNumber()
  @IsNotEmpty()
  roundOrder: number;

  @Expose({
    name: "Category_Name",
  })
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.replace(/\s+/g, " ").trim())
  @IsEnum(NRXEventCategoryType)
  @IsString()
  categoryName: NRXEventCategoryType;
}

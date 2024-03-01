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
    name: "RUN_ID",
  })
  @IsNumber()
  @IsNotEmpty()
  runId: number;

  @Expose({
    name: "Category_Name",
  })
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.replace(/\s+/g, " ").trim())
  @IsEnum(NRXEventCategoryType)
  @IsString()
  categoryName: NRXEventCategoryType;

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
    name: "POS3_Entry_ID",
  })
  @IsNumber()
  @IsOptional()
  athlete3EntryId: number;

  @Expose({
    name: "POS4_Entry_ID",
  })
  @IsNumber()
  @IsOptional()
  athlete4EntryId: number;

  @Expose({
    name: "POS5_Entry_ID",
  })
  @IsNumber()
  @IsOptional()
  athlete5EntryId: number;

  @Expose({
    name: "POS6_Entry_ID",
  })
  @IsNumber()
  @IsOptional()
  athlete6EntryId: number;

  @Expose({
    name: "POS7_Entry_ID",
  })
  @IsNumber()
  @IsOptional()
  athlete7EntryId: number;

  @Expose({
    name: "POS8_Entry_ID",
  })
  @IsNumber()
  @IsOptional()
  athlete8EntryId: number;

  @Expose({
    name: "POS9_Entry_ID",
  })
  @IsNumber()
  @IsOptional()
  athlete9EntryId: number;

  @Expose({
    name: "POS10_Entry_ID",
  })
  @IsNumber()
  @IsOptional()
  athlete10EntryId: number;
}

import { Transform, TransformFnParams, Expose } from "class-transformer";
import { IsString, IsNotEmpty, IsNumber, IsEnum } from "class-validator";

import { NRXEventCategoryType } from "../../../../constants/system";

export default class EventParticipantsDto {
  @Expose({
    name: "Entry_ID",
  })
  @IsNotEmpty()
  @IsNumber()
  entryId: number;

  @Expose({
    name: "Startnumber",
  })
  @Transform(({ value }: TransformFnParams) => value?.replace(/\s+/g, " ").trim())
  @IsNotEmpty()
  @IsString()
  startNumber: string;

  @Expose({
    name: "Entrant_Name",
  })
  @Transform(({ value }: TransformFnParams) => value?.replace(/\s+/g, " ").trim())
  @IsNotEmpty()
  @IsString()
  entrantName: string;

  @Expose({
    name: "Entrant_Nationality_Short",
  })
  @Transform(({ value }: TransformFnParams) => value?.replace(/\s+/g, " ").trim())
  @IsNotEmpty()
  @IsString()
  nationality: string;

  @Expose({
    name: "Category_Name",
  })
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.replace(/\s+/g, " ").trim())
  @IsEnum(NRXEventCategoryType)
  @IsString()
  categoryName: NRXEventCategoryType;
}

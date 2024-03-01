import { Type, Transform, TransformFnParams, Expose } from "class-transformer";
import {
  IsNumber,
  IsString,
  IsNotEmpty,
  IsDate,
  IsEnum,
  ValidateIf,
  IsOptional,
} from "class-validator";

import { NRXEventCategoryType, NRXEventStatus } from "../../../../constants/system";

export default class EventItem {
  @Expose({
    name: "Category_Name",
  })
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.replace(/\s+/g, " ").trim())
  // @IsEnum(NRXEventCategoryType)
  @IsString()
  categoryName: NRXEventCategoryType;

  @Expose({
    name: "Scheduled",
  })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  scheduled: Date;

  @Expose({
    name: "status",
  })
  @Transform(({ value }: TransformFnParams) => {
    if (value === NRXEventStatus.CANCELLED) return NRXEventStatus.FINISHED;

    return value?.replace(/\s+/g, " ").trim();
  })
  @IsEnum(NRXEventStatus)
  @IsString()
  @IsNotEmpty()
  @ValidateIf((value) => !value.statusName)
  status: NRXEventStatus;

  @Expose({
    name: "runId",
  })
  @IsNotEmpty()
  @IsNumber()
  runId: number;

  @Expose({
    name: "Display_Name",
  })
  @IsNotEmpty()
  @Transform(({ value }: TransformFnParams) => value?.replace(/\s+/g, " ").trim())
  @IsString()
  displayName: string;
}

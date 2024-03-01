import { IsUUID, IsEnum } from "class-validator";
import { Type } from "class-transformer";
import { SportsTypes, ExactasType } from "../../../../../constants/system";

export class EventIdParamDto {
  @IsUUID("4")
  eventId: string;
}

export class SportsTypeEventParamDto {
  @IsEnum(SportsTypes)
  sportsType: SportsTypes;

  @IsUUID("4")
  eventId: string;
}

export class SportsTypeEventRoundParamDto {
  @IsEnum(SportsTypes)
  sportsType: SportsTypes;

  @IsUUID("4")
  eventId: string;

  @IsUUID("4")
  roundId: string;

  @Type(() => Number)
  @IsEnum(ExactasType)
  exactasType: ExactasType;
}

export class SportsTypeExactasTypeParamDto {
  @IsEnum(SportsTypes)
  sportsType: SportsTypes;

  @IsUUID("4")
  eventId: string;

  @Type(() => Number)
  @IsEnum(ExactasType)
  exactasType: ExactasType;
}

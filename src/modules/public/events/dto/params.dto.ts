import { IsString, IsEnum, IsOptional } from "class-validator";
import { Type } from "class-transformer";
import { PublicOddTypes } from "../../../../constants/odds";
import { ValidPublicEventId } from "./validPublicEventId";
import { ExactasType } from "../../../../constants/system";

export class EventIdParamDto {
  @ValidPublicEventId()
  eventId: string;
}

export class FetchHeatScoreParams {
  @ValidPublicEventId()
  eventId: string;

  @IsString()
  heatId: string;
}

export class FetchOddsParams {
  @ValidPublicEventId()
  eventId: string;

  @IsEnum(PublicOddTypes)
  @IsString()
  oddType: string;
}

export class ExactasTypeDto {
  @IsOptional()
  @Type(() => Number)
  @IsEnum(ExactasType)
  exactasType: ExactasType;
}

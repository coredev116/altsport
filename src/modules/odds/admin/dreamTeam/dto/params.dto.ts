import { IsUUID, IsEnum, IsOptional } from "class-validator";

import { SportsTypes } from "../../../../../constants/system";

export class EventIdParamDto {
  @IsUUID("4")
  eventId: string;
}

export class HeatIdParamDto {
  @IsUUID("4")
  heatId: string;
}

export class SportsTypeEventParamDto {
  @IsEnum(SportsTypes)
  sportsType: SportsTypes;

  @IsUUID("4")
  eventId: string;

  @IsUUID("4")
  @IsOptional()
  dreamTeamId: string;
}

export class SportsTypeEventIdParamDto {
  @IsEnum(SportsTypes)
  sportsType: SportsTypes;

  @IsUUID("4")
  eventId: string;
}

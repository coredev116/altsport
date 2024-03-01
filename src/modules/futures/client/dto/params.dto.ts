import { IsUUID, IsEnum } from "class-validator";
import { SportsTypes, FutureMarkets } from "../../../../constants/system";

export class SportsTypeTourYearIdParamDto {
  @IsEnum(SportsTypes)
  sportsType: SportsTypes;

  @IsUUID("4")
  tourYearId: string;
}

export class SportsTypeTourYearIdTypeParamDto {
  @IsEnum(SportsTypes)
  sportsType: SportsTypes;

  @IsUUID("4")
  tourYearId: string;

  @IsEnum(FutureMarkets)
  futureType: FutureMarkets;
}

export class SportsTypeFutureIdTypeParamDto {
  @IsEnum(SportsTypes)
  sportsType: SportsTypes;

  @IsUUID("4")
  futureId: string;

  @IsEnum(FutureMarkets)
  futureType: FutureMarkets;
}

import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsEnum, ValidateIf } from "class-validator";

import { SportsTypes, OddMarkets, FutureMarkets } from "../../../../constants/system";

export class ClientMarketDownloadLogDto {
  @ApiProperty({ name: "marketType", type: "string", example: OddMarkets.EVENT_WINNER_PROJECTIONS })
  @IsNotEmpty()
  @IsEnum(OddMarkets)
  @ValidateIf((value) => !value.futureType || value.marketType)
  marketType: OddMarkets;

  @ApiProperty({ name: "futureType", type: "string", example: FutureMarkets.WINNER })
  @IsNotEmpty()
  @IsEnum(FutureMarkets)
  @ValidateIf((value) => !value.marketType || value.futureType)
  futureType: FutureMarkets;

  @ApiProperty({ name: "sportType", type: "string", example: SportsTypes.RALLYCROSS })
  @IsNotEmpty()
  @IsEnum(SportsTypes)
  sportType: SportsTypes;
}

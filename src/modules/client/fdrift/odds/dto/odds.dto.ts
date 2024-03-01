import { IsNotEmpty, IsInt, Min, Max, IsOptional, IsEnum, IsString } from "class-validator";
import { Type } from "class-transformer";

import { API_SORT_ORDER } from "../../../../../constants/system";
import { FDRIFTPublicStatsSortColumns } from "../../../../../constants/fdrift";

export class EventOddsDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(3)
  @IsNotEmpty()
  position: number;
}

export class PlayerHeadToHeadListing {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  public page: number = 1;

  @IsOptional()
  @IsEnum(FDRIFTPublicStatsSortColumns)
  @IsString()
  public sortColumn: FDRIFTPublicStatsSortColumns = FDRIFTPublicStatsSortColumns.player1Odds;

  @IsOptional()
  @IsEnum(API_SORT_ORDER)
  @IsString()
  public sortOrder: API_SORT_ORDER = API_SORT_ORDER.DESC;

  @IsOptional()
  @IsString()
  public query: string;
}

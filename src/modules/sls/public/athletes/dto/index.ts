import {
  IsUUID,
  IsOptional,
  IsString,
  IsInt,
  Min,
  Max,
  IsArray,
  IsNotEmpty,
  IsEnum,
} from "class-validator";
import { Type } from "class-transformer";

import { API_SORT_ORDER } from "../../../../../constants/system";
import { SLSPublicStatsSortColumns } from "../../../../../constants/sls";

export class YearItemDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  public year: number;
}

export class LeagueIdItemDto {
  @IsOptional()
  @IsUUID()
  public leagueId: string;
}

export class EventNameItemDto {
  @IsOptional()
  @IsString()
  public eventName: string;
}

export class EventLocationItemDto {
  @IsOptional()
  @IsString()
  public eventLocation: string;
}

export class AthleteListing {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  public page: number = 1;

  @IsOptional()
  @IsEnum(SLSPublicStatsSortColumns)
  @IsString()
  public sortColumn: SLSPublicStatsSortColumns = SLSPublicStatsSortColumns.ROUND_SCORE;

  @IsOptional()
  @IsEnum(API_SORT_ORDER)
  @IsString()
  public sortOrder: API_SORT_ORDER = API_SORT_ORDER.DESC;

  @IsOptional()
  @IsArray()
  @IsNotEmpty({ each: true })
  @Type(() => LeagueIdItemDto)
  public leagueIds: LeagueIdItemDto[];

  @IsOptional()
  @IsArray()
  @IsNotEmpty({ each: true })
  @Type(() => EventNameItemDto)
  public eventNames: EventNameItemDto[];

  @IsOptional()
  @IsArray()
  @IsNotEmpty({ each: true })
  @Type(() => YearItemDto)
  public years: YearItemDto[];

  @IsOptional()
  @IsArray()
  @IsNotEmpty({ each: true })
  @Type(() => EventLocationItemDto)
  public eventLocations: EventLocationItemDto[];

  @IsOptional()
  @IsString()
  public query: string;
}

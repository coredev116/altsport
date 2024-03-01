import { Type } from "class-transformer";
import { IsInt, IsEnum, IsOptional, IsString, IsUUID, Max, Min, IsArray } from "class-validator";
import { EventStatus } from "../../../../../constants/system";

export class EventListing {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  public limit: number = 10;

  @IsOptional()
  @IsUUID()
  public startingAfter: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  public year: number;

  @IsOptional()
  @IsArray()
  @IsEnum(EventStatus, { each: true })
  eventStatuses: string[];

  @IsOptional()
  @IsUUID()
  public tourId: string;

  @IsOptional()
  @IsString()
  public eventLocation: string;

  @IsOptional()
  @IsString()
  public query: string;
}

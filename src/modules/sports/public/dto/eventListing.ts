import { Type } from "class-transformer";
import { IsEnum, IsOptional, Min, Max, IsInt, IsUUID, IsArray } from "class-validator";
import { EventStatus } from "../../../../constants/system";

export class EventListing {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  public limit: number = 100;

  @IsOptional()
  @IsUUID()
  public startingAfter: string;

  @IsOptional()
  @IsArray()
  @IsEnum(EventStatus, { each: true })
  eventStatuses: string[] = ["UPCOMING"];
}

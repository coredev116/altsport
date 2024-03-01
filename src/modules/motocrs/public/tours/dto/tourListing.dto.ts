import { IsOptional, IsInt } from "class-validator";
import { Type } from "class-transformer";

export class TourListing {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  public year: number;
}

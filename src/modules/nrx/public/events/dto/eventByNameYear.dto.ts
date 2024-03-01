import { Type } from "class-transformer";
import { IsInt, IsString, IsOptional } from "class-validator";

export class EventByNameYearDto {
  @IsString()
  public eventName: string;

  @Type(() => Number)
  @IsInt()
  public year: number;

  @IsOptional()
  @IsString()
  public categoryName: string;
}

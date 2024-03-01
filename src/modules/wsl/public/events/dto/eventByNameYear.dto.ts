import { Type } from "class-transformer";
import { IsInt, IsString } from "class-validator";

export class EventByNameYearDto {
  @IsString()
  public eventName: string;

  @Type(() => Number)
  @IsInt()
  public year: number;
}

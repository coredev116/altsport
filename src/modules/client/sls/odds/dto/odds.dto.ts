import { IsNotEmpty, IsInt, Min, Max } from "class-validator";
import { Type } from "class-transformer";

export class EventOddsDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(3)
  @IsNotEmpty()
  position: number;
}

import { IsOptional, IsInt, Min, Max } from "class-validator";
import { Type } from "class-transformer";

export default class EventResetQuery {
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(1)
  @IsOptional()
  baseReset: number;
}

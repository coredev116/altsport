import { IsOptional, IsInt, Min, Max } from "class-validator";
import { Type } from "class-transformer";

export default class EventParticipantsQuery {
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(1)
  @IsOptional()
  archived: number;
}

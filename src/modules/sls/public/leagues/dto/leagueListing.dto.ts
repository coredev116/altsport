import { IsOptional, IsInt } from "class-validator";
import { Type } from "class-transformer";

export class LeagueListing {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  public year: number;
}

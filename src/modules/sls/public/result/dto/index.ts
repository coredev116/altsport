import { IsUUID, IsOptional, IsInt, Min, Max } from "class-validator";
import { Type } from "class-transformer";

export class ResultListing {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(500)
  public limit: number = 10;

  @IsOptional()
  @IsUUID()
  public startingAfter: string;

  @IsOptional()
  @IsUUID("4")
  public eventId: string;
}

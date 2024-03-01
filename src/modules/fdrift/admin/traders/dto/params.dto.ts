import { IsNumber, IsUUID } from "class-validator";
import { Transform, TransformFnParams } from "class-transformer";

export class EventIdParamDto {
  @IsUUID("4")
  eventId: string;
}

export class HeatIdParamDto {
  @IsUUID("4")
  heatId: string;
}

export class FetchEventHeatsParams {
  @IsUUID("4")
  eventId: string;

  @IsUUID("4")
  roundId: string;
}

export class SeedDto {
  @IsNumber()
  @Transform(({ value }: TransformFnParams) => +value)
  externalEventId: number;
}

import { IsUUID } from "class-validator";

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

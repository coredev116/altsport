import { IsUUID } from "class-validator";

export class EventIdParamDto {
  @IsUUID("4")
  eventId: string;
}

export class UpdateHeatVoidedParams {
  @IsUUID("4")
  eventId: string;

  @IsUUID("4")
  heatId: string;
}

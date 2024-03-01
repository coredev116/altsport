import { IsUUID } from "class-validator";

export class EventIdParamDto {
  @IsUUID("4")
  eventId: string;
}

export class EventIdRoundIdParamDto {
  @IsUUID("4")
  eventId: string;

  @IsUUID("4")
  roundId: string;
}

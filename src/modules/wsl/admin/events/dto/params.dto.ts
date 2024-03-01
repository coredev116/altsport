import { IsUUID } from "class-validator";

export class EventIdParamDto {
  @IsUUID("4")
  eventId: string;
}

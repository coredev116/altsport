import { IsUUID } from "class-validator";

export class EventParticipantListing {
  @IsUUID()
  public eventId: string;
}

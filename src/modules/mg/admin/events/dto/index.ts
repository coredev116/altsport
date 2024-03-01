import { IsArray, IsNotEmpty, IsOptional } from "class-validator";
import { EventStatus } from "../../../../../constants/system";

export class EventListing {
  @IsOptional()
  @IsArray()
  @IsNotEmpty({ each: true })
  public eventStatus: EventStatus[] = [EventStatus.LIVE, EventStatus.UPCOMING, EventStatus.NEXT];
}

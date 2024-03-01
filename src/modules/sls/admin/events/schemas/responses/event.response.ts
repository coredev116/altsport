import { ApiProperty } from "@nestjs/swagger";

import Round from "./round.response";

import EventsResponse from "./events.response";

export default class EventResponse extends EventsResponse {
  @ApiProperty({ type: Round, isArray: true })
  rounds: Round[];
}

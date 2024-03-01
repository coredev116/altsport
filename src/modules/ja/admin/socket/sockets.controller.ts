import { Controller, Post, Body } from "@nestjs/common";
import { ApiResponse, ApiTags, ApiOperation, ApiBody } from "@nestjs/swagger";

import { SportsTypes } from "../../../../constants/system";

import SocketService from "./sockets.service";

import { JaiEventPayload } from "./dto";

@ApiTags("sockets")
@Controller({
  path: `admin/${SportsTypes.JA}/socket`,
})
export default class EventController {
  constructor(private readonly eventService: SocketService) {}

  @ApiBody({ type: JaiEventPayload })
  @ApiResponse({
    type: Boolean,
    status: 200,
  })
  @ApiOperation({
    summary: "Process Jai Alai Events",
    description: "Called by the proxy to process jai events",
  })
  @Post("process")
  async updateOdds(@Body() payload: JaiEventPayload): Promise<boolean> {
    const result = await this.eventService.processJaiEvent(payload.eventName, payload.data);

    return result;
  }
}

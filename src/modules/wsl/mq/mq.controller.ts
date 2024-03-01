import { Controller } from "@nestjs/common";
import { Ctx, MessagePattern, Payload, RmqContext } from "@nestjs/microservices";

@Controller()
export class MqController {
  @MessagePattern("hello") // Replace with the pattern you're listening to
  public async handleMessage(@Payload() data: any, @Ctx() context: RmqContext): Promise<void> {
    // Handle the incoming message
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    // Acknowledge the message if necessary
    channel.ack(originalMsg);
  }
}

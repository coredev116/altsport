import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

@Injectable()
export class MqService {
  constructor(@Inject("RABBITMQ_SERVICE") private readonly client: ClientProxy) {}

  async send(pattern: string, data: any): Promise<any> {
    return this.client.emit(pattern, data); // Use 'emit' for event-based messaging or 'send' for request-response patterns
  }
}

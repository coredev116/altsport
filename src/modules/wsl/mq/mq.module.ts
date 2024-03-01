import { Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";

@Module({
  imports: [
    // Setup the RabbitMQ client
    ClientsModule.register([
      {
        name: "RABBITMQ_SERVICE", // This is the token you'll use to inject the client
        transport: Transport.RMQ,
        options: {
          urls: [`amqp://guest:guest@localhost:5672`], // Replace with your RabbitMQ server URL
          queue: "hello", // Replace with your queue name
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    // ... other modules
  ],
})
export default class MqModule {}

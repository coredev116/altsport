import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { EventEmitterModule } from "@nestjs/event-emitter";
import { ServeStaticModule } from "@nestjs/serve-static";
import { TypeOrmModule } from "@nestjs/typeorm";
import path from "path";

// RabbitMQ
import { ClientsModule, Transport } from "@nestjs/microservices";

import AllExceptionsFilter from "./filters/AllExceptions.filter";
import NotFoundFilter from "./filters/NotFound.filter";

import ResponseTransformInterceptor from "./interceptors/Response.interceptor";
import { IDatabase } from "./interfaces/system";

import ValidationPipe from "./pipes/Validation.pipe";

import HealthModule from "./modules/system/health/health.module";
import HookshModule from "./modules/system/hooks/hooks.module";
import { validate as envValidate } from "./validations/env.validation";

import AppConfig from "./config/appConfig";
import envConfiguration from "./config/configuration";
import databaseConfiguration from "./config/database";

import AuthModule from "./modules/auth/auth.module";

import AdminManagementModule from "./modules/admin/admin.module";

import F1Module from "./modules/f1/f1.module";
import FDRIFTModule from "./modules/fdrift/fdrift.module";
import FuturesModule from "./modules/futures/futures.module";
import JAModule from "./modules/ja/ja.module";
import MASLModule from "./modules/masl/masl.module";
import MGModule from "./modules/mg/mg.module";
import MOTOCRSModule from "./modules/motocrs/motocrs.module";
import MXGPModule from "./modules/mxgp/mxgp.module";
import NRXModule from "./modules/nrx/nrx.module";
import AdminOddsModule from "./modules/odds/admin/admin.module";
import ClientOddsModule from "./modules/odds/client/client.module";
import PBRModule from "./modules/pbr/pbr.module";
import SportModule from "./modules/sports/sports.module";
import SPRModule from "./modules/spr/spr.module";
import WSLModule from "./modules/wsl/wsl.module";

import ClientModule from "./modules/client/client.module";
import PublicModule from "./modules/public/public.module";

import SLSModule from "./modules/sls/sls.module";
import QueueModule from "./modules/system/queue/queue.module";
import SyncModule from "./modules/system/sync/sync.module";
import AppService from "./services/app.service";
import SlackService from "./services/slack.service";
import SlackbotService from "./services/slackbot.service";

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true,
      cache: true,
      validate: envValidate,
      load: [envConfiguration],
    }),
    ClientsModule.register([
      {
        name: "RABBITMQ_SERVICE", // This is the token you'll use to inject the client
        transport: Transport.RMQ,
        options: {
          urls: [`amqp://localhost:5672`], // Replace with your RabbitMQ server URL
          queue: "your_queue_name", // Replace with your queue name
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const database: IDatabase = configService.get<IDatabase>("database", {
          infer: true,
        }) as IDatabase;
        const isProdCompiled: boolean = configService.get<boolean>("isProdCompiled", {
          infer: true,
        });
        const isDevelop = configService.get<boolean>("isDevelop");
        const isStaging = configService.get<boolean>("isStaging");
        const isRelease = configService.get<boolean>("isRelease");

        return {
          ...databaseConfiguration,
          // FIXME: temporarily enable all logging everywhere
          logging: isDevelop || isStaging || isRelease ? true : true,
          // logging: isDevelop || isStaging || isRelease ? ["error", "warn"] : true,
          type: "postgres",
          host: database.host,
          username: database.user,
          password: "postgres",
          database: "altsport",
          entities: [
            isProdCompiled
              ? path.resolve(`${__dirname}/entities/**/*.entity.js`)
              : path.resolve(`${__dirname}/entities/**/*.entity.ts`),
          ],
          migrations: [
            isProdCompiled
              ? path.resolve(`${__dirname}/migrations/*.js`)
              : path.resolve(`${__dirname}/migrations/*.ts`),
          ],
          port: database.port,
        };
      },
      inject: [ConfigService],
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, "docs"),
      renderPath: "client",
    }),
    HealthModule,
    HookshModule,
    WSLModule,
    NRXModule,
    SPRModule,
    MOTOCRSModule,
    FDRIFTModule,
    F1Module,
    MXGPModule,
    MGModule,
    MASLModule,
    JAModule,
    PBRModule,
    FuturesModule,
    SportModule,
    AuthModule,
    SLSModule,
    QueueModule,
    ClientModule,
    PublicModule,
    SyncModule,
    AdminManagementModule,
    AdminOddsModule,
    ClientOddsModule,
  ],
  controllers: [],
  providers: [
    AppConfig,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseTransformInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_FILTER,
      useClass: NotFoundFilter,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
    SlackService,
    SlackbotService,
    // QueueService,
    AppService,
  ],
})
export class AppModule {}

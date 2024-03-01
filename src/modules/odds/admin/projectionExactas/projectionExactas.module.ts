import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import ExactasController from "./projectionExactas.controller";
import { ExactasService } from "./projectionExactas.service";

import MOTOCRSClientProjectionExactas from "../../../../entities/motocrs/clientProjectionExactas.entity";
import MOTOCRSProjectionExactas from "../../../../entities/motocrs/projectionExactas.entity";
import MOTOCRSRounds from "../../../../entities/motocrs/rounds.entity";

import QueueModule from "../../../system/queue/queue.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([
      MOTOCRSProjectionExactas,
      MOTOCRSClientProjectionExactas,
      MOTOCRSRounds,
    ]),
    QueueModule,
  ],
  controllers: [ExactasController],
  providers: [ExactasService],
})
export default class ExactasModule {}

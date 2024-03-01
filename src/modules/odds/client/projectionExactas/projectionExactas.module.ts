import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "@nestjs/config";

import ExactasController from "./projectionExactas.controller";
import { ExactasService } from "./projectionExactas.service";

import MOTOCRSEvents from "../../../../entities/motocrs/events.entity";
import MOTOCRSRounds from "../../../../entities/motocrs/rounds.entity";

import MOTOCRSClientProjectionExactas from "../../../../entities/motocrs/projectionExactas.entity";
import MOTOCRSProjectionExactas from "../../../../entities/motocrs/clientProjectionExactas.entity";

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([
      MOTOCRSClientProjectionExactas,
      MOTOCRSProjectionExactas,
      MOTOCRSEvents,
      MOTOCRSRounds,
    ]),
  ],
  controllers: [ExactasController],
  providers: [ExactasService],
})
export default class ExactasModule {}

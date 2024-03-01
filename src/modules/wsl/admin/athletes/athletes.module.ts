import { Module } from "@nestjs/common";
import { CacheModule } from "@nestjs/cache-manager";

import CacheConfigService from "../../../../factory/cache.factory";
import AthleteService from "./athletes.service";
import AthleteController from "./athletes.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import Athletes from "../../../../entities/wsl/athletes.entity";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    CacheModule.registerAsync({
      useClass: CacheConfigService,
    }),
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([Athletes]),
  ],
  providers: [AthleteService],
  controllers: [AthleteController],
})
export default class AthleteModule {}

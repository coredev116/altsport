import { Module } from "@nestjs/common";
// import { TypeOrmModule } from "@nestjs/typeorm";

import JAAdminModule from "./admin/admin.module";
// import JASockets from "../../services/ja.service";

// import JAEvents from "../../entities/ja/events.entity";
// import JAEventsRounds from "../../entities/ja/eventRounds.entity";
// import JAOdds from "../../entities/ja/odds.entity";
// import JAScores from "../../entities/ja/scores.entity";

@Module({
  imports: [
    JAAdminModule,
    // TypeOrmModule.forFeature([JAEvents, JAEventsRounds, JAOdds, JAScores])
  ],
  providers: [
    // JASockets
  ],
  controllers: [],
})
export default class JAModule {}

import { Module } from "@nestjs/common";

import DreamTeamModule from "./dreamTeam/dreamTeam.module";
import ProjectionExactasModule from "./projectionExactas/projectionExactas.module";

@Module({
  imports: [DreamTeamModule, ProjectionExactasModule],
  providers: [],
  controllers: [],
})
export default class ClientOddsModule {}

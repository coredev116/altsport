import { Module } from "@nestjs/common";

import AdminToursModule from "./tours/admin.tours.module";
import AdminTradersModule from "./traders/admin.traders.module";

@Module({
  imports: [AdminToursModule, AdminTradersModule],
  controllers: [],
  providers: [],
})
export default class AdminManagementModule {}

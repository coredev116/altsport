import { DataSource, DataSourceOptions } from "typeorm";

import databaseConfig from "./database";

const config: DataSourceOptions = {
  ...databaseConfig,
  type: "postgres",
};

const dataSource = new DataSource(config);

export default dataSource;

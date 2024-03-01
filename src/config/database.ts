import path from "path";

import { NodeEnvironment } from "../constants/system";

const isProdCompiled: boolean = process.env.NODE_ENV === NodeEnvironment.Production;

export default {
  type: "postgres",
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: true,
  maxQueryExecutionTime: 10_000,
  connectTimeoutMS: 10_000,
  synchronize: false,
  // entities: [
  //   isProdCompiled
  //     ? path.resolve(`${__dirname}../../entities/*.js`)
  //     : path.resolve(`${__dirname}../../entities/*.ts`),
  // ],
  migrations: [
    isProdCompiled
      ? path.resolve(`${__dirname}../../migrations/*.js`)
      : path.resolve(`${__dirname}../../migrations/*.ts`),
  ],
  cli: {},
  ssl: isProdCompiled,
  extra: isProdCompiled
    ? {
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : null,
};

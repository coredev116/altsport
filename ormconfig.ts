import path from "path";

const baseConfig = {
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
  entities: [path.resolve(__dirname, "src/entities/*.ts")],
  migrations: [path.resolve(__dirname, "src/migrations/*.ts")],
  seeds: [`${__dirname}/src/seeds/**/*.ts`],
  factories: [`${__dirname}/src/seeds/seedFactories/**/*.ts`],
  cli: {
    migrationsDir: path.resolve(__dirname, "src/migrations/*.ts"),
    entitiesDir: path.resolve(__dirname, "src/entities/*.ts"),
  },
};

module.exports = baseConfig;

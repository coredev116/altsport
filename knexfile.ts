import path from "path";
import { Knex } from "knex";

const seedsDir = path.join(__dirname, "./src/seeds");

const config: Knex.Config = {
  client: "pg",
  pool: {
    min: 4,
    max: 15,
  },
  seeds: {
    directory: seedsDir,
  },
  useNullAsDefault: true,
  debug: true,
};

const knexConfig = {
  local: {
    ...config,
    connection: {
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
      ssl: true,
    },
  },
  development: {
    ...config,
    connection: {
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
      ssl: true,
    },
  },
  production: {
    ...config,
    connection: {
      database: process.env.DB_NAME,
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
      ssl: true,
    },
  },
};

export default knexConfig;
// module.exports = knexConfig;

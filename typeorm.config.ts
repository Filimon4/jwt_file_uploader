import { DataSource } from "typeorm";

import { config } from "dotenv";
config();

const DBDataSource = new DataSource({
  type: "mysql",
  host: String(process.env.DB_HOST),
  port: Number(process.env.DB_PORT),
  username: String(process.env.DB_USERNAME),
  password: String(process.env.DB_PASSWORD),
  database: String(process.env.DB_DATABASE),
  synchronize: false,
  logging: true,
  entities: ["src/**/*.entity.{ts,js}"],
  migrations: ["migrations/*.ts"],
  migrationsTableName: "migrations",
});
export default DBDataSource;

import { DataSource } from "typeorm";
import { User } from "../models/user/user.entity.js";
import { File } from "../models/file/file.entity.js";

import { config } from "dotenv";
config()

const DBDataSource = new DataSource({
  type: "mysql",
  host: String(process.env.DB_HOST),
  port: Number(process.env.DB_PORT),
  username: String(process.env.DB_USERNAME),
  password: String(process.env.DB_PASSWORD),
  database: String(process.env.DB_DATABASE),
  synchronize: false,
  logging: true,
  entities: [User, File],
  migrations: [],
  subscribers: [],
});
export default DBDataSource;

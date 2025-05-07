import DBDataSource from "../config/database.config.js";
import { DataSource, EntitySchema, ObjectLiteral, ObjectType } from "typeorm";

type Repo<Entity> = ObjectType<Entity> | EntitySchema<Entity> | string;

class DB {
  public static dataSource: DataSource;

  public static async connect(
    retryInterval = 5000,
    maxRetries = 10
  ): Promise<boolean> {
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        if (DB.dataSource?.isInitialized) {
          console.log("Database already initialized");
          return true;
        }

        DB.dataSource = await DBDataSource.initialize();

        if (DB.dataSource.isInitialized) {
          console.log("Database connected successfully");
          return true;
        }
      } catch (error) {
        attempt++;
        console.error(
          `db/index.ts: DB connect error (Attempt ${attempt}/${maxRetries}): ${error}`
        );

        if (attempt >= maxRetries) {
          console.error(
            "Max retries reached. Could not establish a database connection."
          );
          return false;
        }

        await new Promise((resolve) => setTimeout(resolve, retryInterval));
      }
    }
    return false;
  }

  public static getRepository<Entity extends ObjectLiteral>(target: Repo<Entity>) {
    return DB.dataSource.getRepository<Entity>(target);
  }
}

export default DB

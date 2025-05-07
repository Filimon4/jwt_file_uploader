import { UserPayload } from "../../utils/jwt/jwt.types.js";
import DB from "../index.js";
import { User } from "./user.entity.js";

class UserRepository {
  static async insertOneUser(entity: User) {
    const insertResult = await DB.getRepository(User).insert(entity);

    if (insertResult.identifiers.length == 0)
      throw new Error("Failed to create new user");

    entity.id = insertResult.identifiers[0].id;

    return entity;
  }

  static async create(data: Partial<User>) {
    return DB.getRepository(User).create(data);
  }

  static async findOne(id: string) {
    return DB.getRepository(User).findOneBy({
      id,
    });
  }

  static async update(id: string, data: Partial<User>) {
    await DB.getRepository(User).update(id, data);
    return this.findOne(id);
  }

  static async delete(id: string) {
    return DB.getRepository(User).delete(id);
  }

  static assertUser(data: unknown): asserts data is UserPayload {
    if (!data || typeof data !== "object")
      throw new Error("data is not a UserPayload");

    const propertyNames = Object.getOwnPropertyNames(data);

    if (!propertyNames.includes("id") || !propertyNames.includes("sessionId"))
      throw new Error("data is not a UserPayload");
  }
}

export default UserRepository;

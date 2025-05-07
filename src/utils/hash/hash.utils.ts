import * as bcryptjs from 'bcryptjs';

class Hash {
  static async hashPassword(password: string) {
    return bcryptjs.hash(password, 10);
  }

  static async comparePasswords(raw: string, hash: string) {
    return await bcryptjs.compare(raw, hash);
  }
}

export default Hash;

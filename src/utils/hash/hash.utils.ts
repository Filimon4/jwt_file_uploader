import * as bcrypt from 'bcrypt';

class Hash {
  static async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  static async comparePasswords(raw: string, hash: string) {
    return await bcrypt.compare(raw, hash);
  }
}

export default Hash;

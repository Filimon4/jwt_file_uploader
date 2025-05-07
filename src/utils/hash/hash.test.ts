import Hash from "./hash.utils";

describe('Hash', () => {
  const password = 'mySecretPassword123';

  it('хеширование пароля', async () => {
    const hash = await Hash.hashPassword(password);
    expect(typeof hash).toBe('string');
    expect(hash).not.toBe(password);
    expect(hash.length).toBeGreaterThan(0);
  });

  it('сравнение хэша паролей (положительный)', async () => {
    const hash = await Hash.hashPassword(password);
    const result = await Hash.comparePasswords(password, hash);
    expect(result).toBe(true);
  });

  it('сравнение хэша паролей (отрицательный)', async () => {
    const hash = await Hash.hashPassword(password);
    const result = await Hash.comparePasswords('wrongPassword', hash);
    expect(result).toBe(false);
  });
});
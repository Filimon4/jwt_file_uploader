import { TokenPayload } from "./jwt.types";
import JWT from "./jwt.utils";

describe('JWT Utility', () => {
  const payload: TokenPayload = {
    userId: '12345',
    role: 'user',
  };

  it('должен генерировать пару токенов', () => {
    const { accessToken, refreshToken } = JWT.generatePairTokens(payload);
    expect(typeof accessToken).toBe('string');
    expect(typeof refreshToken).toBe('string');
    expect(accessToken).not.toBe(refreshToken);
  });

  it('должен корректно декодировать access токен', () => {
    const token = JWT.generateAccessToken(payload);
    const decoded = JWT.verifyToken(token) as TokenPayload;
    expect(decoded.userId).toBe(payload.userId);
    expect(decoded.role).toBe(payload.role);
  });

  it('должен корректно декодировать refresh токен', () => {
    const token = JWT.generateRefreshToken(payload);
    const decoded = JWT.verifyToken(token) as TokenPayload;
    expect(decoded.userId).toBe(payload.userId);
    expect(decoded.role).toBe(payload.role);
  });

  it('должен выбросить ошибку при невалидном токене', () => {
    expect(() => JWT.verifyToken('invalid.token')).toThrow();
  });
});

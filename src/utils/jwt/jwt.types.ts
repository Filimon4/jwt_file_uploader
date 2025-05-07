export type TokenPayload = Record<string, string | number>;
export type UserPayload = { id: string; sessionId: string };
export interface PairJwtToken {
  accessToken: string;
  refreshToken: string;
}

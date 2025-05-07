export enum TokenStatus {
  revoked = 'revoked'
}

export const getUserSession = (id: string) => `user:session:${id}`;
export const getBlacklistToken = (id: string): string => `blacklist:${id}`;



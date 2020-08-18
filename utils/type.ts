export interface JwtDecodedInfo {
  username: string;
  nickname: string;
  iat: number;
  exp: number;
  sub: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginInput {
  username: string;
  password: string;
}

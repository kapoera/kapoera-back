export interface JwtDecodedInfo {
  mail: string;
  iat: number;
  exp: number;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginInput {
  username: string;
  password: string;
}

export interface SSOResult {
  result: string;
  k_uid: string;
  enc: string;
  success: string;
  user_id: string;
  state: string;
}

export interface SSOUserInfo {
  ku_std_no: string;
  uid: string;
  kaist_uid: string;
  mail: string;
  givenname: string;
  mobile: string;
  ku_kname: string;
  sn: string;
}

export interface SSODataMap {
  USER_INFO: SSOUserInfo;
  state: string;
  REDIRECT_URL: string;
}

export enum Winner {
  KAIST = 'KAIST',
  POSTECH = 'POSTECH'
}

export interface Record {
  score: [number, number];
  year: number;
  winner: Winner;
}

export interface GamesI {
  game_type: 'quiz' | 'ai' | 'lol' | 'kart' | 'hacking';
  dividend: number;
  starting_time: Date;
  records: Record[];
}


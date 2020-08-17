import jwt from 'jsonwebtoken';
import { secretObj } from '../config/secret';

export interface jwtdecodedinfo {
  username: string;
  nickname: string;
  iat: number;
  exp: number;
  sub: string;
}

export function createToken(username: string, nickname: string) {
  const token = new Promise((resolve, reject) => {
    jwt.sign(
      { username: username, nickname: nickname },
      secretObj.secret,
      { expiresIn: '15m', subject: 'userinfo', algorithm: 'HS256' },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    );
  });
  return token;
}

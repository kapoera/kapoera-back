import jwt from 'jsonwebtoken';
import { secretObj } from '../config/secret';
import { createAccessToken } from '../utils/jwt';
import { JwtDecodedInfo } from '../utils/type';

export function tokenVerify(token: string): Promise<JwtDecodedInfo> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretObj.secret, (err, decoded) => {
      if (err) return reject(err);
      else return resolve(<JwtDecodedInfo>decoded);
    });
  });
}

export function revokeToken(decoded: JwtDecodedInfo): Promise<string> {
  return new Promise((resolve, reject) => {
    createAccessToken(decoded.username)
      .then(token => {
        resolve(<string>token);
      })
      .catch(err => {
        reject(err);
      });
  });
}

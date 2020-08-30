import jwt from 'jsonwebtoken';
import { secretObj } from '../config/secret';
import { JwtDecodedInfo } from '../utils/type';

export function tokenVerify(token: string): Promise<JwtDecodedInfo> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretObj.secret, (err, decoded) => {
      if (err) return reject(err);
      else return resolve(<JwtDecodedInfo>decoded);
    });
  });
}

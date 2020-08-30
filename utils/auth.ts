import jwt from 'jsonwebtoken';
import { JwtDecodedInfo } from '../utils/type';

export function tokenVerify(token: string): Promise<JwtDecodedInfo> {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      process.env.JWT_SECRET || 'keyboard cat',
      (err, decoded) => {
        if (err) return reject(err);
        else return resolve(<JwtDecodedInfo>decoded);
      }
    );
  });
}

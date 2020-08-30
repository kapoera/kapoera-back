import jwt from 'jsonwebtoken';
import * as db from '../src/models/db';
import { secretObj } from '../config/secret';
import { Tokens } from './type';

export const createAccessToken = (mail: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { mail },
      secretObj.secret,
      { expiresIn: '15m', algorithm: 'HS256' },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    );
  });
};

export const createRefreshToken = (mail: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { mail },
      secretObj.secret,
      { expiresIn: '14d', algorithm: 'HS256' },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    );
  });
};

export const createTokens = (mail: string): Promise<Tokens> => {
  return new Promise((resolve, reject) => {
    createAccessToken(mail)
      .then(accessToken => {
        createRefreshToken(mail)
          .then(refreshToken => {
            db.addRefreshToken(refreshToken);
            resolve(<Tokens>{
              accessToken: accessToken,
              refreshToken: refreshToken
            });
          })
          .catch(err => {
            reject(<Tokens>{ accessToken: 'fail', refreshToken: 'fail' });
          });
      })
      .catch(err => {
        reject(<Tokens>{ accessToken: 'fail', refreshToken: 'fail' });
      });
  });
};

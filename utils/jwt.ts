import jwt from 'jsonwebtoken';
import { secretObj } from '../config/secret';
import { Tokens } from './type';

export const refreshTokens: Array<any> = [];

export const createAccessToken = (
  username: string,
  nickname: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { username: username, nickname: nickname },
      secretObj.secret,
      { expiresIn: '15m', algorithm: 'HS256' },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    );
  });
};

export const createRefreshToken = (
  username: string,
  nickname: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { username: username, nickname: nickname },
      secretObj.secret,
      { expiresIn: '14d', algorithm: 'HS256' },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    );
  });
};

export const createTokens = (
  username: string,
  nickname: string
): Promise<Tokens> => {
  return new Promise((resolve, reject) => {
    createAccessToken(username, nickname)
      .then(accessToken => {
        createRefreshToken(username, nickname)
          .then(refreshToken => {
            refreshTokens.push(refreshToken);
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

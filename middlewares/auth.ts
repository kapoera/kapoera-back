import jwt, { decode } from 'jsonwebtoken';
import express from 'express';
import { secretObj } from '../config/secret';
import { refreshTokens, jwtdecodedinfo, createAccessToken } from '../utils/jwt';

export function authMiddleware(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  function getAccessToken(param: any): string {
    if (param) return param.split(' ')[1];
    else return '';
  }
  function auth(token: string) {
    const p = new Promise((resolve, reject) => {
      jwt.verify(token, secretObj.secret, (err, decoded) => {
        if (err) return reject(err);
        else return resolve(decoded);
      });
    });
    return p;
  }

  function getRefreshToken(param: any): string {
    if (param) return param.split(' ')[2];
    else return '';
  }

  function check_expired(error: Error): Promise<jwtdecodedinfo> {
    if (error.message == 'jwt expired') {
      const refreshToken = getRefreshToken(req.headers.authorization);
      if (refreshToken in refreshTokens) {
        return new Promise((resolve, reject) => {
          jwt.verify(refreshToken, secretObj.secret, (err, decoded) => {
            if (err) return reject(err);
            else {
              return resolve(<jwtdecodedinfo>decoded);
            }
          });
        });
      } else {
        return new Promise((res, rej) => {
          rej(new Error('not existing refresh token'));
        });
      }
    } else
      return new Promise((res, rej) => {
        rej(new Error('not existing refresh token'));
      });
  }

  function revokeToken(decoded: jwtdecodedinfo) {
    res.json({
      success: true,
      newAccessToken: createAccessToken(decoded.username, decoded.nickname)
    });
  }

  function onError(error: Error) {
    res.status(403).json({
      success: false,
      message: error.message
    });
  }

  auth(getAccessToken(req.headers.authorization))
    .then(decoded => {
      next();
    })
    .catch(err => {
      check_expired(err)
        .then(decoded_refresh => {
          revokeToken(decoded_refresh);
        })
        .catch(onError);
    });
}

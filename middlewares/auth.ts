import jwt, { decode } from 'jsonwebtoken';
import express from 'express';
import { secretObj } from '../config/secret';
import { refreshTokens, createAccessToken } from '../utils/jwt';
import { JwtDecodedInfo } from '../utils/type';

export function authMiddleware(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void {
  function getAccessToken(param: string | undefined) {
    if (!param) return new Error('no authorization header');
    else if (param) return param.split(' ')[1];
    else return new Error('not appropriate format');
  }

  function auth(token: string | Error) {
    if (token instanceof Error) return Promise.reject(new Error(token.message));

    return new Promise((resolve, reject) => {
      jwt.verify(token, secretObj.secret, (err, decoded) => {
        if (err) return reject(err);
        else return resolve(decoded as JwtDecodedInfo);
      });
    });
  }

  function onError(error: Error) {
    if (error.message === 'jwt expired') {
      res.json({
        success: false,
        isExpired: true,
        message: error.message
      });
    }
    res.status(403).json({
      success: false,
      isExpired: false,
      message: error.message
    });
  }

  auth(getAccessToken(req.headers.authorization))
    .then(decoded => {
      if (decoded !== undefined) req.decoded = decoded as JwtDecodedInfo;
      next();
    })
    .catch(onError);
}

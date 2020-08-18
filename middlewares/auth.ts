import jwt, { decode } from 'jsonwebtoken';
import express from 'express';
import { secretObj } from '../config/secret';
import { refreshTokens, createAccessToken } from '../utils/jwt';
import { JwtDecodedInfo } from '../utils/type';

export function authMiddleware(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  function getAccessToken(param: any) {
    if (!param) return new Error('no authorization header');
    else if (param) return param.split(' ')[1];
    else return new Error('not appropriate format');
  }
  function auth(token: string) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secretObj.secret, (err, decoded) => {
        if (err) return reject(err);
        else return resolve(decoded);
      });
    });
  }

  function onError(error: Error) {
    if (error.message == 'jwt expired') {
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
      req.body.decoded = decoded;
      next();
    })
    .catch(onError);
}

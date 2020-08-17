import jwt from 'jsonwebtoken';
import express from 'express';
import { secretObj } from '../config/secret';

export function authMiddleware(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  function getToken(param: any) {
    if (param) return param.split(' ')[1];
    else return '';
  }
  function auth(token: string) {
    const p = new Promise((resolve, reject) => {
      jwt.verify(token, secretObj.secret, (err, decoded) => {
        if (err) return reject(err);
        else return resolve();
      });
    });
    return p;
  }

  function onError(error: Error) {
    res.status(403).json({
      success: false,
      message: error.message
    });
  }

  auth(getToken(req.headers.authorization))
    .then(() => {
      next();
    })
    .catch(onError);
}

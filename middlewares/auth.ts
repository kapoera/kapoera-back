import jwt from 'jsonwebtoken';
import express from 'express';
import { JwtDecodedInfo } from '../utils/type';
import { createAccessToken } from '../utils/jwt';

export function authMiddleware(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void {
  function auth(token: string) {
    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        process.env.JWT_SECRET || 'keyboard cat',
        (err, decoded) => {
          if (err) return reject(err);
          else return resolve(decoded as JwtDecodedInfo);
        }
      );
    });
  }

  function onError(error: Error) {
    res.status(403).json({
      success: false,
      message: error.message
    });
  }

  if (req.cookies['kapoera-access'] === undefined) {
    if (req.cookies['kapoera-refresh'] === undefined) {
      res.status(401).send('Refresh Token Expired');
    } else {
      const decoded = jwt.decode(req.cookies['kapoera-refresh']);
      createAccessToken((<{ mail: string }>decoded).mail).then(token => {
        req.decoded = jwt.decode(token) as JwtDecodedInfo;

        res.cookie('kapoera-access', token, {
          expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
          httpOnly: true,
          secure: true
        });

        next();
      });
    }
  } else {
    auth(req.cookies['kapoera-access'])
      .then(decoded => {
        if (decoded !== undefined) {
          req.decoded = decoded as JwtDecodedInfo;
        }
        next();
      })
      .catch(onError);
  }
}

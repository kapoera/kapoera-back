import express from 'express';
import { Tokens, LoginInput } from '../utils/type';
import * as jwtUtils from '../utils/jwt';
import * as authUtils from '../utils/auth';
import * as db from '../src/models/db';

const router = express.Router();

router.post('/login', (req: express.Request, res: express.Response) => {
  console.log(req.body);
  db.readUser(req.body.username).then(user => {
    console.log(user);
    if (user.length > 0) {
      jwtUtils
        .createTokens(user[0].username, user[0].nickname)
        .then((tokens: Tokens) => {
          console.log(tokens);
          res.json({
            success: true,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            is_new: false,
            default_nickname: 'hrouteryhroutery'
          });
        })
        .catch(err => console.error(err));
    } else {
      db.createUser(<LoginInput>req.body)
        .then(saveUser => {
          console.log(saveUser);
          jwtUtils
            .createTokens(saveUser.username, saveUser.nickname)
            .then((tokens: Tokens) => {
              res.json({
                success: true,
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                is_new: true,
                default_nickname: 'hrouteryhroutery'
              });
            })
            .catch(err => res.json({ success: false, message: err.message }));
        })
        .catch(err => {
          console.error(err);
          res.json({ success: false, message: err.message });
        });
    }
  });
});

router.post('/revoke', (req: express.Request, res: express.Response) => {
  if (!req.headers.refreshtoken) {
    res.json({ success: false, message: 'no refresh token' });
  } else {
    if (jwtUtils.refreshTokens.includes(req.headers.refreshtoken)) {
      authUtils
        .tokenVerify(<string>req.headers.refreshtoken)
        .then(authUtils.revokeToken)
        .then(token => {
          res.json({ success: true, newAccessToken: token });
        })
        .catch(err => res.json({ success: false, message: err.message }));
    } else {
      res.json({ success: false, message: 'not routerropriate token' });
    }
  }
});

export default router;

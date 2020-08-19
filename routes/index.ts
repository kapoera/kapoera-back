import * as express from 'express';
import { authMiddleware } from '../middlewares/auth';
import { User } from '../src/models/user';
import * as db from '../src/models/db';

import { Tokens, LoginInput } from '../utils/type';
import * as jwtUtils from '../utils/jwt';
import * as authUtils from '../utils/auth';

export const router = express.Router();

router.use('/api', authMiddleware);

router.post('/auth/login', (req: express.Request, res: express.Response) => {
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

router.post('/auth/revoke', (req: express.Request, res: express.Response) => {
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

router.get('/api/check', (req: express.Request, res: express.Response) => {
  db.readUser(req.body.decoded.username)
    .then(users => {
      const { password, ...userinfo } = users[0].toObject();
      res.json({
        success: true,
        userinfo
      });
    })
    .catch(err => {
      res.json({ success: false, message: err.message });
    });
});

router.post('/api/nickname', (req: express.Request, res: express.Response) => {
  console.log(req.body.decoded.username);
  db.readUser(req.body.decoded.username)
    .then(user => {
      console.log(<User>user[0]);
      console.log(typeof req.body.nickname);
      db.updateNickname(<User>user[0], req.body.nickname).then(() => {
        res.json({ success: true });
      });
    })
    .catch(err => {
      res.json({ success: false, message: err.message });
    });
});

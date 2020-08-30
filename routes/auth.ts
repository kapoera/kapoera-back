import express from 'express';
import querystring from 'querystring';
import { Tokens, LoginInput } from '../utils/type';
import * as jwtUtils from '../utils/jwt';
import * as authUtils from '../utils/auth';
import * as db from '../src/models/db';

const router = express.Router();

router.post('/login', (req: express.Request, res: express.Response) => {
  db.readUser(req.body.username).then(user => {
    if (user.length > 0) {
      const { _id, __v, password, ...userinfo } = user[0].toObject();
      jwtUtils
        .createTokens(userinfo.username)
        .then((tokens: Tokens) => {
          res.json({
            success: true,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            is_new: false,
            userinfo
          });
        })
        .catch(err => res.json({ success: false, message: err.message }));
    } else {
      db.createUser(<LoginInput>req.body)
        .then(saveUser => {
          const { _id, __v, password, ...userinfo } = saveUser.toObject();
          jwtUtils
            .createTokens(saveUser.username)
            .then((tokens: Tokens) => {
              res.json({
                success: true,
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
                is_new: true,
                userinfo
              });
            })
            .catch(err => res.json({ success: false, message: err.message }));
        })
        .catch(err => {
          res.json({ success: false, message: err.message });
        });
    }
  });
});

router.post('/login-sso', (req: express.Request, res: express.Response) => {
  const state = Date.now().toString();
  req.session.state = state;

  const qs = querystring.stringify({
    client_id: process.env.SSO_CLIENT_ID,
    state,
    redirect_url: 'https://cyberkapo20.site/login/callback'
  });
  const url = `https://iam2.kaist.ac.kr/api/sso/commonLogin?${qs}`;

  res.json({ url });
});

router.post('/token', (req: express.Request, res: express.Response) => {
  if (!req.headers.refreshtoken) {
    res.json({ success: false, message: 'no refresh token' });
  } else {
    if (db.existRefreshToken(<string>req.headers.refreshtoken)) {
      console.log('re-token-exist');
      authUtils
        .tokenVerify(<string>req.headers.refreshtoken)
        .then(authUtils.revokeToken)
        .then(token => {
          res.json({ success: true, accessToken: token });
        })
        .catch(err => res.json({ success: false, message: err.message }));
    } else {
      res.json({ success: false, message: 'not appropriate token' });
    }
  }
});

export default router;

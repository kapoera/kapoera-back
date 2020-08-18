import express from 'express';
import mongoose, { createConnection } from 'mongoose';
import cors from 'cors';
import { User, UserType, UserModel } from './models/user';
import * as db from './models/db';

import { JwtDecodedInfo, Tokens, LoginInput } from '../utils/type';
import * as jwtUtils from '../utils/jwt';
import * as authUtils from '../utils/auth';
import { authMiddleware } from '../middlewares/auth';

const uri = 'mongodb://localhost/kapoera';
mongoose.connect(uri, { useNewUrlParser: true });

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api', authMiddleware);

app.get('/', (req: express.Request, res: express.Response) => {
  res.send('hello!');
});

app.post('/auth/login', (req: express.Request, res: express.Response) => {
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
            default_nickname: 'happyhappy'
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
                default_nickname: 'happyhappy'
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

app.post('/auth/revoke', (req: express.Request, res: express.Response) => {
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
      res.json({ success: false, message: 'not appropriate token' });
    }
  }
});

app.get('/api/check', (req: express.Request, res: express.Response) => {
  db.readUser(req.body.decoded.username)
    .then(user => {
      const userinfo = <User>user[0];
      userinfo.password = '';
      console.log(userinfo);
      res.json({
        success: true,
        userinfo: userinfo
      });
    })
    .catch(err => {
      res.json({ success: false, message: err.message });
    });
});

app.post('/api/nickname', (req: express.Request, res: express.Response) => {
  res.send('happy');
});

app.listen(3000, () => console.log('start'));

import express from 'express';
import authRouter from './auth';
import apiRouter from './api';
import crypto from 'crypto';
import { SSOResult, SSODataMap, SSOUserInfo } from '../utils/type';
import { UserModel } from '../src/models/user';
import * as JWTUtils from '../utils/jwt';

const router = express.Router();
router.use('/auth', authRouter);
router.use('/api', apiRouter);

const decrypt = (encrypted: string, keySpec: Buffer, iv: Buffer) => {
  const decipher = crypto.createDecipheriv('aes-128-cbc', keySpec, iv);

  const encryptedBuffer = Buffer.from(encrypted, 'base64');
  return JSON.parse(
    Buffer.concat([
      decipher.update(encryptedBuffer),
      decipher.final()
    ]).toString()
  );
};

router.post(
  '/login/callback',
  async (req: express.Request, res: express.Response) => {
    const { body }: { body: SSOResult } = req;

    const key = process.env.SSO_CLIENT_SECRET + req.session.state;
    const keySpec = Buffer.from(key.substring(80, 96), 'utf8');
    const iv = Buffer.from(key.substring(80, 96), 'utf8');

    const { dataMap }: { dataMap: SSODataMap } = decrypt(
      body.result,
      keySpec,
      iv
    );
    const {
      USER_INFO: user,
      state
    }: { USER_INFO: SSOUserInfo; state: string } = dataMap;
    const { mail } = user;

    try {
      const { accessToken, refreshToken } = await JWTUtils.createTokens(mail);
      const exists = await UserModel.exists({ mail });
      const nickname = mail.substring(0, mail.length - '@kaist.ac.kr'.length);

      if (!exists) {
        const defaults = {
          score: 0,
          is_admin: false,
          nickname
        };

        const newUser = new UserModel({ ...defaults, ...user });
        await newUser.save();
      }

      res.cookie('kapoera-access', accessToken, {
        maxAge: 15 * 60 * 1000, // 15 minutes
        httpOnly: true,
        secure: true
      });

      res.cookie('kapoera-refresh', refreshToken, {
        maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
        httpOnly: true,
        secure: true
      });

      res.redirect(
        `https://cyberkapo20.site/signin/callback?new=${!exists}&nickname=${nickname}`
      );
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

export default router;

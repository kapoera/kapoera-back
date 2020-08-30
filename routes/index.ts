import express from 'express';
import authRouter from './auth';
import apiRouter from './api';
import crypto from 'crypto';

const router = express.Router();
router.use('/auth', authRouter);
router.use('/api', apiRouter);

interface SSOResult {
  result: string;
  k_uid: string;
  enc: string;
  success: string;
  user_id: string;
  state: string;
}

interface SSODataMap {
  USER_INFO: {
    ku_std_no: string;
    uid: string;
    kaist_uid: string;
    mail: string;
    givenname: string;
    mobile: string;
    ku_kname: string;
    sn: string;
  };
  state: string;
  REDIRECT_URL: string;
}

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
  (req: express.Request, res: express.Response) => {
    const { body }: { body: SSOResult } = req;

    const key = process.env.SSO_CLIENT_SECRET + req.session.state;
    const keySpec = Buffer.from(key.substring(80, 96), 'utf8');
    const iv = Buffer.from(key.substring(80, 96), 'utf8');

    const { dataMap }: { dataMap: SSODataMap } = decrypt(
      body.result,
      keySpec,
      iv
    );

    const { USER_INFO: user, state } = dataMap;

    res.redirect('https://cyberkapo20.site/signin/callback');
  }
);

export default router;

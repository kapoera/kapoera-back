import express from 'express';
import querystring from 'querystring';

const router = express.Router();

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

router.post('/logout', (req: express.Request, res: express.Response) => {
  res.cookie('kapoera-access', '', { expires: new Date(0) });
  res.cookie('kapoera-refresh', '', { expires: new Date(0) });

  res.json({ success: true });
});

export default router;

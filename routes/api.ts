import express from 'express';
import { authMiddleware } from '../middlewares/auth';
import * as db from '../src/models/db';
import { User } from '../src/models/user';

const router = express.Router();

router.use(authMiddleware);

router.get('/check', (req: express.Request, res: express.Response) => {
  db.readUser(req.body.decoded.username)
    .then(users => {
      const { _id, __v, password, ...userinfo } = users[0].toObject();
      res.json({
        success: true,
        userinfo
      });
    })
    .catch(err => {
      res.json({ success: false, message: err.message });
    });
});

router.post('/nickname', (req: express.Request, res: express.Response) => {
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

export default router;

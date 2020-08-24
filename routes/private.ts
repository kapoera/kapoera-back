import express from 'express';
import { authMiddleware } from '../middlewares/auth';
import * as db from '../src/models/db';
import { UserModel } from '../src/models/user';

const router = express.Router();

router.use(authMiddleware);

router.get('/check', (req: express.Request, res: express.Response) => {
  db.readUser(req.decoded.username)
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

router.post(
  '/nickname',
  async (req: express.Request, res: express.Response) => {
    const { username } = req.decoded;
    const { nickname } = req.body;

    const exists = await UserModel.exists({ nickname });
    if (exists) {
      res.json({ success: false, message: 'nickname taken' });
    } else {
      try {
        await UserModel.findOneAndUpdate({ username }, { nickname });
        res.json({ success: true });
      } catch (error) {
        res.json({ success: false, message: error.message });
      }
    }
  }
);

export default router;

import express from 'express';
import { authMiddleware } from '../middlewares/auth';
import * as db from '../src/models/db';
import { UserModel } from '../src/models/user';
import { GameModel, gameType } from '../src/models/game';

const router = express.Router();

router.use(authMiddleware);

router.get('/check', async (req: express.Request, res: express.Response) => {
  const { mail } = req.decoded;
  try {
    const userinfo = await UserModel.findOne({ mail });
    if (userinfo === null) throw Error('User not found');

    res.json({ success: true, userinfo });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
});

router.post(
  '/nickname',
  async (req: express.Request, res: express.Response) => {
    const { mail } = req.decoded;
    const { nickname } = req.body;

    const exists = await UserModel.exists({ nickname });
    if (exists) {
      res.json({ success: false, message: 'nickname taken' });
    } else {
      try {
        await UserModel.findOneAndUpdate({ mail }, { nickname });
        res.json({ success: true });
      } catch (error) {
        res.json({ success: false, message: error.message });
      }
    }
  }
);

router.post('/bet', async (req: express.Request, res: express.Response) => {
  const { mail } = req.decoded;
  const { game_type, choice } = req.body;

  const user = await UserModel.findOne({ mail });
  if (user === null) return res.status(400).send('User does not exist');

  const pushOption = {
    [choice === 'K' ? 'kaist_arr' : 'postech_arr']: user._id
  };

  await db.readGame(<gameType>game_type).then(async game => {
    const exist_k = game[0]
      .toObject()
      .kaist_arr.map((e: any) => e.toString())
      .includes(user._id.toString());
    const exist_p = game[0]
      .toObject()
      .postech_arr.map((e: any) => e.toString())
      .includes(user._id.toString());
    console.log(exist_k);
    console.log(exist_p);
    if (exist_k || exist_p) {
      res.json({ success: false });
    } else {
      try {
        await GameModel.update({ game_type }, { $addToSet: pushOption });
        res.json({ success: true });
      } catch (error) {
        res.status(500).send(error);
      }
    }
  });
});

export default router;

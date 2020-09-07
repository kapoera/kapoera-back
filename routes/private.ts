import express from 'express';
import { authMiddleware } from '../middlewares/auth';
import * as db from '../src/models/db';
import { UserModel } from '../src/models/user';
import { GameModel, playingType } from '../src/models/game';
import { Response, Event, EventModel } from '../src/models/event';
import adminRouter from './admin';

const router = express.Router();

router.use(authMiddleware);

router.use('/admin', adminRouter);

router.get('/check', async (req: express.Request, res: express.Response) => {
  const { mail } = req.decoded;
  try {
    const user = await UserModel.findOne({ mail });
    if (user === null) throw Error('User not found');
    const { __v, ...userinfo } = user.toObject();

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

  try {
    const gameStatus: {
      playing: playingType;
      hasVoted: boolean;
    }[] = await GameModel.aggregate([
      { $match: { game_type } },
      {
        $project: {
          playing: 1,
          hasVoted: {
            $or: [
              { $in: [user._id, '$kaist_arr'] },
              { $in: [user._id, '$postech_arr'] }
            ]
          }
        }
      }
    ]);

    if (gameStatus.length === 0) throw Error('Game not found');

    if (gameStatus[0].playing !== 'waiting')
      return res.status(400).send('Game has already started or finished');

    if (gameStatus[0].hasVoted) {
      res.json({ success: false });
    } else {
      await GameModel.update({ game_type }, { $addToSet: pushOption });
      res.json({ success: true });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post(
  '/betevent',
  async (req: express.Request, res: express.Response) => {
    const { mail } = req.decoded;

    const { key, choice, game_type } = req.body;

    const user = await UserModel.findOne({ mail });
    if (user === null) return res.status(400).send('User does not exist');
    const pushOption: Response = {
      choice: choice,
      key: user._id
    };

    try {
      const game = await GameModel.findOne({ game_type });
      if (game === null) throw Error('Game not found');
      else if (game.playing !== 'waiting')
        throw Error('Game already started or ended');

      const event = await EventModel.findOne({ key });
      if (event === null) throw Error('Event not found');

      if (event.responses.map(res => res.key).includes(user._id)) {
        res.json({ success: false });
      } else {
        await EventModel.update(
          { key },
          { $addToSet: { responses: pushOption } }
        );
        res.json({ success: true });
      }
    } catch (error) {
      res.status(500).send(error);
    }
  }
);

router.get(
  '/rankings/top',
  async (req: express.Request, res: express.Response) => {
    const limit: number = parseInt(req.query.limit as string) || 5;
    const {
      decoded: { mail }
    } = req;

    try {
      const rankings = await UserModel.aggregate([
        { $project: { mail: 1, nickname: 1, score: 1, _id: 0 } },
        { $sort: { score: -1 } },
        { $limit: limit }
      ]);

      const user = await UserModel.findOne({ mail });
      if (user === null) throw Error('User not found');

      const ranking =
        (await UserModel.count({ score: { $gt: user.score } })) + 1;

      res.json({
        success: true,
        rankings,
        user: { score: user.score, ranking }
      });
    } catch (error) {
      res.json({ success: false });
    }
  }
);

export default router;

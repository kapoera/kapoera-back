import express from 'express';
import * as db from '../src/models/db';
import privateRouter from './private';
import { gameType } from '../src/models/game';
import { UserModel } from '../src/models/user';

const router = express.Router();

router.use('/private', privateRouter);

router.get('/games', (req: express.Request, res: express.Response) => {
  db.readGames().then(games => {
    res.json(games.map(game => game.toObject()));
  });
});

router.get(
  '/games/:gameType',
  async (req: express.Request, res: express.Response) => {
    await db
      .readGame(<gameType>req.params.gameType)
      .then(game => {
        console.log(game[0].toObject());
        res.json(game[0].toObject());
      })
      .catch(err => {
        res.json({ message: err.message });
      });
  }
);

router.get(
  '/events/:gameType', async (req: express.Request, res: express.Response) => {
    await db.readEvent(<gameType>req.params.gameType)
      .then(events => {
        res.json(events.map(event => event.toObject()))
      })
      .catch(err => {
        res.json({ message: err.message });
      });
})

router.get(
  '/rankings/top',
  async (req: express.Request, res: express.Response) => {
    const { limit = 5 } = req.query;

    try {
      const ranking = await UserModel.aggregate([
        { $project: { nickname: 1, score: 1, _id: 0 } },
        { $sort: { score: -1 } },
        { $limit: limit }
      ]);

      res.json({ success: true, ranking });
    } catch (error) {
      res.json({ success: false });
    }
  }
);

export default router;

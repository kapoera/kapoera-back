import express from 'express';
import * as db from '../src/models/db';
import privateRouter from './private';
import { gameType } from '../src/models/game';

const router = express.Router();

router.use('/private', privateRouter);

router.get('/games', async (req: express.Request, res: express.Response) => {
  const response: any = {};
  await db.readGames().then(games => {
    games.forEach(game => {
      console.log(game.toObject());
      const key: string = game.toObject().game_type;
      response[key] = game.toObject();
    });
  });
  res.json(response);
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

export default router;

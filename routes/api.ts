import express from 'express';
import * as db from '../src/models/db';
import privateRouter from './private';

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

export default router;

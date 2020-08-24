import express from 'express';
import * as db from '../src/models/db';
import privateRouter from './private';

const router = express.Router();

router.use('/private', privateRouter);

router.get('/games', (req: express.Request, res: express.Response) => {
  db.readGames().then(games => {
    res.json(games.map(game => game.toObject()));
  });
});

export default router;

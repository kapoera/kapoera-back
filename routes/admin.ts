import express from 'express';
import * as db from '../src/models/db';
import { gameType } from '../src/models/game';
import { authMiddleware } from '../middlewares/auth';

const router = express.Router();

router.use(adminMiddleware)

export default router

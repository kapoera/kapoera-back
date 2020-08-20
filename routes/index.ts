import express from 'express';
import authRouter from './auth';
import apiRouter from './api';

const router = express.Router();
router.use('/auth', authRouter);
router.use('/api', apiRouter);

export default router;

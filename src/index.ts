import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectRedis from 'connect-redis';
import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import Redis from 'ioredis';
import mongoose from 'mongoose';
import morgan from 'morgan';
import SocketIo from 'socket.io';

import router from '../routes';
import { JwtDecodedInfo } from '../utils/type';
import * as db from './models/db';
import socketEvents from './socket';

dotenv.config();
const uri = 'mongodb://localhost/kapoera';
mongoose.connect(uri, { useNewUrlParser: true, useFindAndModify: false });

declare module 'express-serve-static-core' {
  interface Request {
    decoded: JwtDecodedInfo;
    session: Express.Session & {
      state: string;
    };
  }
}

const app = express();
const RedisStore = connectRedis(session);
const redisClient = new Redis();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('trust proxy', 1); // necessary for secure cookie
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET || 'keyboard cat',
    store: new RedisStore({ client: redisClient }),
    cookie: { secure: true, maxAge: 60000 }
  })
);
app.use(cookieParser());
app.use(morgan('combined'));
app.use('/', router);

db.initGames();
app.listen(3000, () => console.log('http server start'));

const socketApp = express();
const socketServer = socketApp.listen(8080, () =>
  console.log('socket server start')
);

const io = SocketIo(socketServer);
socketEvents(io);

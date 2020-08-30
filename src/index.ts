import express, { Express, Router } from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import router from '../routes';
import { JwtDecodedInfo } from '../utils/type';
import * as db from './models/db';
import SocketIo from 'socket.io';
import socketEvents from './socket';

dotenv.config();
const uri = 'mongodb://localhost/kapoera';
mongoose.connect(uri, { useNewUrlParser: true, useFindAndModify: false });

declare module 'express-serve-static-core' {
  interface Request {
    decoded: JwtDecodedInfo;
    session: Express.Session & { state: string };
  }
}

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('trust proxy', 1); // necessary for secure cookie
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SECRET || 'keyboard cat',
    cookie: { secure: true, maxAge: 60000 }
  })
);
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

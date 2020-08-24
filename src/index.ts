import express, { Router } from 'express';
import mongoose, { createConnection } from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';
import router from '../routes';
import { JwtDecodedInfo } from '../utils/type';
import * as db from './models/db';

const uri = 'mongodb://localhost/kapoera';
mongoose.connect(uri, { useNewUrlParser: true, useFindAndModify: false });

declare module 'express-serve-static-core' {
  interface Request {
    decoded: JwtDecodedInfo;
  }
}

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('combined'));

app.use('/', router);

db.initGames();
app.listen(3000, () => console.log('start'));

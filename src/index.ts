import express, { Router } from 'express';
import mongoose, { createConnection } from 'mongoose';
import cors from 'cors';
import { router } from '../routes/index';
const uri = 'mongodb://localhost/kapoera';
mongoose.connect(uri, { useNewUrlParser: true });

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', router);

app.listen(3000, () => console.log('start'));

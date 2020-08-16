import express from 'express';
import mongoose, { createConnection } from 'mongoose';
import cors from 'cors';
import { DB } from './models/db';

const uri = 'mongodb://localhost/kapoera';
mongoose.connect(uri, { useNewUrlParser: true });
const db = new DB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api', authMiddleware);

app.get('/', (req: express.Request, res: express.Response) => {
  res.send('hello!');
});

app.post('/auth/login', (req: express.Request, res: express.Response) => {
});
app.post('/api/nickname', (req: express.Request, res: express.Response) => {
});

app.listen(3000, () => console.log('start'));

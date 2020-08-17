import { promisify } from 'util';
import express from 'express';
import mongoose, { createConnection } from 'mongoose';
import cors from 'cors';
import { User, UserType, UserModel } from './models/user';
import { DB } from './models/db';
import { createToken } from '../utils/jwt';
import { authMiddleware } from '../middlewares/auth';
import jwt from 'jsonwebtoken';
import { secretObj } from '../config/secret';

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
  console.log(req.body);
  db.read({ username: req.body.username, password: req.body.password }).then(
    user => {
      console.log(user);
      if (user.length > 0)
        createToken(user[0].username, user[0].nickname)
          .then(token => {
            res.json({
              success: true,
              token: token,
              is_new: false,
              default_nickname: 'happyhappy'
            });
          })
          .catch(err => console.error(err));
      else {
        db.create(req.body)
          .then(saveUser => {
            console.log(saveUser);
            createToken(saveUser.username, saveUser.nickname)
              .then(token => {
                res.json({
                  success: true,
                  token: token,
                  is_new: true,
                  default_nickname: 'happyhappy'
                });
              })
              .catch(err => console.error(err));
          })
          .catch(err => {
            console.error(err);
            console.log({ success: false });
          });
      }
    }
  );
});

app.get('/auth/check', async (req: express.Request, res: express.Response) => {
  if (!req.headers.authorization) {
    res.json({ valid: false });
  } else {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = await promisify(jwt.verify)(token, secretObj.secret);

      res.json({ valid: true, decoded });
    } catch (err) {
      res.json({ valid: false });
    }
  }
});

app.post('/api/nickname', (req: express.Request, res: express.Response) => {
  res.send('happy');
});

app.listen(3000, () => console.log('start'));

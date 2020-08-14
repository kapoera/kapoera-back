import express from 'express';
import mongoose from 'mongoose';

import { User, UserModel } from './models/user';
import { DB } from './models/db';

class App {
  public application: express.Application;

  constructor() {
    this.application = express();
    this.router();
  }

  private router(): void {
    this.application.get('/', (req: express.Request, res: express.Response) => {
      res.send('hello!');
    });
  }
}

const uri = 'mongodb://localhost/kapoera';

const db = new DB();
let testUser = {
  key: 1,
  score: 500,
  is_admin: true,
  nickname: 'alogon',
  name: 'geonho',
  department: 'CS',
  student_number: 12345678,
  password: 'password'
};

mongoose.connect(uri, { useNewUrlParser: true });
UserModel.create(testUser);

const app = new App().application;
app.listen(3000, () => console.log('start'));

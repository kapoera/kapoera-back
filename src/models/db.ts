import mongoose from 'mongoose';

import { User, UserModel } from './user';

export class DB {
  constructor() {}

  read(query: any): mongoose.DocumentQuery<User[], User> {
    return UserModel.find(query);
  }

  create(user: User): Promise<User> {
    let u = new UserModel(user);
    return u.save();
  }

  updateScore(user: User): mongoose.Query<number> {
    return UserModel.update({ score: user.score }, { ...user });
  }
}

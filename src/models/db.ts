import mongoose from 'mongoose';

import { User, UserType, UserModel } from './user';

export class DB {
  constructor() {}

  read(query: any): mongoose.DocumentQuery<UserType[], UserType> {
    return UserModel.find(query);
  }

  //   is_key_unique(key: String): Boolean {
  //     this.read({ key: key })
  //       .then(user => {
  //         if (user != null) return true;
  //         return false;
  //       })
  //       .catch(err => {
  //         console.error(err);
  //         return false;
  //       });
  //   }
  create(input: any): Promise<UserType> {
    const def = {
      score: 500,
      is_admin: false,
      department: 'CS',
      student_number: 12345678,
      nickname: 'happyhappy'
    };
    const user = { ...def, ...input };
    console.log(user);
    const u = new UserModel(user);
    return u.save();
  }

  updateNickname(user: User): mongoose.Query<number> {
    return UserModel.update({ score: user.score }, { ...user });
  }

  updateScore(user: User): mongoose.Query<number> {
    return UserModel.update({ score: user.score }, { ...user });
  }
}

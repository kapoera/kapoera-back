import mongoose from 'mongoose';
import { LoginInput } from '../../utils/type';
import { User, UserType, UserModel } from './user';
import { RefreshTokenType, RefreshTokenModel } from './token';

export function readUser(
  username: string
): mongoose.DocumentQuery<UserType[], UserType> {
  return UserModel.find({ username: username });
}

export function createUser(input: LoginInput): Promise<UserType> {
  const def = {
    score: 500,
    is_admin: false,
    department: 'CS',
    student_number: 12345678,
    nickname: 'happyhappy'
  };
  const user = { ...def, ...input };
  const u = new UserModel(user);
  return u.save();
}

export function updateNickname(
  user: User,
  nickname: string
): mongoose.Query<number> {
  return UserModel.update({ username: user.username }, { nickname: nickname });
}

export function addRefreshToken(token: string): Promise<RefreshTokenType> {
  const t = new RefreshTokenModel({ refreshToken: token });
  return t.save();
}

export function existRefreshToken(token: string): Promise<boolean> {
  return RefreshTokenModel.exists({ refreshToken: token });
}

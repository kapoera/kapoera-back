import mongoose from 'mongoose';
import { SSOUserInfo } from '../../utils/type';

export interface User extends SSOUserInfo {
  score: number;
  is_admin: boolean;
  nickname: string;
}

export type UserType = User & mongoose.Document;
const userSchema = new mongoose.Schema({
  score: { type: Number, required: true },
  is_admin: { type: Boolean, required: true },
  nickname: { type: String, required: true },
  ku_std_no: { type: String, required: true },
  uid: { type: String, required: true },
  kaist_uid: { type: String, required: true },
  mail: { type: String, required: true, unique: true },
  givenname: { type: String, required: true },
  mobile: { type: String, required: true },
  ku_kname: { type: String, required: false },
  sn: { type: String, required: true }
});

export const UserModel = mongoose.model<UserType>('User', userSchema);

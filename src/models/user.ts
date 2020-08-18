import mongoose from 'mongoose';

export interface User {
  score: number;
  is_admin: boolean;
  nickname: string;
  username: string;
  department: string;
  student_number: number;
  password: string;
}

export type UserType = User & mongoose.Document;
const userSchema = new mongoose.Schema({
  score: { type: Number, required: true },
  is_admin: { type: Boolean, required: true },
  nickname: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  department: { type: String, required: false },
  student_number: { type: Number, required: false },
  password: { type: String, required: true }
});

export const UserModel = mongoose.model<UserType>('User', userSchema);

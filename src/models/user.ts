import mongoose from 'mongoose';

export interface User extends mongoose.Document {
  key: Number;
  score: Number;
  is_admin: Boolean;
  nickname: String;
  name: String;
  department: String;
  student_number: Number;
  password: String;
}

const userSchema = new mongoose.Schema({
  key: { type: Number, required: true },
  score: { type: Number, required: true },
  is_admin: { type: Boolean, required: true },
  nickname: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  department: { type: String, required: false },
  student_number: { type: Number, required: false },
  password: { type: String, required: true }
});

export const UserModel = mongoose.model<User>('User', userSchema);

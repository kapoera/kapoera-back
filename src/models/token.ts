import mongoose from 'mongoose';

export interface RefreshToken {
  refreshToken: string;
}

export type RefreshTokenType = RefreshToken & mongoose.Document;

const RefreshTokenSchema = new mongoose.Schema({
  refreshToken: { type: String, required: true }
});

export const RefreshTokenModel = mongoose.model<RefreshTokenType>(
  'RefreshToken',
  RefreshTokenSchema
);

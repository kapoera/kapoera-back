import mongoose from 'mongoose';
import { gameType } from './game';
export interface Response {
  choice: string;
  key: string;
}

export interface Event {
  game_type: gameType;
  answer: string;
  choices: Array<string>;
  responses: Array<Response>;
  name: string;
  key: number;
}

export type EventType = Event & mongoose.Document;

const EventSchema = new mongoose.Schema({
  game_type: { type: {} as gameType, required: true },
  answer: { type: String },
  choices: { type: [String], required: true },
  responses: { type: [{} as Response], default: [] },
  name: { type: String, required: true },
  key: { type: Number, required: true, unique: true }
});

export const EventModel = mongoose.model<EventType>('Event', EventSchema);
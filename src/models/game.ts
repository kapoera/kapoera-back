import mongoose from 'mongoose';

export type gameType = 'quiz' | 'hacking' | 'ai' | 'lol' | 'kart';
type playingType = 'waiting' | 'running' | 'exiting';
type winnerType = 'K' | 'P';
type resultType = {
  K: number;
  P: number;
};

export interface Game {
  dividend: number;
  kaist_arr: Array<mongoose.Schema.Types.ObjectId>;
  postech_arr: Array<mongoose.Schema.Types.ObjectId>;
  game_type: gameType;
  subevents: Array<mongoose.Schema.Types.ObjectId>;
  playing: playingType;
  winner?: winnerType;
  result: resultType;
  starting_time: Date;
}

export interface Games {
  quiz: Game;
  ai: Game;
  hacking: Game;
  cart: Game;
  lol: Game;
}

export type GameType = Game & mongoose.Document;

const GameSchema = new mongoose.Schema({
  dividend: { type: Number, required: true },
  kaist_arr: { type: [mongoose.Schema.Types.ObjectId], default: [] },
  postech_arr: { type: [mongoose.Schema.Types.ObjectId], default: [] },
  game_type: { type: {} as gameType, required: true },
  subevents: { type: [mongoose.Schema.Types.ObjectId], default: [] },
  playing: { type: {} as playingType, default: 'waiting' },
  winner: { type: {} as winnerType, default: 'K' },
  result: { type: { K: Number, P: Number }, default: { K: 0, P: 0 } },
  starting_time: { type: Date, default: Date.now }
});

export const GameModel = mongoose.model<GameType>('Game', GameSchema);

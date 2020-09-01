import mongoose from 'mongoose';
import { LoginInput } from '../../utils/type';
import { User, UserType, UserModel } from './user';
import { RefreshTokenType, RefreshTokenModel } from './token';
import { GameType, GameModel, gameType } from './game';
import { EventType, EventModel } from './event';

export function readUser(
  mail: string
): mongoose.DocumentQuery<UserType[], UserType> {
  return UserModel.find({ mail });
}

export function addRefreshToken(token: string): Promise<RefreshTokenType> {
  const t = new RefreshTokenModel({ refreshToken: token });
  return t.save();
}

export function existRefreshToken(token: string): Promise<boolean> {
  return RefreshTokenModel.exists({ refreshToken: token });
}

function createGame(game_type: string, dividend: number): Promise<GameType> {
  const g = new GameModel({
    dividend: dividend,
    game_type: game_type
  });
  return g.save();
}

export async function initGames(): Promise<void> {
  if (await GameModel.exists({})) {
    console.log('already initialized - games');
    return;
  }
  const games = [
    { game_type: 'quiz', dividend: 1000 },
    { game_type: 'ai', dividend: 1000 },
    { game_type: 'lol', dividend: 1000 },
    { game_type: 'kart', dividend: 1000 },
    { game_type: 'hacking', dividend: 1000 }
  ];
  games.forEach(game => {
    createGame(game.game_type, game.dividend);
  });
}

async function createEvent(
  game_type: string,
  answer: string,
  choices: Array<string>
): Promise<EventType> {
  const e = new EventModel({
    game_type: <gameType>game_type,
    answer: answer,
    choices: choices
  });

  return e.save();
}

async function initializeEvent(e: any) {
  const game_type = e.game_type;
  await GameModel.update({ game_type }, { $addToSet: { subevents: e._id } });
}

export async function initEvents(): Promise<void> {
  if (await EventModel.exists({})) {
    console.log('already initialized - events');
    return;
  }
  const events = [
    { game_type: 'quiz', answer: 'a', choices: ['a', 'b', 'c', 'd', 'e'] },
    { game_type: 'quiz', answer: 'a', choices: ['a', 'b', 'c', 'd', 'e'] },
    { game_type: 'hacking', answer: 'a', choices: ['a', 'b', 'c', 'd', 'e'] },
    { game_type: 'hacking', answer: 'a', choices: ['a', 'b', 'c', 'd', 'e'] },
    { game_type: 'ai', answer: 'a', choices: ['a', 'b', 'c', 'd', 'e'] },
    { game_type: 'ai', answer: 'a', choices: ['a', 'b', 'c', 'd', 'e'] },
    { game_type: 'lol', answer: 'a', choices: ['a', 'b', 'c', 'd', 'e'] },
    { game_type: 'lol', answer: 'a', choices: ['a', 'b', 'c', 'd', 'e'] },
    { game_type: 'kart', answer: 'a', choices: ['a', 'b', 'c', 'd', 'e'] },
    { game_type: 'kart', answer: 'a', choices: ['a', 'b', 'c', 'd', 'e'] }
  ];
  events.forEach(event => {
    createEvent(event.game_type, event.answer, event.choices).then(
      event_model => {
        initializeEvent(event_model);
      }
    );
  });
}

export function readGames(): mongoose.DocumentQuery<GameType[], GameType> {
  return GameModel.find({});
}

export function readGame(
  game_type: gameType
): mongoose.DocumentQuery<GameType[], GameType> {
  return GameModel.find({ game_type: game_type });
}

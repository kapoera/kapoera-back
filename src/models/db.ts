import mongoose from 'mongoose';
import { GamesI, LoginInput } from '../../utils/type';
import { UserType, UserModel } from './user';
import { RefreshTokenType, RefreshTokenModel } from './token';
import { GameType, GameModel, gameType } from './game';
import { EventType, EventModel } from './event';
import events from './data/events';
import games from './data/games';

export function readUser(
  mail: string
): mongoose.DocumentQuery<UserType[], UserType> {
  return UserModel.find({ mail });
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

export function addRefreshToken(token: string): Promise<RefreshTokenType> {
  const t = new RefreshTokenModel({ refreshToken: token });
  return t.save();
}

export function existRefreshToken(token: string): Promise<boolean> {
  return RefreshTokenModel.exists({ refreshToken: token });
}

function createGame(game: GamesI): Promise<GameType> {
  const g = new GameModel(game);
  return g.save();
}

export async function initGames(): Promise<void> {
  if (await GameModel.exists({})) {
    console.log('already initialized - games');
    return;
  }
  games.forEach(game => createGame(game));
}

async function createEvent(
  game_type: string,
  choices: Array<string>,
  name_ko: string,
  name_en: string,
  dividend: number,
  idx: number
): Promise<EventType> {
  const e = new EventModel({
    game_type: <gameType>game_type,
    choices,
    name_ko,
    name_en,
    dividend,
    key: idx
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

  events.forEach((event, idx) => {
    createEvent(
      event.game_type,
      event.choices,
      event.name_ko,
      event.name_en,
      event.dividend,
      idx
    ).then(event_model => {
      initializeEvent(event_model);
    });
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

export function readEvent(
  game_type: gameType
): mongoose.DocumentQuery<EventType[], EventType> {
  return EventModel.find({ game_type: game_type });
}
export function readEventWithKey(
  key: number
): mongoose.DocumentQuery<EventType[], EventType> {
  return EventModel.find({ key: key });
}

import mongoose from 'mongoose';
import { LoginInput } from '../../utils/type';
import { User, UserType, UserModel } from './user';
import { RefreshTokenType, RefreshTokenModel } from './token';
import { GameType, GameModel } from './game';

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

function createGame(game_type: string, dividend: number): Promise<GameType> {
  const g = new GameModel({
    dividend: dividend,
    game_type: game_type
  });
  return g.save();
}

export async function initGames(): Promise<void> {
  if (await GameModel.exists({})) {
    console.log('already initialized');
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

export function readGames(): mongoose.DocumentQuery<GameType[], GameType> {
  return GameModel.find({});
}

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

// export function updateNickname(
//   user: User,
//   nickname: string
// ): mongoose.Query<number> {
//   return UserModel.update({ username: user.username }, { nickname: nickname });
// }

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
  choices: Array<string>,
  name: string,
  idx: number
): Promise<EventType> {
  const e = new EventModel({
    game_type: <gameType>game_type,
    choices: choices,
    name: name,
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
  const events = [
    {
      game_type: 'quiz',
      choices: ['Kaist', 'Postech'],
      name: '화학 3번 문제를 맞추는 학교는 어디일까?'
    },
    {
      game_type: 'hacking',
      choices: ['a', 'b', 'c', 'd', 'e'],
      name: 'hacking-a'
    },
    {
      game_type: 'hacking',
      choices: ['a', 'b', 'c', 'd', 'e'],
      name: 'hacking-b'
    },
    {
      game_type: 'ai',
      choices: ['5:0', '4:1', '3:2', '2:3', '1:4', '0:5'],
      name: 'AI경기가 몇대 몇으로 끝날까?'
    },
    {
      game_type: 'lol',
      choices: ['화염', '바다', '대지', '바람'],
      name: '첫번쨰 용의 원소는?'
    },
    {
      game_type: 'lol',
      choices: [
        '앞으로 팀탓 안함',
        '춘정박',
        'Dont give up ToT',
        'broke boys',
        'nobonobo'
      ],
      name: '첫번째 킬을 할 선수는?'
    },
    {
      game_type: 'kart',
      choices: ['김동준', '곽채현', '정채현', '엄윤식'],
      name: '3등으로 들어오는 선수는?'
    },
    {
      game_type: 'kart',
      choices: ['0~3', '4~7', '8~11', '12~15', '16~19'],
      name: '1등으로 들어온 선수가 사용한 부스터 갯수'
    }
  ];
  events.forEach((event, idx) => {
    createEvent(event.game_type, event.choices, event.name, idx).then(
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

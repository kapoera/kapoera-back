import * as db from './models/db';
import { Socket, Server } from 'socket.io';
import { gameType } from './models/game';

const socketEvents = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log(socket.handshake.query.game);
    socket.join(socket.handshake.query.game);

    socket.on('disconnect', () => {
      console.log('out');
    });
  });

  const refreshInfo = () => {
    const games = ['quiz', 'ai', 'lol', 'kart', 'hacking'];
    games.forEach(game_type => {
      db.readGame(<gameType>game_type)
        .then(game => {
          io.sockets.in(game_type).emit('refresh', game[0]);
        })
        .catch(err => {
          console.log(err.message);
        });
    });
  };

  setInterval(refreshInfo, 1000);
  //   const quiz = io.of('/quiz');
  //   quiz.on('connection', (socket: Socket) => {
  //     console.log('in');
  //     const refreshInfo = () => {
  //       db.readGame(<gameType>'quiz').then(game => {
  //         socket.emit('refresh', game[0]);
  //       });
  //     };
  //     const refreshFront = setInterval(refreshInfo, 1000);

  //     socket.on('disconnect', () => {
  //       console.log('out');
  //       clearInterval(refreshFront);
  //     });
  //   });
};

export default socketEvents;

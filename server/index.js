import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

import Player from './Player.server.js';
import Board from './Board.server.js';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://192.168.1.19:5173"],
    methods: ['GET', 'POST']
  }
});

app.use(cors());

const board = new Board(io);

io.on('connection', (socket) => {
  socket.on('players::new', (event) => {
    // First emit all current players
    io.to(socket.id).emit('players::all', board.players.map((player) => player.toJson()));

    const player = new Player(socket.id, event.name, event.type);
    player.x = event.x;
    player.y = event.y;

    board.addPlayer(player);

    socket.broadcast.emit('players::new', player.toJson());

    setInterval(() => {
      // Update position from server to client to prevent mismatch
      io.to(socket.id).emit('players::update', board.players.map((player) => player.toJson()));
    }, 20);
	});
  
  socket.on('player::change-direction', (playerClient) => {
    const player = board.getPlayerById(playerClient.id);

    if (player) {
      player.direction = playerClient.direction;
      socket.broadcast.emit('player::change-direction', player.toJson());
    }
	});

  socket.on('disconnect', () => {
    const player = board.getPlayerById(socket.id);

    board.removePlayerById(socket.id);

    if (player) {
      socket.broadcast.emit('players::remove', player.toJson());
    }
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});
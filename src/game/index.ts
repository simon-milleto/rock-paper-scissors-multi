import Board from './Board'
import SocketHandler from './SocketHandler'
import { displayRanking } from './../UI/end';

const appContainer = document.querySelector<HTMLElement>('#app')!;

export const initGame = (name: string) => {
  appContainer.style.display = 'block';

  const canvas = document.createElement('canvas');
  appContainer.appendChild(canvas);
  
  const board = new Board(canvas);
  
  const socketHandler = new SocketHandler();

  socketHandler.onceConnected().then(() => {
  
    const player = board.createPlayer(socketHandler.socket.id, name);
    socketHandler.socket.emit('players::new', player.toServerFormat());
  
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      let direction: 'up'|'down'|'left'|'right'|undefined = undefined;

      switch (e.code) {
        case 'ArrowUp':
          direction = 'up';
          break;
        case 'ArrowDown':
          direction = 'down';
          break;
        case 'ArrowLeft':
          direction = 'left';
          break;
        case 'ArrowRight':
          direction = 'right';
          break;
        default:
          break;
      }
    
      if (direction) {
        e.preventDefault();
        
        if (player.element.direction !== direction) {
          player.direction = direction;
          socketHandler.socket.emit('player::change-direction', player.toServerFormat());
        }
      }
    });
    
    document.addEventListener('keyup', () => {
      player.direction = null;
      socketHandler.socket.emit('player::change-direction', player.toServerFormat());
    });
  
    // On event from server
    socketHandler.socket.on('game::end', (players) => {
      displayRanking(players);
    });

    socketHandler.socket.on('player::change-type', (player) => {
      board.updateType(player.id, player.type);
    });
  
    socketHandler.socket.on('player::change-direction', (player) => {
      board.updateDirection(player.id, player.direction);
    });
  
    socketHandler.socket.on('players::remove', (player) => {
      board.removePlayerServer(player);
    });
  
    socketHandler.socket.on('players::new', (player) => {
      board.addPlayerServer(player);
    });
  
    socketHandler.socket.on('players::all', (players) => {
      for (const player of players) {
        board.addPlayerServer(player);
      }
    });
  
    socketHandler.socket.on('players::update', (players) => {
      for (const player of players) {
        board.updatePlayerServer(player);
      }
    });
  });
  
}
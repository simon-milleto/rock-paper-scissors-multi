import { io, Socket } from 'socket.io-client';

export default class SocketHandler {
  socket: Socket;
  promiseConnected: Promise<undefined>;
  promiseConnectedResolver!: (value?: PromiseLike<undefined> | undefined) => void;

  constructor() {
    this.socket = io('http://localhost:3000');

    this.promiseConnected = new Promise((resolve) => {
      this.promiseConnectedResolver = resolve;
    });
    this.socket.on('connect', () => {
      this.promiseConnectedResolver();
    }); 
  }

  get id(): string {
    return this.socket.id;
  }

  onConnected() {
    return this.promiseConnected;
  }
}
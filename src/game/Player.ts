import Element from './Element'

export type PlayerServer = {
  id: string;
  name: string;
  type: 'rock'|'paper'|'scissors';
  direction: 'up'|'down'|'left'|'right'|null;
  x: number;
  y: number;
  scores: {
    hit: number;
    kill: number;
    death: number;
  }
}

export default class Player {
  id: string;
  name: string;
  element!: Element;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }

  setElement(element: Element) {
    this.element = element;

    this.element.player = this;
  }

  set direction(direction: 'up'|'down'|'left'|'right'|null) {
    this.element.direction = direction;
  }

  toServerFormat(): PlayerServer {
    return {
      id: this.id,
      name: this.name,
      type: this.element.type,
      direction: this.element.direction,
      x: this.element.x,
      y: this.element.y,
      scores: {
        hit: 0,
        kill: 0,
        death: 0
      }
    }
  }
}

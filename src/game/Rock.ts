import Element from './Element';

export default class Rock extends Element {

  constructor(context: CanvasRenderingContext2D, x: number, y: number) {
    super(context, x, y);
    this.display = '🪨';
    this.type = 'rock';
  }
}
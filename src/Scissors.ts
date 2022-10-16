import Element from './Element';

export default class Scissors extends Element {

  constructor(context: CanvasRenderingContext2D, x: number, y: number) {
    super(context, x, y);
    this.display = '✂️';
    this.type = 'scissors';
  }
}
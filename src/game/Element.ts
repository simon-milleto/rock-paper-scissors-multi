import Player from './Player'

export default class Element {
  context: CanvasRenderingContext2D;
  x: number;
  y: number;
  type!: 'rock'|'paper'|'scissors';
  display!: string;
  direction: 'up'|'down'|'left'|'right'|null = null;
  player!: Player;

  size = 32;

  constructor(context: CanvasRenderingContext2D, x: number, y: number) {
    this.context = context;
    this.y = y;
    this.x = x;
  }

  get xMax() {
    return (this.x + this.size / 2);
  }

  get xMin() {
    return (this.x - this.size / 2);
  }

  get yMax() {
    return (this.y + this.size / 2);
  }

  get yMin() {
    return (this.y - this.size / 2);
  }

  setPlayer(player: Player) {
    this.player = player;

    this.player.element = this;
  }

  computePosition() {
    switch (this.direction) {
      case 'up':
        this.y -= 3;
        break;
      case 'down':
        this.y += 3;
        break;
      case 'left':
        this.x -= 3; 
        break;
      case 'right':
        this.x += 3;
        break;
      default:
        break;
    }
  }

  draw() {
    // this.computePosition();

		// The size of the emoji is set with the font
    this.context.font = `${this.size}px Helvetica sans-serif`;
    
    // use these alignment properties for "better" positioning
    this.context.textAlign = "center"; 
    this.context.textBaseline = "middle"; 
    this.context.fillStyle = "#000000";
    
    // draw the emoji
    this.context.fillText(this.display, this.x, this.y);
    
    if (this.player) {      
      this.context.fillText(this.player.name, this.x, this.y - this.size);
    }
  }

  overlap(element: Element): boolean {
    const overlapX = this.xMax >= element.xMin && element.xMax >= this.xMin;
    const overlapY = this.yMax >= element.yMin && element.yMax >= this.yMin;

    return overlapX && overlapY;
  }

  winAgainst(element: Element) {
    return (this.type === 'rock') && (element.type === 'scissors')
      || (this.type === 'paper') && (element.type === 'rock')
      || (this.type === 'scissors') && (element.type === 'paper');
  }
}
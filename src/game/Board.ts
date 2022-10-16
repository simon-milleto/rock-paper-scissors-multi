import Rock from './Rock'
import Paper from './Paper'
import Scissors from './Scissors'
import Element from './Element'
import Player, { PlayerServer } from './Player'

type elementType = (typeof Rock|typeof Paper|typeof Scissors);

const BACKGROUND_COLOR = '#FFFFFF';
const ELEMENTS: elementType[] = [Rock, Paper, Scissors];
const size = {
  width: 500,
  height: 500
};

export default class Board {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  width!: number;
  height!: number;
  elements: (Rock|Paper|Scissors)[] = [];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d')!;

    this.setSize(size.width, size.height);

    this.render();
  }

  setSize(width: number, height: number) {
    this.width = width;
    this.height = height;

    this.canvas.style.width = width + "px";
    this.canvas.style.height = height + "px";

    const scale = window.devicePixelRatio;
    this.canvas.width = width * scale;
    this.canvas.height = height * scale;

    this.context.scale(scale, scale);
    this.context.fillStyle = BACKGROUND_COLOR;
    this.context.fillRect(0, 0, this.width, this.height);
  }

  getRandomPosition(): {x: number; y: number;} {
    return {
      x: Math.floor(Math.random() * (this.width - 0 + 1) + 0),
      y: Math.floor(Math.random() * (this.height - 0 + 1) + 0)
    } 
  }

  addRock() {
    const position = this.getRandomPosition();
    const rock = new Rock(this.context, position.x, position.y);
    this.elements.push(rock);

    rock.draw();
  }

  addPaper() {
    const position = this.getRandomPosition();
    const paper = new Paper(this.context, position.x, position.y);
    this.elements.push(paper);

    paper.draw();
  }

  addScissors() {
    const position = this.getRandomPosition();
    const scissors = new Scissors(this.context, position.x, position.y);
    this.elements.push(scissors);

    scissors.draw();
  }

  createPlayer(id: string, name: string) {
    const player = new Player(id, name);
    const element = this.getRandomElement();

    player.setElement(element);

    this.elements.push(player.element);
    
    return player;
  }
  
  addPlayerServer(playerServer: PlayerServer) {
    const player = new Player(playerServer.id, playerServer.name);
    const ElementType = this.getElementByType(playerServer.type);
    const element = new ElementType(this.context, playerServer.x, playerServer.y);

    player.setElement(element);

    this.elements.push(player.element);
    
    return player;
  }
  
  removePlayerServer(playerServer: PlayerServer) {
    const indexElement = this.elements.findIndex((elem) => elem.player && elem.player.id === playerServer.id);

    if (indexElement > -1) {
      this.elements.splice(indexElement, 1);
    }
  }

  getRandomElement(): Element {
    const index = Math.floor(Math.random() * (2 - 0 + 1) + 0);
    const position = this.getRandomPosition();
    const element = new ELEMENTS[index](this.context, position.x, position.y);

    return element;
  }

  updateType(id: string, type: 'rock'|'paper'|'scissors') {
    const element = this.elements.find((elem) => elem.player && elem.player.id === id);

    if (element) {
      const indexToReplace = this.elements.indexOf(element);
      const newElement = this.replaceElement(type, element);
      newElement.setPlayer(element.player);

      this.elements[indexToReplace] = newElement;
    }
  }

  updateDirection(id: string, direction: 'up'|'down'|'left'|'right'|null) {
    const element = this.elements.find((elem) => elem.player && elem.player.id === id);

    if (element) {
      element.direction = direction;
    }
  }

  updatePlayerServer(player: PlayerServer) {
    const element = this.elements.find((elem) => elem.player && elem.player.id === player.id);

    if (element) {
      element.x = player.x;
      element.y = player.y;
    }
  }

  checkOverlaps() {
    for (const overlap of this.getOverlaps()) {

      let elementToCopy: Element|null = null;
      let elementToReplace: Element|null = null;

      if (overlap[0].winAgainst(overlap[1])) {
        elementToCopy = overlap[0];
        elementToReplace = overlap[1];
      } else if (overlap[1].winAgainst(overlap[0])) {
        elementToCopy = overlap[1];
        elementToReplace = overlap[0];
      }

      if (elementToCopy && elementToReplace) {
        const newElement = this.replaceElement(elementToCopy.type, elementToReplace);
        const indexToReplace = this.elements.indexOf(elementToReplace);
        
        this.elements[indexToReplace] = newElement;

        if (elementToReplace.player) {
          newElement.setPlayer(elementToReplace.player);
        }
      }
    }
  }

  render() {
    this.context.fillStyle = BACKGROUND_COLOR;
    this.context.fillRect(0, 0, this.width, this.height);

    for (const element of this.elements) {
      element.draw();
    }

    // this.checkOverlaps();

    setTimeout(() => {
      this.render();
    }, 10);
  }

  replaceElement(type: 'rock'|'paper'|'scissors', toReplace: Element): Element {
    switch (type) {
      case 'rock':
        return new Rock(this.context, toReplace.x, toReplace.y);
      case 'paper':
        return new Paper(this.context, toReplace.x, toReplace.y);
      case 'scissors':
        return new Scissors(this.context, toReplace.x, toReplace.y);
      default:
        return new Rock(this.context, toReplace.x, toReplace.y);
    }
  }

  getOverlaps(): [Element, Element][] {
    const overlaps: [Element, Element][] = [];
    let firstIndex = 0;
    while (firstIndex < this.elements.length) {
      let secondIndex = firstIndex + 1;
      const element1 = this.elements[firstIndex];

      while (secondIndex < this.elements.length) {
        const element2 = this.elements[secondIndex];

        if (element1.overlap(element2)) {
          overlaps.push([element1, element2]);
        }
        secondIndex++;
      }

      firstIndex++;
    }

    return overlaps;
  }

  getElementByType(type: string): elementType {
    switch (type) {
      case 'rock':
        return Rock;
      case 'paper':
        return Paper;
      case 'scissors':
        return Scissors;
      default:
        return Rock;
    }
  }
}
import { ELEMENT_SIZE } from './../shared/constants.js';

export default class Player {
  constructor(id, name, type) {
    this.id = id;
    this.name = name;
    this.type = type;

    this.x = 0;
    this.y = 0;
    this.direction = null;
  }

  get xMax() {
    return (this.x + ELEMENT_SIZE / 2);
  }

  get xMin() {
    return (this.x - ELEMENT_SIZE / 2);
  }

  get yMax() {
    return (this.y + ELEMENT_SIZE / 2);
  }

  get yMin() {
    return (this.y - ELEMENT_SIZE / 2);
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

  overlap(element) {
    const overlapX = this.xMax >= element.xMin && element.xMax >= this.xMin;
    const overlapY = this.yMax >= element.yMin && element.yMax >= this.yMin;

    return overlapX && overlapY;
  }

  toJson() {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      x: this.x,
      y: this.y,
      direction: this.direction
    }
  }
}

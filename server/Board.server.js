export default class Board {
  constructor(io) {
    this.players = [];
    this.io = io;
    this.computePosition();
  }

  addPlayer(player) {
    this.players.push(player);
  }

  getPlayerById(playerId) {
    return this.players.find((player) => player.id === playerId);
  }

  removePlayerById(playerId) {
    this.players = this.players.filter((play) => play.id !== playerId);
  }

  computePosition() {
    for (const player of this.players) {
      player.computePosition();
    }

    this.checkOverlaps();

    setTimeout(() => {
      this.computePosition();
    }, 10);
  }

  isWinning(elem1, elem2) {
    return (elem1.type === 'rock') && (elem2.type === 'scissors')
      || (elem1.type === 'paper') && (elem2.type === 'rock')
      || (elem1.type === 'scissors') && (elem2.type === 'paper');
  }

  getOverlaps() {
    const overlaps = [];
    let firstIndex = 0;
    while (firstIndex < this.players.length) {
      let secondIndex = firstIndex + 1;
      const player1 = this.players[firstIndex];

      while (secondIndex < this.players.length) {
        const player2 = this.players[secondIndex];

        if (player1.overlap(player2)) {
          overlaps.push([player1, player2]);
        }
        secondIndex++;
      }

      firstIndex++;
    }

    return overlaps;
  }

  checkOverlaps() {
    for (const overlap of this.getOverlaps()) {
      let elementToCopy = null;
      let elementToReplace = null;

      if (this.isWinning(overlap[0], overlap[1])) {
        elementToCopy = overlap[0];
        elementToReplace = overlap[1];
      } else if (this.isWinning(overlap[1], overlap[0])) {
        elementToCopy = overlap[1];
        elementToReplace = overlap[0];
      }

      if (elementToCopy && elementToReplace) {
        elementToReplace.type = elementToCopy.type;
        this.io.emit('player::change-type', elementToReplace.toJson());
      }
    }
  }
}
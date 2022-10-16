import { animate, spring } from 'motion';
import { PlayerServer } from "../game/Player"

export const clearRanking = () => {
  const rankingCard = document.querySelector('#ranking-card') as HTMLElement;
  const ranking = rankingCard.querySelector('.ranking') as HTMLElement;
  ranking.innerHTML = '';
};

export const displayRanking = (players: PlayerServer[]) => {
  clearRanking();

  const app = document.querySelector('#app')!;
  const cardContainer = document.querySelector('.card-container') as HTMLElement;
  cardContainer.style.pointerEvents = 'initial';

  const overlay = document.createElement('div');
  overlay.classList.add('overlay');

  app.appendChild(overlay);

  animate(
    overlay,
    { opacity: 0.8 },
    { easing: spring() }
  );

  const rankingCard = document.querySelector('#ranking-card') as HTMLElement;
  const ranking = rankingCard.querySelector('.ranking') as HTMLElement;

  players.sort((a, b) => {
    if (a.scores.kill > b.scores.kill) {
      return -1;
    } else if (b.scores.kill > a.scores.kill) {
      return 1;
    }

    return 0;
  });

  players.forEach((player) => {
      const playerDiv = document.createElement('div');
      playerDiv.innerHTML = `
        <span>${player.name}</span>
        <span>${player.scores.kill} Kill | ${player.scores.death} Death</span>
      `;

      ranking.appendChild(playerDiv);

  });

  rankingCard.style.opacity = '0';
  rankingCard.style.display = 'block';

  animate(
    rankingCard,
    {
      opacity: [
        null,
        1
      ],
      y: [
        -100,
        0
      ]
    },
    { easing: spring() }
  );
}
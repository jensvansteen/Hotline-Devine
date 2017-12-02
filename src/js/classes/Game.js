import IntroState from './states/IntroState';
import GameState from './states/GameState';

export default class Game extends Phaser.Game {
  constructor() {
    super(1366, 768, Phaser.AUTO, `content`);
    this.state.add('Intro', IntroState);
    this.state.add('Game', GameState);
    this.state.start('Intro');
  }
};

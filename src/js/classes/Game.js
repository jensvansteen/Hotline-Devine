import GameState from './states/GameState';

export default class Game extends Phaser.Game {
  constructor() {
    super(window.screen.width, window.screen.height, Phaser.AUTO, `content`);
    this.state.add('Game', GameState);
    this.state.start('Game');
  }
};

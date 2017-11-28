export default class Wall extends Phaser.TileSprite {
  constructor(game, x, y, width, height, frames) {
    super(game, x, y, width, height, 'wall');
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.enableBody = true;
    this.body.immovable = true;
  }
}

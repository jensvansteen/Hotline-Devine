export default class Door extends Phaser.TileSprite {
  constructor(game, x, y, width, height, frames) {
    super(game, x, y, width, height, frames);
    this.anchor.setTo(0.0, 0.0);
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.enableBody = true;
    this.body.immovable = true;
  }
}

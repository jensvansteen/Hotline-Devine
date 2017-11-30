export default class PickUp extends Phaser.Sprite {
  constructor(game, x, y, frames) {
    super(game, x, y, frames);
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.enableBody = true;
    this.body.immovable = true;
  }
}

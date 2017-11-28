export default class MapObject extends Phaser.Sprite {
  constructor(game, x, y, frames) {
    super(game, x, y, frames);
    // this.anchor.setTo(0.5, 0.5);
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.enableBody = true;
    this.body.immovable = true;
  }

}

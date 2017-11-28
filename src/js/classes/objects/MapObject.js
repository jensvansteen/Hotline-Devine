export default class MapObject extends Phaser.TileSprite {
  constructor(game, x, y, width, height, frames) {
    super(game, x, y, width, height, frames);
    // this.anchor.setTo(0.5, 0.5);
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.enableBody = true;
    this.body.immovable = true;
  }
}

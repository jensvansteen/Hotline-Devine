export default class Player extends Phaser.Sprite {
  constructor(game, x, y) {
    super(game, x, y, 'player');
    this.anchor.setTo(0.5, 0.5);
    this.data.speed = 300;
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.game.physics.arcade.enableBody(this);
    this.body.collideWorldBounds = true;
  }
    

}

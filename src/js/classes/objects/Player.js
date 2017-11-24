export default class Player extends Phaser.Sprite {
  constructor(game, x, y, frames) {
    super(game, x, y, 'player');
    this.anchor.setTo(0.5, 0.5);
    this.data.speed = 200;
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.game.physics.arcade.enableBody(this);
    this.body.collideWorldBounds = true;
  }
  animation(frames){
    player.animations.add('walk');
    player.animations.play('walk', 30, true);
  }

}

export default class Player extends Phaser.Sprite {
  constructor(game, x, y, frames) {
    super(game, x, y, 'player');
    this.anchor.setTo(0.5, 0.5);
    this.data.speed = 200;
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.game.physics.arcade.enableBody(this);
    this.body.collideWorldBounds = true;
    this.animations.add('stand', [0], 10, true, true);
    this.animations.add('walk', [0,1,2,3,4,5], 10, true, true);
  }
    
  stand(){
    this.animations.play('stand');
  }
  
  walk(){
    const animation = this.animations.play('walk', 10, false);
  }

}

export default class Enemy extends Phaser.Sprite {
  constructor(game, x, y, frames) {
    super(game, x, y, 'player');
    this.anchor.setTo(0.5, 0.5);
    this.data.speed = 350;
    this.scale.setTo(2, 2);
    this.health = 10;
    // this.body.setSize(20,20);
    this.alive = true; 
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.collideWorldBounds = true;
    this.animations.add('walk', ['zombie_1.png','zombie_2.png','zombie_3.png','zombie_4.png','zombie_5.png','zombie_6.png' ], 10, true, true);
  }

  walk(){
    this.animations.play('walk');
  }

}

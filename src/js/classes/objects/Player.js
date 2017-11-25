let attack = false;
export default class Player extends Phaser.Sprite {
  constructor(game, x, y, frames) {
    super(game, x, y, 'player');
    this.anchor.setTo(0.5, 0.5);
    this.data.speed = 200;
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    // this.game.physics.arcade.enableBody(this);
    this.body.collideWorldBounds = true;
    this.animations.add('stand', ['1.png'], 10, true, true);
    this.animations.add('walk', ['1.png','2.png','3.png','4.png','5.png','6.png'], 10, true, true);
    this.animations.add('axe', ['axe_1.png','axe_2.png','axe_3.png','axe_4.png'], 10, true, true);
    // this.animations.add('walkLeft', ['7.png','8.png','9.png','10.png','11.png','12.png'], 10, true, true);
    // this.animations.add('walkUp', ['13.png','14.png','15.png','16.png','17.png','18.png'], 10, true, true);
    // this.animations.add('walkDown', ['19.png','20.png','21.png','22.png','23.png','24.png'], 10, true, true);
  }

  stand(){
    this.animations.play('stand');
  }
  axe(){
    attack = true;
    const axe = this.animations.play('axe', 10, false);
    axe.onComplete.add(() => {
      this.stand();
      attack = false;
    });

  }

  walk(){
    if(!attack){
      const animation = this.animations.play('walk', 10, false);
    }

  }


}

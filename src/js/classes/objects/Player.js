let attack = false;
export default class Player extends Phaser.Sprite {
  constructor(game, x, y) {
    super(game, x, y, `player`);
    this.anchor.setTo(0.5, 0.5);
    this.data.speed = 350;
    this.scale.setTo(2, 2);
    this.health = 100;
    this.game.physics.enable(this, Phaser.Physics.ARCADE);
    this.body.collideWorldBounds = true;
    this.animations.add(`stand`, [`1.png`], 10, true, true);
    this.animations.add(`walk`, [`walk_1.png`, `walk_2.png`, `walk_3.png`, `walk_4.png`, `walk_5.png`, `walk_6.png`, `1.png`], 20, true, true);
    this.animations.add(`axe`, [`axe_1.png`, `axe_2.png`, `axe_3.png`, `axe_4.png`], 10, true, true);
    this.animations.add(`shotgun`, [`shotgun_1.png`, `shotgun_2.png`, `shotgun_3.png`, `shotgun_4.png`], 10, true, true);
    this.animations.add(`uzi`, [`uzi_1.png`, `uzi_2.png`, `uzi_3.png`], 10, true, true);
  }

  stand() {
    attack = false;
    this.animations.play(`stand`);
  }

  shoot(type) {
    attack = true;
    const shoot = this.animations.play(type, 10, false);
    shoot.onComplete.add(() => {
      this.stand();
      attack = false;
    });
  }

  walk() {
    if (!attack) {
      const animation = this.animations.play(`walk`, 10, false);
      animation.onComplete.add(() => {
        this.stand();
        attack = false;
      });
    }
  }
}

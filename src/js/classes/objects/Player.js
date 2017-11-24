export default class Player extends Phaser.Sprite {
  constructor(game, x, y) {
    super(game, x, y, 'ryu');
    this.animations.add('stand', [0], 8, true, true);
    this.animations.add('backwards', [6,7,8,9,10,11], 8, true, true);
    this.animations.add('forwards', [12,13,14,15,16,17], 8, true, true);
    this.animations.add('jump', [18,19,20,21,22,23], 8, true, true);
    this.animations.add('shoryuken', [24,25,26,27,28,29], 8, true, true);
    this.animations.add('hadouken', [30,31,32,33,34,35], 60, true, true);
    this.animations.add('dead', [36,37,38,39,40,41], 8, true, true);
    this.animations.add('crouch', [42], 8, true, true);
    this.animations.play('stand');
  }
  stand() {
    this.animations.play('stand');
  }
  jump() {
    const animation = this.animations.play('jump', 8, false);
    animation.onComplete.add(() => this.stand());
  }
  shoot() {
    const animation = this.animations.play('hadouken', 8, false);
    animation.onComplete.add(() => this.stand());
  }
}

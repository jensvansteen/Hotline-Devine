const SPEED = 1;

export default class GameState extends Phaser.State {
  init() {
    console.log(`init`);
    this.cursors = this.input.keyboard.createCursorKeys();
  }
  preload() {
    console.log(`preload`);
    this.load.image(`star`, `assets/star.png`);
    this.load.image('ground', 'assets/platform.png');
    this.load.spritesheet('dude', 'assets/dude.png', 32, 48);
  }
  create() {
    console.log(`create`);

    this.platforms = this.add.group();
    // this.platforms.enableBody = true;

    let ledge = this.platforms.create(300, 150, 'ground');
    // ledge.body.immovable = true;
    ledge = this.platforms.create(-300, 300, 'ground');
    // ledge.body.immovable = true;
    //this.platforms.setAll('body.immovable', true);

    // this.stars = this.add.group();
    // this.stars.enableBody = true;
    // this.stars.create(350, 100, 'star');
    // this.stars.create(50, 250, 'star');

    this.player = this.add.sprite(this.game.width / 2, this.game.height / 2, 'dude');
    this.player.anchor.setTo(0.5, 0.5);
    this.player.animations.add('left', [0, 1, 2, 3], 10, true);
    this.player.animations.add('right', [5, 6, 7, 8], 10, true);

    // this.physics.arcade.enable(this.player);
    // this.player.body.collideWorldBounds = true;
    // this.player.body.gravity.y = 300;
  }
  update() {
    // this.physics.arcade.collide(this.player, this.platforms);
    // this.physics.arcade.overlap(this.player, this.stars, this.collectStar, null, this);
    //
    // this.player.body.velocity.x = 0;
    // if (this.cursors.left.isDown){
    //   this.player.body.velocity.x = -150;
    //   this.player.animations.play('left');
    // } else if (this.cursors.right.isDown){
    //   this.player.body.velocity.x = 150;
    //   this.player.animations.play('right');
    // } else{
    //   this.player.animations.stop();
    //   this.player.frame = 4;
    // }
    // if (this.cursors.up.isDown && (this.player.body.onFloor() || this.player.body.touching.down)){
    //   this.player.body.velocity.y = -350;
    // }
  }
  collectStar(player, star) {
    star.kill();
  }
  render() {
  }
}

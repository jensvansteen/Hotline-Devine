
const PLAYER_SPEED = 300;

export default class GameState extends Phaser.State {
  init() {
    console.log(`init`);
  }

  preload() {
    console.log(`preload`);
    this.load.image('map', 'assets/map.png', 2732, 1536);
    // this.load.image('player', 'assets/player.png', 75, 75);
    this.load.spritesheet('player', 'assets/player-tileset.png', 36, 50);


  }
  create() {

    this.background = this.add.tileSprite(0, 0, this.game.width, this.game.height, 'map');
    this.cursors = this.input.keyboard.createCursorKeys();

  }

  setupPlayer() {
  this.player = this.add.sprite(this.game.width / 2, this.game.height / 2, 'player');
  this.player.anchor.setTo(0.5, 0.5);
  this.player.data.speed = PLAYER_SPEED;
  this.physics.enable(this.player, Phaser.Physics.ARCADE);
  this.player.body.collideWorldBounds = true;

}
  update() {
  this.processPlayerInput();

  }

  processPlayerInput() {
  this.player.body.velocity.x = 0;
  this.player.body.velocity.y = 0;
  this.player.body.setSize(50, 20, 7, 20);

  if (this.cursors.left.isDown) {
    this.player.body.velocity.x = -this.player.data.speed;
  } else if (this.cursors.right.isDown) {
    this.player.body.velocity.x = this.player.data.speed;
  }

  if (this.cursors.up.isDown) {
    this.player.body.velocity.y = -this.player.data.speed;
  } else if (this.cursors.down.isDown) {
    this.player.body.velocity.y = this.player.data.speed;
  }

  // if (this.input.activePointer.isDown && this.physics.arcade.distanceToPointer(this.player) > 15) {
  //   this.physics.arcade.moveToPointer(this.player, this.player.data.speed);
  // }

  // if (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) ||
  //     this.input.activePointer.isDown) {
  //   this.fire();
  // }
}

  render() {}


  out() {
    // cursor verlaat button
    startButton.scale.setTo(1, 1);
  }

  over() {
    //cursor hover over button
    startButton.scale.setTo(1.1, 1.1);
  }

  startTheGame() {
    console.log('Start game');
    startButton.inputEnabled = false;

      this.setupPlayer();
  }
}

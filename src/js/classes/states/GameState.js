
import Player from '../objects/Player';
let player;

export default class GameState extends Phaser.State {
  init() {
    console.log(`init`);
  }

  preload() {
    console.log(`preload`);
    this.load.image('map', 'assets/map.png', 2732, 1536);
    // this.load.image('player', 'assets/player.png', 75, 75);
    // this.load.spritesheet('player', 'assets/player-tileset.png', 36, 50);
    this.load.atlasJSONHash('player', 'assets/json/components.png', 'assets/json/components.json');


  }
  create() {

    this.setupBackground();
    // this.setupPlayer();
    player = new Player(this.game, this.game.width / 2, this.game.height / 2);
    this.add.existing(player);
    this.cursors = this.input.keyboard.createCursorKeys();
    // player.animation();

    // player.animations.play('walk', 10, true);

  }

  setupBackground() {
    this.background = this.add.tileSprite(0, 0, this.game.width, this.game.height, 'map');
}

  update() {

  this.processPlayerInput();

  }

  processPlayerInput() {
  let distanceToPlayer = this.physics.arcade.distanceToPointer(player);
  player.rotation = this.physics.arcade.angleToPointer(player);
  player.body.velocity.x = 0;
  player.body.velocity.y = 0;
  player.body.setSize(50, 20, 7, 20);

  if (this.cursors.up.isDown) {
    // this.physics.arcade.moveToPointer(player, player.data.speed);
    // player.walk();
    if(distanceToPlayer > 10){
   console.log(`distance check`);
    this.physics.arcade.moveToPointer(player, player.data.speed);
    player.walk();
    // player.body.velocity.x = -player.data.speed;
    }
  }
  if (this.cursors.left.isDown) {
    player.axe();

  }
  // if (this.cursors.left.isDown && !this.cursors.up.isDown && !this.cursors.right.isDown && !this.cursors.down.isDown) {
  //   player.walkLeft();
  //   player.body.velocity.x = -player.data.speed;
  // } else if (this.cursors.right.isDown && !this.cursors.up.isDown && !this.cursors.left.isDown && !this.cursors.down.isDown) {
  //   player.walkRight();
  //   player.body.velocity.x = player.data.speed;
  // }
  //
  // if (this.cursors.up.isDown && !this.cursors.left.isDown && !this.cursors.right.isDown && !this.cursors.down.isDown) {
  //   player.walkUp();
  //   player.body.velocity.y = -player.data.speed;
  // } else if (this.cursors.down.isDown && !this.cursors.left.isDown && !this.cursors.right.isDown && !this.cursors.up.isDown) {
  //   player.walkDown();
  //   player.body.velocity.y = player.data.speed;
  // }
  // else {
  //   player.stand();
  // }


}

  render() {}

}


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
    this.load.spritesheet('player', 'assets/player-tileset.png', 36, 50);


  }
  create() {

    this.setupBackground();
    // this.setupPlayer();
    player = new Player(this.game, this.game.width / 2, this.game.height / 2);
    this.add.existing(player);
    this.cursors = this.input.keyboard.createCursorKeys();

  }

  setupBackground() {
    this.background = this.add.tileSprite(0, 0, this.game.width, this.game.height, 'map');
}

  update() {
  this.processPlayerInput();

  }

  processPlayerInput() {

  player.body.velocity.x = 0;
  player.body.velocity.y = 0;
  player.body.setSize(50, 20, 7, 20);

  if (this.cursors.left.isDown) {
    player.body.velocity.x = -player.data.speed;
  } else if (this.cursors.right.isDown) {
    player.body.velocity.x = player.data.speed;
  }

  if (this.cursors.up.isDown) {
    player.body.velocity.y = -player.data.speed;
  } else if (this.cursors.down.isDown) {
    player.body.velocity.y = player.data.speed;
  }


}

  render() {}

}

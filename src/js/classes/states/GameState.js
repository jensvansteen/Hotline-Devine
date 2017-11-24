let button;
let player;

export default class GameState extends Phaser.State {
  init() {
    console.log(`init`);
  }

  preload() {
    console.log(`preload`);
    this.load.image('startScreen', 'assets/start-screen.jpg');
    this.load.image('button', 'assets/buttons/start-button.png', 433, 122);
    this.load.image('map', 'assets/map.png', 2732, 1536);
    // this.load.image('player', 'assets/player.png', 75, 75);
    this.load.spritesheet('player', 'assets/player-tileset.png', 36, 50);


  }
  create() {

    this.world.setBounds(0, 0, 1366, 768);

    this.background = this.add.tileSprite(0, 0, this.game.width, this.game.height, 'startScreen');

    button = this.add.button(this.world.centerX, 697, 'button',this.startTheGame, this);
    button.anchor.setTo(0.5, 0.5);

    button.onInputOver.add(this.over, this);
    button.onInputOut.add(this.out, this);


  }
  update() {}

  render() {}


  out() {
    // cursor verlaat button
    button.scale.setTo(1, 1);
  }

  over() {
    //cursor hover over button
    button.scale.setTo(1.1, 1.1);
  }

  startTheGame() {
    console.log('Start game');
    button.inputEnabled = false;
    this.background = this.add.tileSprite(0, 0, this.game.width, this.game.height, 'map');
    // player = this.add.sprite(this.game.width / 2, this.game.height / 2, 'player', 7);
    player = this.add.sprite(this.game.width / 2, this.game.height / 2, 'player');
    player.animations.add('walk');
    player.animations.play('walk', 10, true);
  }
}

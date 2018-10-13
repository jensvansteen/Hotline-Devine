import Button from '../objects/Button';

export default class IntroState extends Phaser.State {
  init() {
    console.log(`init`);
  }

  preload() {
    console.log(`preload`);
    this.load.image(`startScreen`, `assets/start-screen.jpg`);
    this.load.image(`start-button`, `assets/GUI/start-button.png`, 433, 122);
    this.load.audio(`soundtrack`, `assets/sounds/its-safe-now.mp3`);

  }

  create() {
    const music = this.add.audio(`soundtrack`, 0.1, true);
    music.play();
    this.background = this.add.tileSprite(0, 0, this.game.width, this.game.height, `startScreen`);
    this.cursors = this.input.keyboard.createCursorKeys();


    const startButton = new Button(this.game, this.world.centerX, 697, `start-button`, this.startTheGame, this);
    startButton.onInputOver.add(this.over, this);
    startButton.onInputOut.add(this.out, this);
    this.add.existing(startButton);
  }

  update() {
  }


  render() {}


  out(button) {
    // cursor verlaat button
    button.scale.setTo(1, 1);
  }

  over(button) {
    //cursor hover over button
    button.scale.setTo(1.1, 1.1);
  }

  startTheGame(button) {
    console.log(`Start game`);
    button.inputEnabled = false;
    this.state.start(`Game`);
  }
}

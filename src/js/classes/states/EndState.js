import Button from '../objects/Button';
let points, waves;
let pointText, waveText, title;
export default class EndState extends Phaser.State {
  init() {
    console.log(`init`);
  }

  preload() {
    console.log(`preload`);
    // this.load.bitmapFont('justice', 'assets/fonts/justice/justice.png', 'assets/fonts/justice/justice.fnt');
    this.load.image('endScreen', 'assets/end-screen.jpg');
    this.load.image('restart-button', 'assets/GUI/restart-button.png', 433, 122);
    this.load.audio('soundtrack', 'assets/sounds/soundtrack.mp3');

    points = localStorage.getItem('points');
    waves = localStorage.getItem('waves');
  }

  create() {
    this.world.setBounds(0, 0, 1366, 768);

    let music = this.add.audio('soundtrack', 1,true);
    // music.play();
    music.volume = 0.1;

    this.background = this.add.tileSprite(0, 0, this.game.width, this.game.height, 'endScreen');
    this.cursors = this.input.keyboard.createCursorKeys();

    const restartButton = new Button(this.game, this.world.centerX, 697, 'restart-button', this.restartTheGame, this);
    restartButton.onInputOver.add(this.over, this);
    restartButton.onInputOut.add(this.out, this);
    this.add.existing(restartButton);

    title = this.game.add.text(0, this.game.height/4 , `Your score: `, { font: "110px justice", fill: "white", boundsAlignH: "center", boundsAlignV: "middle" });
    title.setTextBounds(0, 100, this.world.width, 100);
    title.angle = -5;
    waveText = this.game.add.text(0, this.game.height/2-100 , `${waves} `, { font: "120px justice", fill: "white", boundsAlignH: "center", boundsAlignV: "middle" });
    waveText.setTextBounds(0, 100, this.world.width, 100);
    pointText = this.game.add.text(0, this.game.height/2 , `${points} `, { font: "50px justice", fill: "white", boundsAlignH: "center", boundsAlignV: "middle" });
    pointText.setTextBounds(0, 100, this.world.width, 100);
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

  restartTheGame(button) {
    console.log('Restart game');
    button.inputEnabled = false;
    this.state.start(`Game`);
  }
}

  let button;

export default class GameState extends Phaser.State {  
  init() {
    console.log(`init`);
    this.cursors = this.input.keyboard.createCursorKeys();

    

  }
  preload() {
    console.log(`preload`);
    this.load.image('button', 'assets/buttons/start-button.png', 534, 134);

  }
  create() {
    
    this.stage.backgroundColor = '#182d3b';

    button = this.add.button(this.world.centerX - 95, 600, 'button',this.startTheGame, this, 2, 1, 0);

    button.onInputOver.add(this.over, this);
    button.onInputOut.add(this.out, this);
    button.inInputOut.add(this.up, this)

  }
  update() {}

  render() {}
  
  
  out() {
    console.log('die out dingens');
  }
  
  over() {
    console.log('button over');
  }
  
  up() {
    console.log('button over');
  }

  startTheGame() {
    console.log('Start game');
    button.inputEnabled = false;
  }
}

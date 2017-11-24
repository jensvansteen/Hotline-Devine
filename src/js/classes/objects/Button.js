export default class Button extends Phaser.Button {
  constructor(game, x, y, callback, callbackContext) {
    super(game, x, y, 'button', callback, callbackContext);
      this.anchor.setTo(0.5, 0.5);
  }
  

}
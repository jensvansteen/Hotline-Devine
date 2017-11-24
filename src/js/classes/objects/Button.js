export default class Button extends Phaser.Button {
  constructor(game, x, y, callback, callbackContext) {
    super(game, x, y, 'button', callback, callbackContext);
  }

}
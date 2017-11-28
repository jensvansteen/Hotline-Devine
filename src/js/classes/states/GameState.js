
import Player from '../objects/Player';
import Wall from '../objects/Wall';
let player;
let wall;
const wallPositions = [{name: "boven muur kotje", x: 595, y:0, width:394, height:18}, {name: "rechter muur kotje", x:971, y:0, width:18, height:209}];

export default class GameState extends Phaser.State {
  init() {
    console.log(`init`);
  }

  preload() {
    console.log(`preload`);
    this.load.image('map', 'assets/map.png', 2351, 2134);
    // this.load.image('player', 'assets/player.png', 75, 75);
    // this.load.spritesheet('player', 'assets/player-tileset.png', 36, 50);
    this.load.image('wall', 'assets/wall-01.png');
    this.load.atlasJSONHash('player', 'assets/json/components.png', 'assets/json/components.json');
  }

  create() {
    this.world.setBounds(0, 0, 2351, 2134);
    this.setupBackground();
    // this.setupPlayer();
    player = new Player(this.game, this.game.width / 2, this.game.height / 2);
    player.scale.setTo(2.2,2.2);
    this.camera.follow(player);
    this.add.existing(player);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wallGroup = this.add.group();

    // this.walls = this.add.group();
    // this.walls.enableBody = true;

    // this.walls.create(this.game.width / 2 + 100, this.game.height / 2 + 100, 'wall');

  for(let id = 0; id < wallPositions.length; id ++) {
  let pos = wallPositions[id];
  wall = new Wall(this.game, pos.x, pos.y, pos.width, pos.height);
  this.wallGroup.add(wall);
  };

  // wall = new Wall(this.game, 400, 400, 220, 22);
  //   this.add.existing(wall);

    // this.miniWall = this.add.tileSprite(400, 400, 220, 22, 'wall');
    // this.physics.enable(this.miniWall, Phaser.Physics.ARCADE);
    //   // this.miniWall.enableBody = true;
    //   // this.physics.arcade.enableBody(this.miniWall);
    //   this.miniWall.body.immovable = true;
      // this.walls.setAll('body.immovable', true);
      // this.walls.setAll('body.immovable', true);

  }

  setupBackground() {
    this.background = this.add.tileSprite(0, 0, 2351, 2134, 'map');
    // this.background.scale.setTo(2,2);
  }

  update() {
  this.physics.arcade.collide(player, this.wallGroup, this.collisionHandler, null, this);
  this.processPlayerInput();
  }

  collisionHandler() {
    console.log(`hit`);
  }

  processPlayerInput() {
  let distanceToPlayer = this.physics.arcade.distanceToPointer(player);
  player.rotation = this.physics.arcade.angleToPointer(player);
  player.body.velocity.x = 0;
  player.body.velocity.y = 0;
  // player.body.setSize(50, 20, 7, 20);
  // this.blackPlayer.body.velocity.x = 0;
  // this.blackPlayer.body.velocity.y = 0;
  // this.blackPlayer.body.setSize(50, 20, 7, 20);

  if (this.cursors.up.isDown) {
    // this.physics.arcade.moveToPointer(this.blackPlayer, player.data.speed);
    // player.walk();
    if(distanceToPlayer > 10){
    this.physics.arcade.moveToPointer(player, player.data.speed);
    player.walk();
    // player.body.velocity.x = -player.data.speed;
    }
  }

  if (this.cursors.left.isDown) {
    player.axe();
  }

  // if (this.cursors.left.isDown && !this.cursors.up.isDown && !this.cursors.right.isDown && !this.cursors.down.isDown) {
  //   player.walk();
  //   player.body.velocity.x = -player.data.speed;
  // } else if (this.cursors.right.isDown && !this.cursors.up.isDown && !this.cursors.left.isDown && !this.cursors.down.isDown) {
  //   player.walk();
  //   player.body.velocity.x = player.data.speed;
  // }
  //
  // if (this.cursors.up.isDown && !this.cursors.left.isDown && !this.cursors.right.isDown && !this.cursors.down.isDown) {
  //   player.walk();
  //   player.body.velocity.y = player.data.speed;
  // } else if (this.cursors.down.isDown && !this.cursors.left.isDown && !this.cursors.right.isDown && !this.cursors.up.isDown) {
  //   player.walk();
  //   player.body.velocity.y = -player.data.speed;
  // }
  // else{
  //   player.stand();
  // }
}

  render() {}

}

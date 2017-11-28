
import Player from '../objects/Player';
import Wall from '../objects/Wall';
import MapObject from '../objects/MapObject';
let player;
let walls;
let mapObjects;

const wallPositions = [{name: "boven muur kotje", x: 595, y:0, width:394, height:18}, {name: "rechter muur kotje", x:971, y:0, width:18, height:209}];

export default class GameState extends Phaser.State {
  init() {
    console.log(`init`);
  }

  preload() {
    console.log(`preload`);
    this.load.image('map', 'assets/map.png', 2351, 2134);

    this.load.image('wall', 'assets/wall-01.png');
    this.load.json('objects', 'assets/json/map.json')
    this.load.image('table-01', 'assets/objects/table-01.png');
    this.load.image('table-02', 'assets/objects/table-02.png');
    this.load.image('macbook', 'assets/objects/macbook.png');
    this.load.atlasJSONHash('player', 'assets/json/components.png', 'assets/json/components.json');
  }

  create() {
    this.world.setBounds(0, 0, 2351, 2134);
    // fetch(`./assets/json/map.json`).then(r => r.json()).then(this.parse,this);
  
    

    this.setupBackground();
    


    // this.setupPlayer();
    player = new Player(this.game, this.game.width / 2, this.game.height / 2);
    player.scale.setTo(2,2);
    this.camera.follow(player);
    this.add.existing(player);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wallGroup = this.add.group();
    this.mapObjectGroup = this.add.group();
    let tempObjects = this.game.cache.getJSON('objects');
    walls = Array.from(tempObjects.walls);
    mapObjects = Array.from(tempObjects.objects);
    this.setupWalls();
    this.setupMapObjects();
    

  }
    
  

setupWalls() {
  walls.forEach(wall => {
        wall = new Wall(this.game, wall.x, wall.y, wall.width, wall.height);
        this.wallGroup.add(wall);
      }
      )
}


setupMapObjects() {
  mapObjects.forEach(object => {
    object = new MapObject(this.game, object.x, object.y, object.picture);
    console.log(object);
    this.mapObjectGroup.add(object);
  }
)
}


  setupBackground() {
    this.background = this.add.tileSprite(0, 0, 2351, 2134, 'map');
    // this.background.scale.setTo(2,2);
  }

  update() {
  this.physics.arcade.collide(player, this.wallGroup, this.collisionHandler, null, this);
  this.physics.arcade.collide(player, this.mapObjectGroup, this.collisionHandler, null, this);
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

  if (this.cursors.up.isDown) {
    // this.physics.arcade.moveToPointer(this.blackPlayer, player.data.speed);
    // player.walk();
    if(distanceToPlayer > 10){
    this.physics.arcade.moveToPointer(player, player.data.speed);
    player.walk();
    // player.body.velocity.x = -player.data.speed;
    }
  }

  if (this.cursors.right.isDown) {
    player.shoot('axe');
  }
  if (this.cursors.right.isDown) {
    player.shoot('gun');
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

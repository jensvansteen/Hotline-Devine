
import Player from '../objects/Player';
import Wall from '../objects/Wall';
import MapObject from '../objects/MapObject';
import PickUp from '../objects/PickUp';
let player;
let walls, mapObjects, pickUps;
let shotgun, uzi;
let weapon = 'uzi';

export default class GameState extends Phaser.State {
  init() {
    console.log(`init`);
  }

  preload() {
    console.log(`preload`);
    this.load.image('map', 'assets/map.png', 2351, 2134);
    this.load.image('wall-01', 'assets/wall-01.png');
    this.load.image('wall-02', 'assets/wall-02.png');
    this.load.json('objects', 'assets/json/map.json');
    this.load.image('wood-table-horizontal', 'assets/objects/wood-table-horizontal.png');
    this.load.image('wood-table-vertical', 'assets/objects/wood-table-vertical.png');
    this.load.image('black-table-horizontal', 'assets/objects/black-table-horizontal.png');
    this.load.image('black-table-vertical', 'assets/objects/black-table-vertical.png');
    this.load.image('bureau-horizontal', 'assets/objects/bureau-horizontal.png');
    this.load.image('bureau-vertical', 'assets/objects/bureau-vertical.png');
    this.load.image('lobby-table-horizontal', 'assets/objects/lobby-table-horizontal.png');
    this.load.image('pingpong', 'assets/objects/pingpong.png');
    this.load.image('kicker', 'assets/objects/kicker.png');
    this.load.image('kast-medium-horizontal', 'assets/objects/kast-medium-horizontal.png');
    this.load.image('stair-01', 'assets/objects/stairs-01.png');
    this.load.image('stair-02', 'assets/objects/stairs-02.png');
    this.load.image('macbook-horizontal', 'assets/objects/macbook-horizontal.png');
    this.load.image('plant', 'assets/objects/plant.png');
    this.load.image('bullet', 'assets/bullet.png');
    this.load.image('shotgun', 'assets/pickups/shotgun.png');
    this.load.image('uzi', 'assets/pickups/uzi.png');
    this.load.atlasJSONHash('player', 'assets/json/components.png', 'assets/json/components.json');
  }

  create() {
    this.world.setBounds(0, 0, 2351, 2134);

    this.setupBackground();
    // this.setupPlayer();


    this.wallGroup = this.add.group();
    this.mapObjectGroup = this.add.group();
    this.pickUpGroup = this.add.group();
    let tempObjects = this.game.cache.getJSON('objects');
    walls = Array.from(tempObjects.walls);
    mapObjects = Array.from(tempObjects.objects);
    pickUps = Array.from(tempObjects.pickups);
    this.setupWalls();
    this.setupMapObjects();
    this.setupPickUps();

    player = new Player(this.game, 900, 1068);
    player.scale.setTo(2,2);
    this.camera.follow(player);
    this.add.existing(player);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.setupWeapons();

  };

  setupWalls() {
  walls.forEach(wall => {
        wall = new Wall(this.game, wall.x, wall.y, wall.width, wall.height,wall.type );
        this.wallGroup.add(wall);
      })
  };

  setupMapObjects() {
    mapObjects.forEach(object => {
      object = new MapObject(this.game, object.x, object.y, object.width, object.height, object.picture);
      // console.log(object);
      this.mapObjectGroup.add(object);
    })
  };

  setupPickUps() {
    pickUps.forEach(pickup => {
      pickup = new PickUp(this.game, pickup.x, pickup.y, pickup.picture);
      this.pickUpGroup.add(pickup);
    })
  };

  setupWeapons(){
    shotgun = this.game.add.weapon(10, 'bullet');
    shotgun.bulletSpeed = 600;
    shotgun.fireRate = 500;
    shotgun.trackSprite(player, 5, 5, true);

    uzi = this.game.add.weapon(30, 'bullet');
    uzi.bulletSpeed = 500;
    uzi.fireRate = 100;
    uzi.trackSprite(player, 30, -5, true);
  };



  setupBackground() {
    this.background = this.add.tileSprite(0, 0, 2351, 2134, 'map');
  };

  update() {
    this.physics.arcade.collide(player, this.wallGroup, this.collisionHandler, null, this);
    this.physics.arcade.collide(player, this.mapObjectGroup, this.collisionHandler, null, this);
    this.processPlayerInput();

    uzi.bullets.forEach(bullet =>{
      this.physics.arcade.overlap(bullet, this.wallGroup, this.bulletWallHandler, null, this);
    });
    shotgun.bullets.forEach(bullet =>{
      this.physics.arcade.overlap(bullet, this.wallGroup, this.bulletWallHandler, null, this);
    });

    this.physics.arcade.overlap(player, this.pickUpGroup, this.playerPickupHandler, null, this);

    // pickUps.forEach(pickup =>{
      // console.log(pickup);
      // this.physics.arcade.overlap(pickup, player, this.playerPickupHandler, null, this);
  //   });

  };

  playerPickupHandler(player) {
    // console.log(player.x);
    this.pickUpGroup.forEach(pickup => {
      if(Phaser.Math.distance(pickup.position.x, pickup.position.y, player.x, player.y) < 60){
        // console.log(pickup.key);
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
          weapon = pickup.key;
          console.log(weapon);
        }
      }
    });

      // console.log(pickup);
      // // if (this.cursors.down.isDown) {
      // //   weapon = pickup.name;
      // // };
  };

  collisionHandler() {
    // console.log(`hit`);
  };

  bulletWallHandler(bullet) {
    // console.log('bullet hit wall');
    bullet.kill();
  };


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

  // if (this.cursors.left.isDown) {
  //   player.shoot('axe');
  // }
  if (this.game.input.activePointer.isDown)
    {
    player.shoot(weapon);
    if(weapon === 'uzi'){
      uzi.fire();
    }
    if(weapon === 'shotgun'){
      shotgun.fire();
    }
    }
  // if (this.cursors.right.isDown) {
  //   player.shoot('gun');
  // }
  // old walking mechanics
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

import Player from '../objects/Player';
import Wall from '../objects/Wall';
import MapObject from '../objects/MapObject';
import Enemy from '../objects/Enemy';
let player;
let walls;
let mapObjects;
let numEnemys = 10;

export default class GameState extends Phaser.State {
  init() {
    console.log(`init`);
  }

  preload() {
    console.log(`preload`);
    this.load.image('map', 'assets/map.png', 2351, 2134);
    this.load.image('wall-01', 'assets/wall-01.png');
    this.load.image('wall-02', 'assets/wall-02.png');
    this.load.json('objects', 'assets/json/map.json')
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
    this.load.atlasJSONHash('player', 'assets/json/components.png', 'assets/json/components.json');
  }

  create() {
    this.world.setBounds(0, 0, 2351, 2134);

    this.setupBackground();

    // this.setupPlayer();
    player = new Player(this.game, 900, 1068);
    this.camera.follow(player);
    this.add.existing(player);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wallGroup = this.add.group();
    this.mapObjectGroup = this.add.group();
    this.enemyPool = this.add.group();
    let tempObjects = this.game.cache.getJSON('objects');
    walls = Array.from(tempObjects.walls);
    mapObjects = Array.from(tempObjects.objects);
    this.setupWalls();
    this.setupMapObjects();
    this.setupEnemies();
  };

  setupEnemies() {
    for (let i = 0; i < numEnemys; i++) {
      let tempEnemy = i;
      tempEnemy = new Enemy(this.game, this.game.rnd.integerInRange(50, this.background.width - 50), this.game.rnd.integerInRange(50, this.background.height - 50));
      this.checkDistanceWithPlayer(player, tempEnemy);
      // console.log(Phaser.Math.distance(tempEnemy.x, tempEnemy.y, player.x, player.y));
      this.enemyPool.add(tempEnemy);
      this.anotherCheck();

      this.checkEnemyWallOverlap();

    }
    // let enemyi = new Enemy(this.game, this.game.rnd.integerInRange(50, this.game.width - 50), this.game.rnd.integerInRange(50, this.game.height - 50));
    //
    // this.enemyPool.createMultiple(20, enemyi);
    //

  };

  setupWalls() {
    walls.forEach(wall => {
      wall = new Wall(this.game, wall.x, wall.y, wall.width, wall.height, wall.type);
      this.wallGroup.add(wall);
    })
  };

  checkEnemyWallOverlap() {
    this.physics.arcade.overlap(this.wallGroup, this.enemyPool, this.enemyWallOverlap, null, this);
    this.physics.arcade.overlap(this.mapObjectGroup, this.enemyPool, this.enemyWallOverlap, null, this);
  }

  setupMapObjects() {
    mapObjects.forEach(object => {
      object = new MapObject(this.game, object.x, object.y, object.width, object.height, object.picture);
      // console.log(object);
      this.mapObjectGroup.add(object);
    })
  };

  setupBackground() {
    this.background = this.add.tileSprite(0, 0, 2351, 2134, 'map');
  };

  enemyWallOverlap(player, enemy) {
    // console.log(enemy);
    enemy.reset(this.game.rnd.integerInRange(50, this.background.width - 50), this.game.rnd.integerInRange(50, this.background.height - 50), 10);
    this.checkDistanceWithPlayer(player, enemy);
    this.checkEnemyWallOverlap();

  };
  
  anotherCheck() {
      
      
         this.enemyPool.forEach(enemy => {
           console.log(enemy)

           // this.checkDistanceWithPlayer(player, enemy);
           if (Phaser.Math.distance(enemy.x, enemy.y, player.x, player.y) < 800){
              enemy.reset(this.game.rnd.integerInRange(50, this.background.width - 50), this.game.rnd.integerInRange(50, this.background.height - 50), 10);
                this.checkDistanceWithPlayer(player, enemy);
     }
         });
    
  }


  spawnEnemies() {

    this.enemyPool.forEach(enemy => {

      // this.checkDistanceWithPlayer(player, enemy);
      if(enemy.alive && Phaser.Math.distance(enemy.x, enemy.y, player.x, player.y) < 400){
      let angle = this.game.physics.arcade.angleBetween(enemy, player);
      enemy.rotation = angle;
      this.game.physics.arcade.moveToObject(enemy, player, 200);
    }
      // console.log(Phaser.Math.distance(enemy.x, enemy.y, player.x, player.y));
      enemy.walk();
      // console.log(Phaser.Math.distance(enemy.x, enemy.y, player.x, player.y));

    });
  }

  checkDistanceWithPlayer(player, enemy) {

    if (Phaser.Math.distance(enemy.x, enemy.y, player.x, player.y) < 800) {
       enemy.reset(this.game.rnd.integerInRange(50, this.background.width - 50), this.game.rnd.integerInRange(50, this.background.height - 50), 10);
      this.checkDistanceWithPlayer(player, enemy);
    }

  }

  update() {
    this.physics.arcade.collide(player, this.wallGroup, this.collisionHandler, null, this);
    this.physics.arcade.collide(player, this.mapObjectGroup, this.collisionHandler, null, this);
    this.physics.arcade.collide(player, this.enemyPool, this.enemyPlayerCollision, null, this);

    this.spawnEnemies();
    this.processPlayerInput();
    // console.log(this.enemyPool.length);
  };

  collisionHandler() {
    console.log(`hit`);
  };
  
  enemyPlayerCollision() {
    player.damage(1);
    player.body.bounce.setTo(1.1);
    console.log(player.health);
  }

  processPlayerInput() {
    let distanceToPlayer = this.physics.arcade.distanceToPointer(player);
    player.rotation = this.physics.arcade.angleToPointer(player);
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;

    if (this.cursors.up.isDown) {
      // this.physics.arcade.moveToPointer(this.blackPlayer, player.data.speed);
      // player.walk();
      if (distanceToPlayer > 10) {
        this.physics.arcade.moveToPointer(player, player.data.speed);
        player.walk();
        // player.body.velocity.x = -player.data.speed;
      }
    }

    if (this.cursors.left.isDown) {
      player.shoot('axe');
    }
    if (this.cursors.right.isDown) {
      player.shoot('gun');
    }
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

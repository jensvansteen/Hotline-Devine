import Player from '../objects/Player';
import Wall from '../objects/Wall';
import MapObject from '../objects/MapObject';
import Enemy from '../objects/Enemy';
import PickUp from '../objects/PickUp';
let player;
let walls,
  mapObjects,
  pickUps,
  opvul;
let numEnemys = 10;
let shotgun,
  uzi;
let weapon = 'none';
let firstRender;
let wave = 1;
const firstPlayerX = 900;
const firstPlayerY = 1060;

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
    this.load.image('axe', 'assets/pickups/axe.png');
    this.load.atlasJSONHash('player', 'assets/json/components.png', 'assets/json/components.json');
  }

  create() {
    this.world.setBounds(0, 0, 2351, 2134);

    firstRender = true;
    this.setupBackground();
    this.wallGroup = this.add.group();
    this.opvulGroup = this.add.group();
    this.mapObjectGroup = this.add.group();
    this.pickUpGroup = this.add.group();
    this.enemyPool = this.add.group();
    let tempObjects = this.game.cache.getJSON('objects');
    walls = Array.from(tempObjects.walls);
    mapObjects = Array.from(tempObjects.objects);
    pickUps = Array.from(tempObjects.pickups);
    opvul = Array.from(tempObjects.opvul);
    this.setupWalls();
    this.setupMapObjects();
    this.setupOpvul();

    player = new Player(this.game, firstPlayerX, firstPlayerY);
    this.camera.follow(player);
    this.add.existing(player);
    this.cursors = this.input.keyboard.createCursorKeys();

    this.setupEnemies();
    this.setupPickUps();
    this.setupWeapons();
  };

  setupEnemies() {
    for (let i = 0; i < numEnemys; i++) {
      let tempEnemy = i;
      tempEnemy = new Enemy(this.game, this.game.rnd.integerInRange(50, this.background.width - 50), this.game.rnd.integerInRange(50, this.background.height - 50));
      this.checkDistanceWithCamera(tempEnemy);
      this.enemyPool.add(tempEnemy);
      this.checkEnemyWallOverlap();
      if (i === numEnemys-1) {
        firstRender = false;
      };
    }

  };

  setupWalls() {
    walls.forEach(wall => {
      wall = new Wall(this.game, wall.x, wall.y, wall.width, wall.height, wall.type);
      this.wallGroup.add(wall);
    })
  };
  
  setupOpvul() {
    opvul.forEach(vlak => {
      vlak = new Wall(this.game, vlak.x, vlak.y, vlak.width, vlak.height, vlak.type);
      vlak.visible = false;
      this.opvulGroup.add(vlak);
      console.log(this.opvulGroup);
    })
  }

  checkEnemyWallOverlap() {
    this.physics.arcade.overlap(this.wallGroup, this.enemyPool, this.enemyWallOverlap, null, this);
    this.physics.arcade.overlap(this.mapObjectGroup, this.enemyPool, this.enemyWallOverlap, null, this);
    this.physics.arcade.overlap(this.opvulGroup, this.enemyPool, this.enemyWallOverlap, null, this);
  }

  setupMapObjects() {
    mapObjects.forEach(object => {
      object = new MapObject(this.game, object.x, object.y, object.width, object.height, object.picture);
      this.mapObjectGroup.add(object);
    })
  };

  setupPickUps() {
    pickUps.forEach(pickup => {
      pickup = new PickUp(this.game, pickup.x, pickup.y, pickup.picture);
      this.pickUpGroup.add(pickup);
    })
  };

  setupWeapons() {
    shotgun = this.game.add.weapon(10, 'bullet');
    shotgun.bulletSpeed = 600;
    shotgun.fireRate = 500;
    shotgun.trackSprite(player, 5, 5, true);

    uzi = this.game.add.weapon(30, 'bullet');
    uzi.bulletSpeed = 800;
    uzi.fireRate = 100;
    uzi.trackSprite(player, 30, -5, true);
  };

  setupBackground() {
    this.background = this.add.tileSprite(0, 0, 2351, 2134, 'map');
  };

  enemyWallOverlap(object, enemy) {
    enemy.reset(this.game.rnd.integerInRange(50, this.background.width - 50), this.game.rnd.integerInRange(50, this.background.height - 50), 10);
    this.checkDistanceWithCamera(enemy);
    this.checkEnemyWallOverlap();
  };

  spawnEnemies() {

    this.enemyPool.forEach(enemy => {

      if (enemy.alive && Phaser.Math.distance(enemy.x, enemy.y, player.x, player.y) < 400) {
        enemy.enemyFolow = true;
        let angle = this.game.physics.arcade.angleBetween(enemy, player);
        enemy.rotation = angle;
        this.game.physics.arcade.moveToObject(enemy, player, 200);

      }

      if (enemy.alive && Phaser.Math.distance(enemy.x, enemy.y, player.x, player.y) > 600) {
        enemy.enemyFolow = false;
        enemy.rotation = 90;

      }

      if (!enemy.alive) {
        this.enemyPool.remove(enemy);
      }

      if (this.enemyPool.length === 0) {
        wave++;
        this.startNewWave();
      }

      enemy.walk();

    });
  }

  startNewWave() {
    numEnemys += wave * 5;
    console.log(wave);
    console.log("wave 1 done");
    this.setupEnemies();
  }

  checkDistanceWithCamera(enemy) {
    
    
    console.log(firstRender);

    const cameraInitX = (this.camera.width - firstPlayerX) / 2;
    const cameraInitY = firstPlayerY - this.camera.height / 2;
    // console.log(cameraInitX);
    // console.log(cameraInitY);

    if (enemy.x > cameraInitX && enemy.x < cameraInitX + this.camera.width && enemy.y > cameraInitY && enemy.y < cameraInitY + this.camera.height && firstRender) {
      enemy.reset(this.game.rnd.integerInRange(30, this.background.width - 30), this.game.rnd.integerInRange(30, this.background.height - 30), 10);
      this.checkDistanceWithCamera(enemy);
    }

    if (enemy.x > this.camera.x && enemy.x < this.camera.x + this.camera.width && enemy.y > this.camera.y && enemy.y < this.camera.y + this.camera.height && !firstRender) {
      enemy.reset(this.game.rnd.integerInRange(30, this.background.width - 30), this.game.rnd.integerInRange(30, this.background.height - 30), 10);
      this.checkDistanceWithCamera(enemy);
    }

  }

  update() {
    this.physics.arcade.collide(player, this.wallGroup, this.collisionHandler, null, this);
    this.physics.arcade.overlap(player, this.wallGroup, this.overlapHandler, null, this);

    this.physics.arcade.collide(player, this.mapObjectGroup, this.collisionHandler, null, this);
    this.physics.arcade.overlap(player, this.mapObjectGroup, this.overlapHandler, null, this);

    this.physics.arcade.collide(player, this.enemyPool, this.enemyPlayerCollision, null, this);
    this.physics.arcade.collide(this.enemyPool, this.wallGroup, this.changeEnemyDirection, null, this);
    this.physics.arcade.collide(this.enemyPool, this.mapObjectGroup, this.changeEnemyDirection, null, this);

    this.spawnEnemies();
    this.processPlayerInput();
    // console.log(this.enemyPool.length);
    uzi.bullets.forEach(bullet => {
      this.physics.arcade.overlap(bullet, this.wallGroup, this.bulletWallHandler, null, this);
      this.physics.arcade.overlap(bullet, this.enemyPool, this.calculateDamageEnemy, null, this);
    });
    shotgun.bullets.forEach(bullet => {
      this.physics.arcade.overlap(bullet, this.wallGroup, this.bulletWallHandler, null, this);
      this.physics.arcade.overlap(bullet, this.enemyPool, this.calculateDamageEnemy, null, this);
    });

    this.physics.arcade.overlap(player, this.pickUpGroup, this.playerPickupHandler, null, this);

  };

  playerPickupHandler(player, weaponSprite) {
    // console.log(player.x);
    this.pickUpGroup.forEach(pickup => {
      // console.log(pickup);
      if (Phaser.Math.distance(pickup.position.x, pickup.position.y, player.x, player.y) < 100) {
        // console.log(pickup.key);
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
          weapon = pickup.key;
          weaponSprite.kill();
          console.log(weapon);
        }
      }
    });

  };

  calculateDamageEnemy(bullet, enemy) {
    bullet.kill();
    if (weapon === 'uzi') {
      enemy.damage(3);
    } else if (weapon === 'shotgun') {
      enemy.damage(10);
    }

  }

  overlapHandler() {
    player.x -= 10;
    player.y -= 10;
  }

  collisionHandler() {
    // console.log(`hit`);
  };

  changeEnemyDirection(enemy, object) {
    if (enemy.enemyFolow) {
      if (enemy.x > object.x) {
        enemy.body.velocity.setTo(40, 0);
      }
    }
  }

  bulletWallHandler(bullet) {
    bullet.kill();
  };

  enemyPlayerCollision() {
    player.damage(1);
    player.body.bounce.setTo(1.1);
  }

  processPlayerInput() {
    let distanceToPlayer = this.physics.arcade.distanceToPointer(player);
    player.rotation = this.physics.arcade.angleToPointer(player);
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;

    if (this.cursors.up.isDown) {
      if (distanceToPlayer > 10) {
        this.physics.arcade.moveToPointer(player, player.data.speed);
        player.walk();
      }
    }

    if (this.game.input.activePointer.isDown) {
      if (weapon != 'none') {
        player.shoot(weapon);

        if (weapon === 'uzi') {
          uzi.fire();
        }
        if (weapon === 'shotgun') {
          shotgun.fire();
        }
      }
    };
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

  render() {
    // this.game.debug.spriteInfo(player, 32, 32);
  }
}

import Player from '../objects/Player';
import Wall from '../objects/Wall';
import MapObject from '../objects/MapObject';
import Enemy from '../objects/Enemy';
import PickUp from '../objects/PickUp';
import Door from '../objects/Door';
let player;
let walls,
  mapObjects,
  pickUps,
  opvul,
  rooms,
  doors;
let numEnemys;
let shotgun,
  uzi;
let weapon = `none`;
let firstRender;
let wave = 1;
const firstPlayerX = 300;
const firstPlayerY = 1860;
let waveText,
  pointText,
  enemyText,
  weaponInSlot,
  healthBar;
let points = 0;
let uziSound,
  shotgunSound,
  zombieSound,
  pickupSound;

export default class GameState extends Phaser.State {
  init() {
    console.log(`init`);
    //reset waarden als de game word gerestart
    weapon = `none`;
    points = 0;
    wave = 1;
    localStorage.removeItem(`points`);
    localStorage.removeItem(`waves`);
  }

  preload() {
    console.log(`preload`);
    //inladen van alles assets: audio, json, images
    this.load.bitmapFont(`justice`, `assets/fonts/justice/justice.png`, `assets/fonts/justice/justice.fnt`);

    this.load.audio(`zombie-growl`, `assets/sounds/zombie.mp3`);
    this.load.audio(`wave-ping`, `assets/sounds/wave.mp3`);
    this.load.audio(`shotgun-sound`, `assets/sounds/shotgun-sound.mp3`);
    this.load.audio(`uzi-sound`, `assets/sounds/uzi-sound.mp3`);
    this.load.audio(`pickup-sound`, `assets/sounds/pickup-sound.mp3`);

    this.load.image(`map`, `assets/map.png`, 2351, 2134);
    this.load.image(`weapon-slot`, `assets/GUI/slot.png`);
    this.load.image(`healthbar`, `assets/GUI/healthbar.png`);
    this.load.image(`wall-01`, `assets/wall-01.png`);
    this.load.image(`wall-02`, `assets/wall-02.png`);
    this.load.image(`wall-03`, `assets/wall-03.png`);
    this.load.image(`door`, `assets/door.png`);
    this.load.json(`objects`, `assets/json/map.json`);

    this.load.image(`wood-table-horizontal`, `assets/objects/wood-table-horizontal.png`);
    this.load.image(`wood-table-vertical`, `assets/objects/wood-table-vertical.png`);
    this.load.image(`black-table-horizontal`, `assets/objects/black-table-horizontal.png`);
    this.load.image(`black-table-vertical`, `assets/objects/black-table-vertical.png`);
    this.load.image(`bureau-horizontal`, `assets/objects/bureau-horizontal.png`);
    this.load.image(`bureau-vertical`, `assets/objects/bureau-vertical.png`);
    this.load.image(`lobby-table-horizontal`, `assets/objects/lobby-table-horizontal.png`);
    this.load.image(`pingpong`, `assets/objects/pingpong.png`);
    this.load.image(`kicker`, `assets/objects/kicker.png`);
    this.load.image(`kast-medium-horizontal`, `assets/objects/kast-medium-horizontal.png`);
    this.load.image(`kast-medium-vertical`, `assets/objects/kast-medium-vertical.png`);
    this.load.image(`stair-01`, `assets/objects/stairs-01.png`);
    this.load.image(`stair-02`, `assets/objects/stairs-02.png`);
    this.load.image(`elevator`, `assets/objects/elevator-01.png`);
    this.load.image(`macbook-horizontal`, `assets/objects/macbook-horizontal.png`);
    this.load.image(`plant`, `assets/objects/plant.png`);
    this.load.image(`bullet`, `assets/bullet.png`);

    this.load.image(`shotgun`, `assets/pickups/shotgun.png`);
    this.load.image(`uzi`, `assets/pickups/uzi.png`);
    this.load.image(`axe`, `assets/pickups/axe.png`);
    this.load.image(`medic`, `assets/pickups/medic.png`);
    this.load.image(`dead1`, `assets/dead1.png`);
    this.load.image(`dead2`, `assets/dead2.png`);
    this.load.image(`dead3`, `assets/dead3.png`);
    this.load.atlasJSONHash(`player`, `assets/json/components.png`, `assets/json/components.json`);
  }

  create() {
    this.world.setBounds(0, 0, 2351, 2134);
    numEnemys = 10;

    //Groepen maken voor elke json object
    const tempObjects = this.game.cache.getJSON(`objects`);
    walls = Array.from(tempObjects.walls);
    mapObjects = Array.from(tempObjects.objects);
    pickUps = Array.from(tempObjects.pickups);
    opvul = Array.from(tempObjects.opvul);
    rooms = Array.from(tempObjects.rooms);
    doors = Array.from(tempObjects.doors);

    firstRender = true;

    // this.setupRooms();
    this.roomGroup = this.add.group();
    this.setupBackground();
    this.setupRooms();
    this.doorGroup = this.add.group();
    this.wallGroup = this.add.group();
    this.opvulGroup = this.add.group();
    this.mapObjectGroup = this.add.group();
    this.enemyPool = this.add.group();
    this.deadEnemies = this.add.group();
    this.pickUpGroup = this.add.group();

    //aanamaken van de verschillende functies
    this.setupDoors();
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
    this.setupGUI();

    uziSound = this.add.audio(`uzi-sound`, 0.2, false);
    shotgunSound = this.add.audio(`shotgun-sound`, 0.2, false);
    zombieSound = this.add.audio(`zombie-growl`, 0.1, false);
    pickupSound = this.add.audio(`pickup-sound`, 0.2, false);
  }

  setupEnemies() {
    //enemies aanmaken en checken op welke plaats hij spawnt
    for (let i = 0;i < numEnemys;i ++) {
      let tempEnemy = i;
      tempEnemy = new Enemy(this.game, this.game.rnd.integerInRange(50, this.background.width - 50), this.game.rnd.integerInRange(50, this.background.height - 50));
      this.checkDistanceWithCamera(tempEnemy);
      this.initDirectionEnemy(tempEnemy);
      this.checkEnemyWallOverlap();
      this.enemyPool.add(tempEnemy);
      if (i === numEnemys - 1) {
        firstRender = false;
      }
    }
  }

  setupRooms() {
    //kamer id's opstellen, dit helpt om te checken of de zombies de player zien
    rooms.forEach(room => {
      const newRoom = new MapObject(this.game, room.x, room.y, room.width, room.height, room.picture);
      newRoom.id = room.id;
      console.log(newRoom.id);
      this.roomGroup.add(newRoom);
    });
  }

  setupDoors() {
    doors.forEach(door => {
      const newDoor = new Door(this.game, door.x, door.y, door.width, door.height, `door`);
      newDoor.closed = true;
      newDoor.dir = door.dir;
      this.doorGroup.add(newDoor);
    });
  }

  setupWalls() {
    //walls uit json file halen met coordinaten en hoogte en breedte
    walls.forEach(wall => {
      wall = new Wall(this.game, wall.x, wall.y, wall.width, wall.height, wall.type);
      this.wallGroup.add(wall);
    });
  }

  setupOpvul() {
    //dit zijn ruimte die uit de json komen om te voorzorgen dat zombies buiten de map spawnen
    opvul.forEach(vlak => {
      vlak = new Wall(this.game, vlak.x, vlak.y, vlak.width, vlak.height, vlak.type);
      this.opvulGroup.add(vlak);
    });
  }

  checkEnemyWallOverlap() {
    //dit checkt of er een zombie met een wall overlapt
    this.physics.arcade.overlap(this.wallGroup, this.enemyPool, this.enemyWallOverlap, null, this);
    this.physics.arcade.overlap(this.mapObjectGroup, this.enemyPool, this.enemyWallOverlap, null, this);
    this.physics.arcade.overlap(this.opvulGroup, this.enemyPool, this.enemyWallOverlap, null, this);
  }

  setupMapObjects() {
    //objects die uit json file komen en op de map worden geplaatst
    mapObjects.forEach(object => {
      object = new MapObject(this.game, object.x, object.y, object.width, object.height, object.picture);
      this.mapObjectGroup.add(object);
    });
  }

  setupPickUps() {
    //het plaatsen op de map van pickups (zoals axe)
    pickUps.forEach(pickup => {
      pickup = new PickUp(this.game, pickup.x, pickup.y, pickup.picture);
      this.pickUpGroup.add(pickup);
    });
  }

  setupWeapons() {
    //setup van de wapens, bullet speed, fire rate
    shotgun = this.game.add.weapon(10, `bullet`);
    shotgun.bulletSpeed = 600;
    shotgun.fireRate = 500;
    shotgun.trackSprite(player, 5, 5, true);

    uzi = this.game.add.weapon(30, `bullet`);
    uzi.bulletSpeed = 800;
    uzi.fireRate = 100;
    uzi.trackSprite(player, 30, - 5, true);
  }

  setupGUI() {
    // Graphical User Interface voor de game, zoals health, waves, score, hoeveel zombies er nog zijn in de wave, welk wapen je vast hebt
    waveText = this.add.text(this.camera.width - 50, 580, `1 `, {
      font: `80px justice`,
      fill: `white`,
      boundsAlignH: `right`,
      boundsAlignV: `middle`
    });
    waveText.setTextBounds(0, 0, 0, 0);
    pointText = this.add.text(this.camera.width - 50, 640, `0 `, {
      font: `60px justice`,
      fill: `white`,
      boundsAlignH: `right`,
      boundsAlignV: `middle`
    });
    pointText.setTextBounds(0, 0, 0, 0);
    enemyText = this.add.text(10, 5, `${this.enemyPool.length}/${numEnemys} `, {
      font: `60px justice`,
      fill: `white`
    });
    waveText.fixedToCamera = true;
    pointText.fixedToCamera = true;
    enemyText.fixedToCamera = true;

    healthBar = this.game.add.tileSprite(1040, 680, player.health * 3, 35, `healthbar`);
    healthBar.fixedToCamera = true;

    const weaponSlot = this.game.add.image(80, 680, `weapon-slot`);
    weaponSlot.anchor.setTo(0.5, 0.5);
    weaponSlot.fixedToCamera = true;

  }

  setupBackground() {
    //de map plaatsen (dit is alleen de vloer)
    this.background = this.add.tileSprite(0, 0, 2351, 2134, `map`);
  }

  initDirectionEnemy(enemy) {
    const direction = this.game.rnd.integerInRange(1, 4);
    if (direction === 1) {
      enemy.angle = 90;
    }
    if (direction === 2) {
      enemy.angle = 180;
    }
    if (direction === 3) {
      enemy.angle = 270;
    }
    if (direction === 4) {
      enemy.angle = 0;
    }
  }

  enemyWallOverlap(object, enemy) {
    //checkt als een enemy met een wall overlapt
    enemy.reset(this.game.rnd.integerInRange(50, this.background.width - 50), this.game.rnd.integerInRange(50, this.background.height - 50), 10);
    this.checkDistanceWithCamera(enemy);
    this.checkEnemyWallOverlap();
  }

  spawnEnemies() {
    // spawnt de enemies op de map en zorgt ook voor de walk cycle van de enemy, de loot die hij dropt als hij dood gaat, en een dead image
    this.enemyPool.forEach(enemy => {

      if (enemy.roomId === player.roomId && enemy.alive && player.alive && Phaser.Math.distance(enemy.x, enemy.y, player.x, player.y) < 400) {
        enemy.enemyFolow = true;
        const angle = this.game.physics.arcade.angleBetween(enemy, player);
        enemy.rotation = angle;
        this.game.physics.arcade.moveToObject(enemy, player, 150);

      }

      if (enemy.alive && player.alive && enemy.enemyFolow && Phaser.Math.distance(enemy.x, enemy.y, player.x, player.y) > 600 || !player.alive || !enemy.enemyFolow) {
        enemy.enemyFolow = false;
        this.followNormalWalkingCycle(enemy);

      }

      if (enemy.angle !== 0 && enemy.angle !== 90 && enemy.angle !== - 180 && enemy.angle !== - 90 && !enemy.enemyFolow) {
        this.initDirectionEnemy(enemy);
      }

      if (!enemy.alive) {
        //als er een enemy dood is, score verhogen met een random waarde, en toevoegen aan de deadEnemy groep
        this.createDeadEnemy(enemy);
        this.dropLoot(enemy);
        zombieSound.play();
        this.enemyPool.remove(enemy);
        pointText.text = `${points += this.game.math.between(10, 30)} `;
        enemyText.text = `${this.enemyPool.length}/${numEnemys} `;
      }

      if (this.enemyPool.length === 0) {
        // als elke enemy dood is start een nieuwe wave met een ping
        wave ++;
        const wavePing = this.add.audio(`wave-ping`, 0.3, false);
        wavePing.play();
        waveText.text = `${wave} `;
        this.deadEnemies.removeAll(true);
        this.startNewWave();
      }

      enemy.walk();

    });
  }

  createDeadEnemy(enemy) {
    // het aanmaken van een dode enemy met verschilleden dood image
    let deadEnemy;
    if (weapon === `uzi`) {
      deadEnemy = this.game.add.image(enemy.x, enemy.y, `dead1`);
    }
    if (weapon === `shotgun`) {
      deadEnemy = this.game.add.image(enemy.x, enemy.y, `dead3`);
    }
    if (weapon === `axe`) {
      deadEnemy = this.game.add.image(enemy.x, enemy.y, `dead2`);
    }
    this.deadEnemies.add(deadEnemy);
  }

  startNewWave() {
    // het starten van een nieuwe wave en het moeilijker maken met meer zombies
    numEnemys += wave * 5;
    // console.log(wave);
    this.setupEnemies();
    enemyText.text = `${this.enemyPool.length}/${numEnemys} `;
  }

  checkDistanceWithCamera(enemy) {
    // checken van de afstand tussen de camera
    const cameraInitX = 0;
    const cameraInitY = this.background.height - this.camera.height;

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
    // dit wordt geloopt, hierin zitten vooral collision detecties
    this.physics.arcade.collide(player, this.wallGroup, this.collisionHandler, null, this);
    this.physics.arcade.overlap(player, this.wallGroup, this.overlapHandler, null, this);
    this.physics.arcade.overlap(player, this.opvulGroup, this.overlapHandler, null, this);
    this.physics.arcade.overlap(player, this.doorGroup, this.overlapHandler, null, this);
    this.physics.arcade.collide(this.enemyPool, this.enemyPool, this.enemysCollide, null, this);
    this.physics.arcade.collide(this.enemyPool, this.opvulGroup, this.enemyOutsideMap, null, this);
    this.physics.arcade.overlap(player, this.roomGroup, this.logRoom, null, this);
    this.physics.arcade.collide(player, this.doorGroup, this.checkDoor, null, this);

    this.physics.arcade.collide(player, this.mapObjectGroup, this.collisionHandler, null, this);
    this.physics.arcade.overlap(player, this.mapObjectGroup, this.overlapHandler, null, this);

    this.physics.arcade.collide(player, this.enemyPool, this.enemyPlayerCollision, null, this);
    this.physics.arcade.collide(this.enemyPool, this.mapObjectGroup, this.changeEnemyDirection, null, this);
    this.physics.arcade.collide(this.enemyPool, this.wallGroup, this.changeEnemyDirection, null, this);
    this.physics.arcade.overlap(this.enemyPool, this.roomGroup, this.logRoomEnemy, null, this);
    this.physics.arcade.collide(this.enemyPool, this.doorGroup, this.changeEnemyDirection, null, this);
    //het opnieuw spawnen van enemies als de wave gedaan is, dit checken
    this.spawnEnemies();
    this.processPlayerInput();
    //als een kogel overlapt met een muur of enemy dan moet deze een functie uitvoeren
    uzi.bullets.forEach(bullet => {
      this.physics.arcade.overlap(bullet, this.wallGroup, this.bulletWallHandler, null, this);
      this.physics.arcade.overlap(bullet, this.doorGroup, this.bulletWallHandler, null, this);
      this.physics.arcade.overlap(bullet, this.enemyPool, this.calculateDamageEnemy, null, this);
    });
    shotgun.bullets.forEach(bullet => {
      this.physics.arcade.overlap(bullet, this.wallGroup, this.bulletWallHandler, null, this);
      this.physics.arcade.overlap(bullet, this.doorGroup, this.bulletWallHandler, null, this);
      this.physics.arcade.overlap(bullet, this.enemyPool, this.calculateDamageEnemy, null, this);
    });
    // dit checkt of er een overlap is met de pickup item en de player
    this.physics.arcade.overlap(player, this.pickUpGroup, this.playerPickupHandler, null, this);
  }

  playerPickupHandler(player, weaponSprite) {
    // console.log(player.x);
    this.pickUpGroup.forEach(pickup => {
      // console.log(pickup);
      if (Phaser.Math.distance(pickup.position.x, pickup.position.y, player.x, player.y) < 100) {
        // console.log(pickup.key);
        // pickup opnemen via de spatie knop, maar dit kan geen medic zijn
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && pickup.key !== `medic`) {
          weapon = pickup.key;
          weaponSprite.kill();
          this.pickUpGroup.remove(pickup);

          if (weapon !== `none`) {
            if (weaponInSlot) {
              weaponInSlot.kill();
            }
            weaponInSlot = this.game.add.image(80, 680, weapon);
            weaponInSlot.anchor.setTo(0.5, 0.5);
            weaponInSlot.scale.setTo(1.5, 1.5);
            weaponInSlot.fixedToCamera = true;
          }
        }
        //als het een medic is moet je max health terug krijgen
        if (pickup.key === `medic`) {
          weaponSprite.kill();
          this.pickUpGroup.remove(pickup);
          player.heal(100);
          healthBar.width = player.health * 3;
          pickupSound.play();
        }
      }
    });
  }

  calculateDamageEnemy(bullet, enemy) {
    // damage bereken per wapen voor de enemie
    bullet.kill();
    if (weapon === `uzi`) {
      enemy.damage(3);

    } else if (weapon === `shotgun`) {
      enemy.damage(10);
    }

  }

  logRoom(player, room) {
    player.roomId = room.id;
  }

  logRoomEnemy(enemy, room) {
    enemy.roomId = room.id;
  }

  //checken van de positie van de player tegenover de deur en hoe de deur dan moet draaien
  checkDoor(player, door) {
    let newDoor;
    if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
      if (door.dir === `horleft`) {
        if (door.closed && player.y > door.y) {
          newDoor = new Door(this.game, door.x, door.y - door.width, door.height, door.width, `door`);
          newDoor.up = true;
          this.addDoor(door, newDoor);
        }
        if (door.up && player.x < door.x) {
          newDoor = new Door(this.game, door.x, door.y + door.height, door.height, door.width, `door`);
          newDoor.closed = true;
          this.addDoor(door, newDoor);
        }
        if (door.closed && player.y < door.y) {
          newDoor = new Door(this.game, door.x, door.y + door.height, door.height, door.width, `door`);
          newDoor.down = true;
          this.addDoor(door, newDoor);
        }
        if (door.down && player.x < door.x) {
          newDoor = new Door(this.game, door.x, door.y - door.width, door.height, door.width, `door`);
          newDoor.closed = true;
          this.addDoor(door, newDoor);
        }
      }
      if (door.dir === `horright`) {
        if (door.closed && player.y > door.y) {
          newDoor = new Door(this.game, door.x + door.width - door.height, door.y - door.width, door.height, door.width, `door`);
          newDoor.up = true;
          this.addDoor(door, newDoor);
        }
        if (door.up && player.x > door.x) {
          newDoor = new Door(this.game, door.x - (door.height - door.width), door.y + door.height, door.height, door.width, `door`);
          newDoor.closed = true;
          this.addDoor(door, newDoor);
        }
        if (door.closed && player.y < door.y) {
          newDoor = new Door(this.game, door.x + (door.width - door.height), door.y + door.height, door.height, door.width, `door`);
          newDoor.down = true;
          this.addDoor(door, newDoor);
        }
        if (door.down && player.x > door.x) {
          newDoor = new Door(this.game, door.x - (door.height - door.width), door.y - door.width, door.height, door.width, `door`);
          newDoor.closed = true;
          this.addDoor(door, newDoor);
        }
      }
      if (door.dir === `verttop`) {
        if (door.closed && player.x > door.x) {
          newDoor = new Door(this.game, door.x - door.height, door.y, door.height, door.width, `door`);
          newDoor.toLeft = true;
          this.addDoor(door, newDoor);
        }
        if (door.toLeft && player.y < door.y) {
          newDoor = new Door(this.game, door.x + door.width, door.y, door.height, door.width, `door`);
          newDoor.closed = true;
          this.addDoor(door, newDoor);
        }
        if (door.closed && player.x < door.x) {
          newDoor = new Door(this.game, door.x + door.width, door.y, door.height, door.width, `door`);
          newDoor.toRight = true;
          this.addDoor(door, newDoor);
        }
        if (door.toRight && player.y < door.y) {
          newDoor = new Door(this.game, door.x - door.height, door.y, door.height, door.width, `door`);
          newDoor.closed = true;
          this.addDoor(door, newDoor);
        }
      }
      if (door.dir === `vertdown`) {
        if (door.closed && player.x > door.x) {
          newDoor = new Door(this.game, door.x - door.height, door.y + (door.height - door.width), door.height, door.width, `door`);
          newDoor.toLeft = true;
          this.addDoor(door, newDoor);
        }
        if (door.toLeft && player.y > door.y) {
          newDoor = new Door(this.game, door.x + door.width, door.y - (door.width - door.height), door.height, door.width, `door`);
          newDoor.closed = true;
          this.addDoor(door, newDoor);
        }
        if (door.closed && player.x < door.x) {
          newDoor = new Door(this.game, door.x + door.width, door.y + (door.height - door.width), door.height, door.width, `door`);
          newDoor.toRight = true;
          this.addDoor(door, newDoor);
        }
        if (door.toRight && player.y > door.y) {
          newDoor = new Door(this.game, door.x - door.height, door.y - (door.width - door.height), door.height, door.width, `door`);
          newDoor.closed = true;
          this.addDoor(door, newDoor);
        }
      }
    }
  }

  addDoor(door, newDoor) {
    newDoor.dir = door.dir;
    this.doorGroup.add(newDoor);
    this.doorGroup.remove(door);
  }

  overlapHandler() {
    //overlap met een wal of object op de map als player
    if (player.rotation <= 0) {
      player.x ++;
      player.y ++;
    } else if (player.rotation >= 0) {
      player.x --;
      player.y --;
    }
  }

  collisionHandler() {
    //hit met wall of object op de map als player
    // console.log(`hit`);

  }

  enemysCollide(enemy1, enemy2) {
    if (!enemy1.enemyFolow) {
      enemy1.x += 5;
      enemy1.y += 5;
      this.initDirectionEnemy(enemy1);
    }
    if (!enemy2.enemyFolow) {
      enemy2.x -= 5;
      enemy2.y -= 5;
      this.initDirectionEnemy(enemy2);
    }
  }

  changeEnemyDirection(enemy) {
    if (!enemy.enemyFolow) {
      this.initDirectionEnemy(enemy);
    }
  }

  bulletWallHandler(bullet) {
    bullet.kill();
  }

  enemyPlayerCollision() {
    player.damage(1);
    healthBar.width = player.health * 3;
    player.body.bounce.setTo(1.1);

    if (player.health <= 0) {
      localStorage.setItem(`points`, pointText.text);
      localStorage.setItem(`waves`, waveText.text);
      console.log(`end`);
      this.state.start(`End`);
    }
  }

  checkHitWithAxe(player, enemy) {
    enemy.damage(5);
  }

  followNormalWalkingCycle(enemy) {
    if (enemy.angle === 0) {
      enemy.body.velocity.setTo(40, 0);
    }
    if (enemy.angle === 90) {
      enemy.body.velocity.setTo(0, 40);
    }
    if (enemy.angle === - 180) {
      enemy.body.velocity.setTo(- 40, 0);
    }
    if (enemy.angle === - 90) {
      enemy.body.velocity.setTo(0, - 40);
    }

  }

  dropLoot(enemy) {
    const random = this.game.rnd.integerInRange(1, 8);
    if (random === 1) {
      const loot = this.game.rnd.integerInRange(1, 3);
      if (loot === 1) {
        const pickup = new PickUp(this.game, enemy.x, enemy.y, `uzi`);
        this.pickUpGroup.add(pickup);
      }
      if (loot === 2) {
        const pickup = new PickUp(this.game, enemy.x, enemy.y, `shotgun`);
        this.pickUpGroup.add(pickup);
      }
      if (loot === 3) {
        const pickup = new PickUp(this.game, enemy.x, enemy.y, `medic`);
        this.pickUpGroup.add(pickup);
      }
    }
  }

  processPlayerInput() {
    const distanceToPlayer = this.physics.arcade.distanceToPointer(player);
    player.rotation = this.physics.arcade.angleToPointer(player);
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;

    if (this.cursors.up.isDown || this.game.input.keyboard.isDown(Phaser.Keyboard.Z) || this.game.input.keyboard.isDown(Phaser.Keyboard.W)) {
      if (distanceToPlayer > 10) {
        this.physics.arcade.moveToPointer(player, player.data.speed);
        player.walk();
      }
    }
    if (this.cursors.down.isDown || this.game.input.keyboard.isDown(Phaser.Keyboard.S)) {
      if (distanceToPlayer > 10) {
        this.physics.arcade.moveToPointer(player, - player.data.speed);
        player.walk();
      }
    }

    if (this.game.input.activePointer.isDown) {
      //checken of de player een wapen vast heeft en hij nog leeft
      // de player shiet met het wapen die hij vast heeft
      if (weapon !== `none` && player.alive) {
        player.data.speed = 50;
        player.shoot(weapon);
        if (weapon === `axe`) {
          this.physics.arcade.overlap(player, this.enemyPool, this.checkHitWithAxe, null, this);
        }
        if (weapon === `uzi`) {
          uzi.fire();
          uziSound.play();
        }
        if (weapon === `shotgun`) {
          shotgun.fire();
          shotgunSound.play();
        }
      }
    } else {
      player.data.speed = 350;
    }

  }

  render() {
  }
}

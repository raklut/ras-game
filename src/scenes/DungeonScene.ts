import Phaser from "phaser";
import Graphics from "../assets/Graphics";
import Sounds from "../assets/Sounds";
import FOVLayer from "../entities/FOVLayer";
import Player from "../entities/Player";
import Slime from "../entities/Slime";
import Map from "../entities/Map";
import eventsCenter from "../entities/EventsCenter"
import Bullet from "../entities/Bullet"


const worldTileHeight = 81;
const worldTileWidth = 81;



export default class DungeonScene extends Phaser.Scene {
  lastX: number;
  lastY: number;
  player: Player | null;

  slimes: Slime[];
  slimeGroup: Phaser.GameObjects.Group | null;
  fov: FOVLayer | null;
  tilemap: Phaser.Tilemaps.Tilemap | null;
  map: Map | null;
  roomDebugGraphics?: Phaser.GameObjects.Graphics;
  music: Phaser.Sound.HTML5AudioSound | null;
  effects : { [id: string] : Phaser.Sound.HTML5AudioSound};



  preload(): void {
    var progressBar = this.add.graphics();
    var progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(140, 270, 320, 50);

    this.load.on('progress', function (value) {
        console.log(value);
        progressBar.clear();
        progressBar.fillStyle(0xffffff, 1);
        progressBar.fillRect(150, 280, 300 * value, 30);
    });

    this.load.image(Graphics.environment.name, Graphics.environment.file);
    this.load.image(Graphics.util.name, Graphics.util.file);
    this.load.image(Graphics.bullet.name, Graphics.bullet.file);
    
    this.load.spritesheet(Graphics.player.name, Graphics.player.file, {
      frameHeight: Graphics.player.height,
      frameWidth: Graphics.player.width
    });
    this.load.spritesheet(Graphics.slime.name, Graphics.slime.file, {
      frameHeight: Graphics.slime.height,
      frameWidth: Graphics.slime.width
    });
    this.load.audio(Sounds.MusicLvl_1.name, Sounds.MusicLvl_1.file);
    this.load.audio(Sounds.WoodDebris.name, Sounds.WoodDebris.file);
    this.load.audio(Sounds.ShotgunShot.name, Sounds.ShotgunShot.file);

  }

  constructor() {
    super("DungeonScene");
    this.lastX = -1;
    this.lastY = -1;
    this.player = null;
    this.fov = null;
    this.tilemap = null;
    this.slimes = [];
    this.slimeGroup = null;
    this.map = null;
    this.music = null;
    this.effects = {};
  }

  slimePlayerCollide(
    _: Phaser.GameObjects.GameObject,
    slimeSprite: Phaser.GameObjects.GameObject
  ) {
    const slime = this.slimes.find(s => s.sprite === slimeSprite);
    if (!slime) {
      console.log("Missing slime for sprite collision!");
      return;
    }

    if (this.player!.isAttacking()) {
      this.slimes = this.slimes.filter(s => s != slime);
      slime.kill();
      return false;
    } else {
      // took some damage
      eventsCenter.emit( 'damage-count', slime.getDamage() );
      this.player!.stagger();
      return true;
    }
  }

  create(): void {
    this.input.enabled = true;

    this.events.on("wake", () => {
      this.scene.run("InfoScene");
    });

    Object.values(Graphics.player.animations).forEach(anim => {
      if (!this.anims.get(anim.key)) {
        this.anims.create({
          ...anim,
          frames: this.anims.generateFrameNumbers(
            Graphics.player.name,
            anim.frames
          )
        });
      }
    });

    /* Audio */
    this.music = this.sound.add(Sounds.MusicLvl_1.name);
    this.effects["WoodDebris"] = this.sound.add(Sounds.WoodDebris.name);
    this.effects["ShotgunShot"] = this.sound.add(Sounds.ShotgunShot.name);
    this.music.play({loop: true});
    //this.effects["WoodDebris"].play();


    // TODO
    Object.values(Graphics.slime.animations).forEach(anim => {
      if (!this.anims.get(anim.key)) {
        this.anims.create({
          ...anim,
          frames: this.anims.generateFrameNumbers(
            Graphics.slime.name,
            anim.frames
          )
        });
      }
    });

    const map = new Map(worldTileWidth, worldTileHeight, this);
    this.map = map;
    this.tilemap = map.tilemap;

    this.fov = new FOVLayer(map);

    this.player = new Player(
      this.tilemap.tileToWorldX(map.startingX),
      this.tilemap.tileToWorldY(map.startingY),
      this
    );

    this.slimes = map.slimes;
    this.slimeGroup = this.physics.add.group(this.slimes.map(s => s.sprite));

    this.cameras.main.setRoundPixels(true);
    this.cameras.main.setZoom(3);
    this.cameras.main.setBounds(
      0,
      0,
      map.width * Graphics.environment.width,
      map.height * Graphics.environment.height
    );
    this.cameras.main.startFollow(this.player.sprite);

    this.physics.add.collider(this.player.sprite, map.wallLayer);
    this.physics.add.collider(this.slimeGroup, map.wallLayer);

    this.physics.add.collider(this.player.sprite, map.doorLayer);
    this.physics.add.collider(this.slimeGroup, map.doorLayer);

    // this.physics.add.overlap(
    //   this.player.sprite,
    //   this.slimeGroup,
    //   this.slimePlayerCollide,
    //   undefined,
    //   this
    // );
    this.physics.add.collider(
      this.player.sprite,
      this.slimeGroup,
      undefined,
      this.slimePlayerCollide,
      this
    );

    // for (let slime of this.slimes) {
    //   this.physics.add.collider(slime.sprite, map.wallLayer);
    // }

    this.input.keyboard.on("keydown-R", function(event) {
      //this.scene.stop("InfoScene");
      //this.scene.run("ReferenceScene");
      //this.scene.sleep();
    }, this);

    this.input.keyboard.on("keydown-Q", function(event) {
    //  this.physics.world.drawDebug = !this.physics.world.drawDebug;
    //  if (!this.physics.world.debugGraphic) {
    //    this.physics.world.createDebugGraphic();
    //  }
    //  this.physics.world.debugGraphic.clear();
    //  this.roomDebugGraphics!.setVisible(this.physics.world.drawDebug);
    }, this);

//    this.input.keyboard.on("keydown-F", function(event) {
//      this.fov!.layer.setVisible(!this.fov!.layer.visible);
//    }, this);

    this.roomDebugGraphics = this.add.graphics({ x: 0, y: 0 });
    this.roomDebugGraphics.setVisible(false);
    this.roomDebugGraphics.lineStyle(2, 0xff5500, 0.5);
    for (let room of map.rooms) {
      this.roomDebugGraphics.strokeRect(
        this.tilemap!.tileToWorldX(room.x),
        this.tilemap!.tileToWorldY(room.y),
        this.tilemap!.tileToWorldX(room.width),
        this.tilemap!.tileToWorldY(room.height)
      );
    }
    this.scene.run("InfoScene");

    this.input.keyboard.on("keydown-SPACE", function(event) {
//      if (this.scene.isActive("InfoScene")) {
        this.scene.stop("InfoScene");
//      } else {
//        this.scene.run("InfoScene");
//      }
    }, this);

    eventsCenter.on('player-die', this.playerdie, this)
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
      this.scene.start('GameOverScene');
    })


    this.scene.run("StatScene");
    if (!this.sys.game.device.os.desktop) {
      this.scene.run("MobileUI");
    }
  }

  playerdie() : void {
    this.player.die();
    this.cameras.main.fadeOut(2000, 0, 0, 0);
  }

  update(time: number, delta: number) {
    this.player!.update(time);


    const camera = this.cameras.main;

    for (let slime of this.slimes) {
      if(slime.isAlive()) {
        slime.update(time);
      }
    }

    const player = new Phaser.Math.Vector2({
      x: this.tilemap!.worldToTileX(this.player!.sprite.body.x),
      y: this.tilemap!.worldToTileY(this.player!.sprite.body.y)
    });

    const bounds = new Phaser.Geom.Rectangle(
      this.tilemap!.worldToTileX(camera.worldView.x) - 1,
      this.tilemap!.worldToTileY(camera.worldView.y) - 1,
      this.tilemap!.worldToTileX(camera.worldView.width) + 2,
      this.tilemap!.worldToTileX(camera.worldView.height) + 2
    );

    this.fov!.update(player, bounds, delta);

    if (this.player.isPlayerDead()) {
      //this.scene.stop("DungeonScene");
      this.scene.stop("StatScene");
      this.scene.stop("InfoScene");
      //this.scene.start("GameOverScene");
    }
  }
}

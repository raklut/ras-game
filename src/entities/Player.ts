import Phaser from "phaser";
import Graphics from "../assets/Graphics";
import {Orientation} from "../includes/Orientation";
import Bullet from "./Bullet"
import Slime from "./Slime"

const speed = 125;
const attackSpeed = 200;
const attackDuration = 165;
const staggerDuration = 200;
const staggerSpeed = 100;
const attackCooldown = attackDuration * 2;
const maxlife = 100;

/*
interface Keys {
  up: Phaser.Input.Keyboard.Key;
  down: Phaser.Input.Keyboard.Key;
  left: Phaser.Input.Keyboard.Key;
  right: Phaser.Input.Keyboard.Key;
  space: Phaser.Input.Keyboard.Key;
  w: Phaser.Input.Keyboard.Key;
  a: Phaser.Input.Keyboard.Key;
  s: Phaser.Input.Keyboard.Key;
  d: Phaser.Input.Keyboard.Key;
}
*/


export default class Player {
  public sprite: Phaser.Physics.Arcade.Sprite;
  //private keys: Keys;

  private attackUntil: number;
  private staggerUntil: number;
  private attackLockedUntil: number;
  private emitter: Phaser.GameObjects.Particles.ParticleEmitter;
  private flashEmitter: Phaser.GameObjects.Particles.ParticleEmitter;
  private body: Phaser.Physics.Arcade.Body;
  private attacking: boolean;
  private time: number;
  private staggered: boolean;
  private scene: Phaser.Scene;
  private facingUp: boolean;
  private isDying: boolean;
  private isDead: boolean;
  private orientation: Orientation;
  private moveUp: boolean;
  private moveDown: boolean;
  private moveLeft: boolean;
  private moveRight: boolean;
  private actAttack: boolean;


  constructor(x: number, y: number, scene: Phaser.Scene) {
    this.scene = scene;
    this.sprite = scene.physics.add.sprite(x, y, Graphics.player.name, 0);
    this.sprite.setSize(8, 8);
    this.sprite.setOffset(20, 28);
    this.sprite.anims.play(Graphics.player.animations.idle.key);
    this.facingUp = false;
    this.orientation = Orientation.DOWN;
    this.sprite.setDepth(5);
    this.isDying = false;
    this.isDead = false;
    this.moveUp = false;
    this.moveDown = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.actAttack = false;

    //this.keys = scene.input.keyboard.addKeys({
    //  up: Phaser.Input.Keyboard.KeyCodes.UP,
    //  down: Phaser.Input.Keyboard.KeyCodes.DOWN,
    //  left: Phaser.Input.Keyboard.KeyCodes.LEFT,
    //  right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
    //  space: Phaser.Input.Keyboard.KeyCodes.SPACE,
    //  w: "w",
    //  a: "a",
    //  s: "s",
    //  d: "d"
    //}) as Keys;


    //this.keys = scene.input.keyboard.addKeys({
    //  up: Phaser.Input.Keyboard.KeyCodes.UP,
    //  down: Phaser.Input.Keyboard.KeyCodes.DOWN,
    //  left: Phaser.Input.Keyboard.KeyCodes.LEFT,
    //  right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
    //  space: Phaser.Input.Keyboard.KeyCodes.SPACE,
    //  w: "w",
    //  a: "a",
    //  s: "s",
    //  d: "d"
    //}) as Keys;

    this.attackUntil = 0;
    this.attackLockedUntil = 0;
    this.attacking = false;
    this.staggerUntil = 0;
    this.staggered = false;
    const particles = scene.add.particles(Graphics.player.name);
    particles.setDepth(6);
    this.emitter = particles.createEmitter({
      alpha: { start: 0.7, end: 0, ease: "Cubic.easeOut" },
      follow: this.sprite,
      quantity: 1,
      lifespan: 200,
      blendMode: Phaser.BlendModes.ADD,
      scaleX: () => (this.sprite.flipX ? -1 : 1),
      emitCallback: (particle: Phaser.GameObjects.Particles.Particle) => {
        particle.frame = this.sprite.frame;
      }
    });
    this.emitter.stop();

    this.flashEmitter = particles.createEmitter({
      alpha: { start: 0.5, end: 0, ease: "Cubic.easeOut" },
      follow: this.sprite,
      quantity: 1,
      lifespan: 100,
      scaleX: () => (this.sprite.flipX ? -1 : 1),
      emitCallback: (particle: Phaser.GameObjects.Particles.Particle) => {
        particle.frame = this.sprite.frame;
      }
    });
    this.flashEmitter.stop();

    this.body = <Phaser.Physics.Arcade.Body>this.sprite.body;
    this.time = 0;

    // Key handling

    this.scene.input.keyboard.on("keydown-UP", function(event) {
      this.moveUp = true;
    }, this);
    this.scene.input.keyboard.on("keyup-UP", function(event) {
      this.moveUp = false;
    }, this);
    this.scene.input.keyboard.on("keydown-DOWN", function(event) {
      this.moveDown = true;
    }, this);
    this.scene.input.keyboard.on("keyup-DOWN", function(event) {
      this.moveDown = false;
    }, this);
    this.scene.input.keyboard.on("keydown-LEFT", function(event) {
      this.moveLeft = true;
    }, this);
    this.scene.input.keyboard.on("keyup-LEFT", function(event) {
      this.moveLeft = false;
    }, this);
    this.scene.input.keyboard.on("keydown-RIGHT", function(event) {
      this.moveRight = true;
    }, this);
    this.scene.input.keyboard.on("keyup-RIGHT", function(event) {
      this.moveRight = false;
    }, this);
    this.scene.input.keyboard.on("keydown-SPACE", function(event) {
      this.actAttack = true;
    }, this);
    this.scene.input.keyboard.on("keyup-SPACE", function(event) {
      this.actAttack = false;
    }, this);        
  }

  isAttacking(): boolean {
    return this.attacking;
  }

  stagger(): void {
    if (this.time > this.staggerUntil) {
      this.staggered = true;
      // TODO
      this.scene.cameras.main.shake(150, 0.001);
      this.scene.cameras.main.flash(50, 100, 0, 0);
    }
  }

  die(): void {
    this.isDying = true;
  }

  isPlayerDead(): boolean {
    return this.isDead;
  }

  shoot(): void{
    const bullet = new Bullet(this.scene, this, this.orientation);
    this.scene.effects["ShotgunShot"].play();
  }

  update(time: number) {
    this.time = time;
    //const keys = this.keys;
    let attackAnim = "";
    let moveAnim = "";

    if (!this.isDead) { //if dead we won't do anything
      if (this.staggered && !this.body.touching.none) {
        this.staggerUntil = this.time + staggerDuration;
        this.staggered = false;

        this.body.setVelocity(0);
        if (this.body.touching.down) {
          this.body.setVelocityY(-staggerSpeed);
        } else if (this.body.touching.up) {
          this.body.setVelocityY(staggerSpeed);
        } else if (this.body.touching.left) {
          this.body.setVelocityX(staggerSpeed);
          this.sprite.setFlipX(true);
        } else if (this.body.touching.right) {
          this.body.setVelocityX(-staggerSpeed);
          this.sprite.setFlipX(false);
        }
        this.sprite.anims.play(Graphics.player.animations.stagger.key);

        this.flashEmitter.start();
        // this.sprite.setBlendMode(Phaser.BlendModes.MULTIPLY);
      } 

      if (time < this.attackUntil || time < this.staggerUntil) {
        return;
      }

      this.body.setVelocity(0);

      const left = this.moveLeft;//keys.left.isDown || keys.a.isDown;
      const right = this.moveRight;//keys.right.isDown || keys.d.isDown;
      const up = this.moveUp;//keys.up.isDown || keys.w.isDown;
      const down = this.moveDown;//keys.down.isDown || keys.s.isDown;

      if (!this.body.blocked.left && left) {
        this.body.setVelocityX(-speed);
        this.sprite.setFlipX(true);
      } else if (!this.body.blocked.right && right) {
        this.body.setVelocityX(speed);
        this.sprite.setFlipX(false);
      }

      if (!this.body.blocked.up && up) {
        this.body.setVelocityY(-speed);
      } else if (!this.body.blocked.down && down) {
        this.body.setVelocityY(speed);
      }

      if (left || right) {
        moveAnim = Graphics.player.animations.walk.key;
        attackAnim = Graphics.player.animations.slash.key;
        this.facingUp = false;
        if (left) {
          this.orientation = Orientation.LEFT;
        } else {
          this.orientation = Orientation.RIGHT;
        }
      } else if (down) {
        moveAnim = Graphics.player.animations.walk.key;
        attackAnim = Graphics.player.animations.slashDown.key;
        this.facingUp = false;
        this.orientation = Orientation.DOWN;
      } else if (up) {
        moveAnim = Graphics.player.animations.walkBack.key;
        attackAnim = Graphics.player.animations.slashUp.key;
        this.facingUp = true;
        this.orientation = Orientation.UP;
      } else if (this.facingUp) {
        moveAnim = Graphics.player.animations.idleBack.key;
      } else {
        moveAnim = Graphics.player.animations.idle.key;
      }

      if (
        this.actAttack &&
        time > this.attackLockedUntil// &&
        //this.body.velocity.length() > 0
      ) {
        console.log("attacking");
        this.attackUntil = time + attackDuration;
        this.attackLockedUntil = time + attackDuration + attackCooldown;
        //this.body.velocity.normalize().scale(attackSpeed);
        if(this.orientation == Orientation.LEFT ||
           this.orientation == Orientation.RIGHT ) {
          attackAnim = Graphics.player.animations.slash.key;
        } else if (this.orientation == Orientation.DOWN) {
          attackAnim = Graphics.player.animations.slashDown.key;
        } else if (this.orientation == Orientation.UP) {
          attackAnim = Graphics.player.animations.slashUp.key;
        }
        this.sprite.anims.play(attackAnim, true);
        this.shoot();
        //this.emitter.start();
        //this.sprite.setBlendMode(Phaser.BlendModes.ADD);
        this.attacking = true;
        return;
      }
      if (this.isDying) {
        moveAnim = Graphics.player.animations.die.key;
        this.isDead = true;
      }
      this.attacking = false;
      this.sprite.anims.play(moveAnim, true);
      this.body.velocity.normalize().scale(speed);
      this.sprite.setBlendMode(Phaser.BlendModes.NORMAL);
      if (this.emitter.on) {
        this.emitter.stop();
      }
      if (this.flashEmitter.on) {
        this.flashEmitter.stop();
      }
    } else { //if (!this.isDead) {
      this.body.setVelocity(0);
    }
  }
}

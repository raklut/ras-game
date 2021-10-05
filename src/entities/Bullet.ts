import Phaser from "phaser";
import Player from "./Player"
import Graphics from "../assets/Graphics";
import {Orientation} from "../includes/Orientation"

const bullet_speed = 225;

export default class Bullet extends Phaser.Physics.Arcade.Sprite {
  public scene: Phaser.Scene;

  constructor(scene: Phaser.Scene, player: Player, direction: Orientation) {
    super(scene, player.sprite.x, player.sprite.y, Graphics.bullet.name);
    this.scene = scene;
    this.setScale(1);
    this.scene.physics.add.existing(this);
    this.scene.add.existing(this);

    this.setDepth(4);

    switch (direction) {
      case Orientation.UP:
        this.setOffset
        this.setVelocityY(-bullet_speed);
        this.y -= 0;
        //this.x -= 24;
        break;
      case Orientation.DOWN:
        this.setVelocityY(bullet_speed);
        this.setRotation(Math.PI);
        this.y += 16;
        //this.x -= 24;
        break;
      case Orientation.LEFT:
        this.setVelocityX(-bullet_speed);
        this.setRotation(-Math.PI / 2);
        this.x -= 16;
        this.y += 4;
        break;
      case Orientation.RIGHT:
        this.setVelocityX(bullet_speed);
        this.setRotation(Math.PI / 2);
        this.x += 16;
        this.y += 4;
        break;
      default:
        break;
    }
    //console.log("instanciated bullet at : %d,%d - dir : %d" this.x, this.y, direction);

    this.scene.physics.add.collider(this, this.scene.slimeGroup, 
        (b: Bullet, slimeSprite: Phaser.GameObjects.GameObject) => {
          const slime = this.scene.slimes.find(s => s.sprite === slimeSprite);
          if (!slime) {
            console.log("Missing slime for sprite collision!");
            return;
          }
          slime.kill();
          b.destroy();
        }
    );
    this.scene.physics.add.collider(this, this.scene.map.wallLayer,
        (b: Bullet, wallSprite: Phaser.GameObjects.GameObject) => {
          b.destroy();
        }
    );

    this.scene.physics.add.collider(this, this.scene.map.doorLayer,
        (b: Bullet, doorSprite: Phaser.GameObjects.GameObject) => {
          b.destroy();
        }
    );
  }

}

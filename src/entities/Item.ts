import Phaser from "phaser";

export default abstract class Item extends Phaser.Physics.Arcade.Sprite {
  scene: Phaser.Scene;
  sprite: Phaser.Physics.Arcade.Sprite;
  name : string ?= "Item";
  //public name: number;

  constructor(scene: Phaser.Scene, x: number, y: number, name: string ) {
  	super(scene, x, y, name);
  	this.scene = scene;
  	this.name = name;
    this.setScale(0.25);
    this.scene.physics.add.existing(this);
    this.scene.add.existing(this);

//
    this.setDepth(4);
//
    this.scene.physics.add.collider(this, this.scene.player, 
        (i: Item, playerSprite: Phaser.GameObjects.GameObject) => {
            //console.log(this.name + " picked up by player!");
          i.setVelocityX(0);
          i.setVelocityY(0);
          this.pickedup();
          i.destroy();
                      return;
        }
    );

  }

}


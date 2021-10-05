import Phaser from "phaser";
import Graphics from "../assets/Graphics";

const maxhearts = 3;
const stepX = 48;
const maxlife = 100;
const minlife = 0;

export default class HealthBar {

  private hearts!: Phaser.GameObjects.Group
  private value: number;
  private scene: Phaser.Scene;
  private posx: number;
  private posy: number;

  constructor(x: number, y: number, scene: Phaser.Scene) {
    this.scene = scene;
    this.value = maxlife;
    this.posx = x;
    this.posy = y;
  }

  isEmpty(): boolean {
    return ( this.value <= minlife);
  }

  create(): void {
    this.render();
  }

  getRightBound() : number {
    return (this.posx + maxhearts*stepX)
  }

  setHealth( val : number) {
    if (val < 0) {
      this.value = 0;
    } else {
      this.value = val;
    }
  }

  getHealth() : number {
    return this.value;
  }

  render() : void {
    for ( var i = 0 ; i < maxhearts; i++) {
      if ( this.value > ((maxlife / maxhearts)*i) ) {
        this.scene.add.image(this.posx + i*stepX, this.posy, "heart");
      } else {
        this.scene.add.image(this.posx + i*stepX, this.posy, "empty_heart");
      }
    }
  }

  update(time: number) {
    this.time = time;
    if (this.getHealth() == 0) { //check if dead already
      this.scene.die();
    }
    this.render();
  }
}

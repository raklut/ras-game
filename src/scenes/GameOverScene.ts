import Phaser from "phaser";
import Fonts from "../assets/Fonts";

export default class GameOverScene extends Phaser.Scene {
  text?: Phaser.GameObjects.DynamicBitmapText;
  lastUpdate?: number;

  constructor() {
    super({ key: "GameOverScene" });
  }

  preload(): void {
    this.load.bitmapFont("default", ...Fonts.default);
  }

  create(): void {
    this.text = this.add.dynamicBitmapText(
       this.cameras.main.worldView.x + 45 ,
       this.cameras.main.worldView.y + this.cameras.main.height/2,
       "default", "", 24);
    this.text.setAlpha(0.8);
    this.lastUpdate = 0;
  }

  update(time: number, _: number): void {
    if (time > this.lastUpdate! + 100) {
      this.text!.setText([
        "      Tu as peri arpenteur !     ",
        "Je t'avais bien dit de te mefier.",
        //"FPS: " + Math.round(this.game.loop.actualFps)
      ]);
      this.lastUpdate = time;
    }
  }
}

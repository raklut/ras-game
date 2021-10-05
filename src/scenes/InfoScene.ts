import Phaser from "phaser";
import Fonts from "../assets/Fonts";

export default class InfoScene extends Phaser.Scene {
  text?: Phaser.GameObjects.DynamicBitmapText;
  lastUpdate?: number;

  constructor() {
    super({ key: "InfoScene" });
  }

  preload(): void {
    this.load.bitmapFont("default", ...Fonts.default);
  }

  create(): void {
    this.text = this.add.dynamicBitmapText(
       25,
       75,
       "default", "", 12);
    this.text.setAlpha(0.7);
    this.lastUpdate = 0;
  }

  update(time: number, _: number): void {
    if (time > this.lastUpdate! + 100) {
      this.text!.setText([
        "Bienvenue a toi arpenteur!",
        "",
        "Sera tu capable de retrouver ce que",
        "la Undersurvival company a laisse ",
        "derriere elle ?",
        "",  
        "Mais avant ca nettoie moi un peu",
        "le coin, j'ai cru voir bouger",
        "quelque chose dans l'ombre...",
        "",
        "Commandes :",
        "  Direction : deplacement",
        "  Espace + direction : tir",
        "",
        "\(Appuie sur X pour masquer\)",
        "",
        //"FPS: " + Math.round(this.game.loop.actualFps)
      ]);
      this.lastUpdate = time;
    }
  }
}

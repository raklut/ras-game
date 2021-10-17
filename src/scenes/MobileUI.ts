
import Phaser from "phaser";
import Graphics from "../assets/Graphics";
import Fonts from "../assets/Fonts";
import HealthBar from "../entities/HealthBar";
import eventsCenter from "../entities/EventsCenter"
import VirtGamePad from "../plugins/VirtGamePad"

const heathbar_posx = 50;//this.cameras.main.worldView.x + 3*this.cameras.main.width/4;
const heathbar_posy = 50;

const guesswords_posx = 200;
const guesswords_posy = 32;


export default class MobileUI extends Phaser.Scene {
  gamepad: VirtGamePad | null;

  constructor() {
    super({ key: "MobileUI" });
    this.gamepad = null;
  }

  preload(): void {
    // Load the gamepad spritesheet. Note that the width must equal height
    // of the sprite.
    this.load.image(Graphics.gamepadUI.BtnUp.name, Graphics.gamepadUI.BtnUp.file);
    this.load.image(Graphics.gamepadUI.BtnDown.name, Graphics.gamepadUI.BtnDown.file);
    this.load.image(Graphics.gamepadUI.PadOut.name, Graphics.gamepadUI.PadOut.file);
    this.load.image(Graphics.gamepadUI.PadIn.name, Graphics.gamepadUI.PadIn.file);
    this.load.scenePlugin('VirtGamePad',  VirtGamePad, 'VirtGamePad', 'gamepad');
  }

  create(): void {
    this.joystick = this.gamepad.addJoystick(
        100, 
        this.cameras.main.worldView.y + this.cameras.main.height-200,
         1.2, [Graphics.gamepadUI.PadIn.name, Graphics.gamepadUI.PadOut.name] );
    // Add a button to the game (only one is allowed right now)
    this.button = this.gamepad.addButton(
      this.cameras.main.worldView.x + this.cameras.main.width-100,
      this.cameras.main.worldView.y + this.cameras.main.height-200,
       1.0, [Graphics.gamepadUI.BtnUp.name]);
  }

  update(time: number, _: number): void {
    
  }


}

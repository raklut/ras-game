import Phaser from "phaser";
import Graphics from "../assets/Graphics";
import Fonts from "../assets/Fonts";
import HealthBar from "../entities/HealthBar";
import eventsCenter from "../entities/EventsCenter"

const heathbar_posx = 50;//this.cameras.main.worldView.x + 3*this.cameras.main.width/4;
const heathbar_posy = 50;

const guesswords_posx = 200;
const guesswords_posy = 32;

const guesswords = "JarDinEdenKit";

export default class StatScene extends Phaser.Scene {
  healthbar: HealthBar | null;
  text?: Phaser.GameObjects.DynamicBitmapText;
  lastUpdate?: number;
  bitfield: boolean[] | null;

  constructor() {
    super({ key: "StatScene" });
    this.healthbar = null;
    this.bitfield = null;
  }

  preload(): void {
    //this.load.bitmapFont("default", ...Fonts.default);
    this.load.image(Graphics.heart.name, Graphics.heart.file);
    this.load.image(Graphics.empty_heart.name, Graphics.empty_heart.file);
  }

  create(): void {
    this.text = this.add.dynamicBitmapText(
      this.cameras.main.worldView.x + 36 ,
      this.cameras.main.worldView.y + this.cameras.main.height-36,
//      guesswords_posx,
//      guesswords_posy,
       "default", "test", 24);
    //this.text.setAlpha(0.7);
    this.healthbar = new HealthBar(
      heathbar_posx,
      heathbar_posy,
      this
    );
    this.bitfield = [] as boolean[] ;
    for (var i=0 ; i < guesswords.length; i++) {
      this.bitfield.push(false);
    }

    this.lastUpdate = 0;
    //bind events
    eventsCenter.on('damage-count', this.newDamage, this);
    eventsCenter.on('slime-dead', this.revealLetter, this);
  }

  getCurrentWord(): string {
    var tempStr:string = "";
    for (var i=0 ; i < this.bitfield.length; i++) {
      if(this.bitfield[i]) {
        tempStr += (guesswords[i]);
      } else {
        tempStr += "*";
      }
    }
    return tempStr;
  }

  revealLetter(): void {
    var escape :boolean = false;
    var index :number = -1;
    var startpos :number = undefined;
    startpos = this.bitfield.find(element => element == false);
    if (startpos != undefined) {
      while (!escape) {
        index = Phaser.Math.Between(startpos, this.bitfield.length-1);
        if (!this.bitfield[index]) {
          this.bitfield[index] = true;
          escape = true;
        }
      }
    }
  }  

  newDamage( damage: number ): void {
    var currentHealth:number = this.healthbar.getHealth();
    this.updateHeath( currentHealth - damage );
  }  

  updateHeath( value: number ): void {
    this.healthbar.setHealth(value);
  }

  update(time: number, _: number): void {
    if (time > this.lastUpdate! + 100) {
      this.lastUpdate = time;
      this.healthbar.update(time);
    }
    this.text.text = this.getCurrentWord();
    this.text.y = this.cameras.main.worldView.y + this.cameras.main.height-36;
  }

  die():void {
    eventsCenter.emit( 'player-die' );
  }
}

import Phaser from "phaser";
import Fonts from "../assets/Fonts";
import YoutubePlayer from 'phaser3-rex-plugins/plugins/youtubeplayer.js';

export default class VideoPlayerScene extends Phaser.Scene {
  text?: Phaser.GameObjects.DynamicBitmapText;
  lastUpdate?: number;
  youtubePlayer = null;

  constructor() {
    super({ key: "VideoPlayerScene" });

  }

  preload(): void {
    this.load.bitmapFont("default", ...Fonts.default);
    
  }

  init(data):void
  {
      console.log('VideoPlayerScene - init', data);
      this.vidID = data.id;
      this.time = data.start;
      this.duration = data.len;

  },

  create(): void {
    this.lastUpdate = 0;
    this.youtubePlayer = this.add.rexYoutubePlayer(
        {
          x:  this.cameras.main.worldView.x + this.cameras.main.width/2 ,
          y:  this.cameras.main.worldView.y + this.cameras.main.height/2,
          width: 2*this.cameras.main.width/3,
          height: 2*this.cameras.main.height/3, 
          videoId: this.vidID,
          autoPlay: false,
          controls: true,
          keyboardControl: true,
          modestBranding: true,
          loop: false,
        });
    this.youtubePlayer.setPlaybackTime(this.time)
    //this.add.existing(this.youtubePlayer);
    //this.youtubePlayer.load(this.vidID, false);
    this.youtubePlayer.play();
    this.scene.get("DungeonScene").pause();
    //this.scene.pause("DungeonScene");
  }



    // this.youtubePlayer.load('3uS9-X7kcfE', false);
    // this.youtubePlayer.play();

  update(time: number, _: number): void {
    if (time > this.lastUpdate! + 100) {
      if (this.youtubePlayer != null) {
        console.log("Player status : " + this.youtubePlayer.videoState );
        if(this.youtubePlayer.videoState == 0) {
          console.log("stopping player !");
          this.scene.resume("DungeonScene")
          this.scene.stop();
        }
      }
      this.lastUpdate = time;
    }
  }
}

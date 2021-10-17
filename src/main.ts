import Phaser from "phaser";
import ReferenceScene from "./scenes/ReferenceScene";
import DungeonScene from "./scenes/DungeonScene";
import InfoScene from "./scenes/InfoScene";
import StatScene from "./scenes/StatScene";
//import MobileUI from "./scenes/MobileUI";
import GameOverScene from "./scenes/GameOverScene"
// import SceneWatcherPlugin from "phaser-plugin-scene-watcher";
//import VirtualGamepad from "./plugins/phaser-plugin-virtual-gamepad"
//import VirtGamePad from "./plugins/VirtGamePad"

var config = {
  type: Phaser.WEBGL,
  width: window.innerWidth,
  height: window.innerHeight,
  render: { pixelArt: true },
  physics: { default: "arcade", arcade: { debug: false, gravity: { y: 0 } } },
  scene: [DungeonScene, InfoScene, ReferenceScene, StatScene,
           //MobileUI ,
           GameOverScene],
  scale: {
    mode: Phaser.Scale.RESIZE
  }
  plugins: {
//  //   global: [{ key: "SceneWatcher", plugin: SceneWatcherPlugin, start: true }]
//       global: [{ key: "VirtualGamepad", plugin: VirtualGamepad, start: true }]
//       scene: [{ key: "VirtGamePad", plugin: VirtGamePad, mapping:"gamepad"}]
   }
};

var game = new Phaser.Game(config);

//function preload() {
//  //      var url;
//  //      url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexbbcodetextplugin.min.js';
//  //      this.load.plugin('rexbbcodetextplugin', url, true);
//  //this.load.plugin('Gamepad','./plugins/phaser-plugin-virtual-gamepad.js');
//  //this.load.plugin('Sampleplugin','./plugins/SamplePlugin.js');
//}
//
//function create() {
//
//}


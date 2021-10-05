import Phaser from "phaser";
import ReferenceScene from "./scenes/ReferenceScene";
import DungeonScene from "./scenes/DungeonScene";
import InfoScene from "./scenes/InfoScene";
import StatScene from "./scenes/StatScene";
import GameOverScene from "./scenes/GameOverScene"
// import SceneWatcherPlugin from "phaser-plugin-scene-watcher";

new Phaser.Game({
  type: Phaser.WEBGL,
  width: window.innerWidth,
  height: window.innerHeight,
  render: { pixelArt: true },
  physics: { default: "arcade", arcade: { debug: false, gravity: { y: 0 } } },
  scene: [DungeonScene, InfoScene, ReferenceScene, StatScene, GameOverScene],
  scale: {
    mode: Phaser.Scale.RESIZE
  }
  // plugins: {
  //   global: [{ key: "SceneWatcher", plugin: SceneWatcherPlugin, start: true }]
  // }
});

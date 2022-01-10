import Phaser from "phaser";
import Item from "./Item";

const item_name="medkit";

export default class Medkit extends Item {

	constructor(scene: Phaser.Scene, x: number, y: number ) {
		super(scene, x, y, item_name);
		this.scene = scene;
		this.vidID = '3uS9-X7kcfE'
		}

	start_video_tutorial() {
		this.scene.scene.run('VideoPlayerScene', {id: this.vidID, start: 138.2  ,len: 60} );
	}

	pickedup() {
		console.log(this.name + " picked up by player!");
		
		this.start_video_tutorial();
		
	}


}
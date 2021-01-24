import { SpriteLoader } from "game/graphics/sprite"
import * as THREE from "three"
import { ThreeModel } from "./threemodel"

export class ThreeSpriteLoader implements SpriteLoader{

	load(
		file: string,
		onLoaded?:(meta:void)=>void,
		onError?:(err:ErrorEvent)=>void
	){
		let model = new ThreeModel()

		new THREE.TextureLoader().load(
			file,
			function(texture){
				let geometry = new THREE.PlaneGeometry(1, 1)
				let material = new THREE.MeshBasicMaterial({ map: texture })
				model.threeObject = new THREE.Mesh(geometry, material)
				onLoaded()
			},
			undefined,
			onError
		)
	
		return model
	}
}
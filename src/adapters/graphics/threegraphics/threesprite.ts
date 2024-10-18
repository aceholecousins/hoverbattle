import { SpriteLoader } from "game/graphics/asset"
import * as THREE from "three"
import { ThreeModel } from "./threemodel"

export interface ThreeSpriteLoader extends SpriteLoader {
	(file: string): Promise<ThreeModel>;
}

export const loadThreeSprite: ThreeSpriteLoader = function (file: string) {
	return new Promise<ThreeModel>((resolve, reject) => {

		let model = new ThreeModel()

		new THREE.TextureLoader().load(
			file,
			function (texture) {
				let geometry = new THREE.PlaneGeometry(1, 1)
				let material = new THREE.MeshBasicMaterial({
					map: texture,
					transparent: true
				})
				if (file.indexOf(".tint.") > -1) {
					material.userData.useTinting = true
				}
				model.threeObject = new THREE.Mesh(geometry, material)
				resolve(model)
			},
			undefined,
			reject
		)
	})
}
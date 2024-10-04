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
					name: "sprite",
					transparent: true
				})
				model.threeObject = new THREE.Mesh(geometry, material)
				if (file.indexOf(".tint.") > -1) {
					material.name = "sprite__tint"
					model.threeObject.userData.tint = { value: new THREE.Matrix3() }
				}
				resolve(model)
			},
			undefined,
			reject
		)
	})
}
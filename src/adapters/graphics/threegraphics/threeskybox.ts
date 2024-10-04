
import * as THREE from "three"
import {renderer} from "./threerenderer"
import { Skybox, SkyboxLoader } from "game/graphics/asset"

export class ThreeSkybox extends Skybox{
	threeCubemap:THREE.CubeTexture = undefined
	threePmrem:THREE.Texture = undefined
}

export interface ThreeSkyboxLoader extends SkyboxLoader{
	(file: string): Promise<ThreeSkybox>;
}

const cubeLoader = new THREE.CubeTextureLoader()
const pmremGenerator = new THREE.PMREMGenerator(renderer)
pmremGenerator.compileCubemapShader()

export const loadThreeSkybox: ThreeSkyboxLoader = function(file:string){
	return new Promise<ThreeSkybox>((resolve, reject) => {

		let skybox = new ThreeSkybox()

		cubeLoader.load([
			file.replace("*", "px"), file.replace("*", "nx"),
			file.replace("*", "py"), file.replace("*", "ny"),
			file.replace("*", "pz"), file.replace("*", "nz")
		],
		function(map){
			let pmrem = pmremGenerator.fromCubemap(map)
			skybox.threeCubemap = map
			skybox.threePmrem = pmrem.texture
			resolve(skybox)
		},
		undefined,
		reject)
	
	})
}

import * as THREE from "three"
import {renderer} from "./threerenderer"
import { Skybox, SkyboxLoader } from "domain/graphics/skybox"

export class ThreeSkybox extends Skybox{
	threeCubemap:THREE.CubeTexture = undefined
	threePmrem:THREE.Texture = undefined
}

const cubeLoader = new THREE.CubeTextureLoader()
const pmremGenerator = new THREE.PMREMGenerator(renderer)
pmremGenerator.compileCubemapShader()

export class ThreeSkyboxLoader implements SkyboxLoader{
	load(
		file: string,
		onLoaded?:()=>void,
		onError?:(err:ErrorEvent)=>void
	){
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
			onLoaded()
		},
		undefined,
		onError)
	
		return skybox
	}
}
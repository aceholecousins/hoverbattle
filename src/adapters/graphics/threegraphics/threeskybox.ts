
import * as THREE from "three"
import { Skybox, SkyboxLoader } from "domain/graphics/skybox"

export class ThreeSkybox extends Skybox{
	threeCubemap:THREE.CubeTexture = undefined
}

const cubeLoader = new THREE.CubeTextureLoader()

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
			skybox.threeCubemap = map
			onLoaded()
		},
		undefined,
		onError)
	
		return skybox
	}
}
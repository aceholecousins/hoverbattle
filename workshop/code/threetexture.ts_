
yagni textures

import {Texture, TextureLoader} from "domain/graphics/asset"
import * as THREE from "three"

export class ThreeTexture implements Texture{
	kind:"texture" = "texture"
	threeTexture:THREE.Texture = undefined
}

const textureLoader = new THREE.TextureLoader()

export let loadThreeTexture:LoadAssetFunction<"texture"> = function(
	file: string,
	onLoaded?:()=>void,
	onError?:(err:ErrorEvent)=>void
){
	let texture = new ThreeTexture()

	textureLoader.load(
		file,
		function(tex){
			texture.threeTexture = tex
			onLoaded()
		},
		undefined, // onProgress not implemented by THREE.js
		onError
	)

	return texture
}

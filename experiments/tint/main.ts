import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { scene, run } from '../quickthree'

//@ts-ignore
window["THREE"] = THREE
//@ts-ignore
window["scene"] = scene

var loader = new GLTFLoader()

scene.add(new THREE.PointLight())

let model:THREE.Group

loader.load(
	'./tori.glb',
	function(gltf){
		model = gltf.scene
		scene.add(model)
		model.userData.tint = { value: new THREE.Matrix3().fromArray([0,0,1,0,1,0,1,0,0]) }
		
		for (let child of model.children){
			let mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial
			mat.onBeforeCompile = (shader, renderer)=>{
				shader.uniforms['tint'] = model.userData.tint
				shader.fragmentShader = shader.fragmentShader.replace(
					"void main() {",
					"uniform mat3 tint;\nvoid main() {"
				).replace(
					"#include <color_fragment>",
					"#include <color_fragment>\ndiffuseColor.rgb = tint * diffuseColor.rgb;"
				)
			}
		}
	}
)

scene.add(new THREE.HemisphereLight(0xffffff,0x000000))

function osc(phi:number){
	return 0.5 * Math.sin(phi) + 0.5
}

run(function(time:number){
	if(model !== undefined){
		;(model.userData.tint.value as THREE.Matrix3).fromArray([
			osc(time+1), osc(time+2), osc(time+3),
			osc(time+4), osc(time+5), osc(time+6),
			osc(time+7), osc(time+8), osc(time+9)
		])
		
	}
})




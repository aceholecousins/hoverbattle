import * as THREE from 'three'
import { scene, run } from '../quickthree'
import * as ASSETS from './assets'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

let envmap = new THREE.CubeTextureLoader()
	.setPath('./skatepark/')
	.load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']);

scene.environment = envmap
scene.background = envmap

//ASSETS mast be used. Otherwise, assets won't be copied.
ASSETS

var loader = new GLTFLoader()

scene.add(new THREE.PointLight())

loader.load(
	"../" + ASSETS.testglb,
	function(gltf){
		scene.add(gltf.scene)
		gltf.animations; // Array<THREE.AnimationClip>
		gltf.scene; // THREE.Group
		gltf.scenes; // Array<THREE.Group>
		gltf.cameras; // Array<THREE.Camera>
		gltf.asset; // Object
	},
	// called while loading is progressing
	function(xhr) {
		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
	},
	// called when loading has errors
	function(error) {
		console.log( 'An error happened' );
	}
)

run(function(time:any){})
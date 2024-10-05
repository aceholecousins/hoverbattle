import * as THREE from 'three'
import { scene, renderer, run } from '../quickthree'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'





var pmremGenerator = new THREE.PMREMGenerator(new THREE.WebGLRenderer());
pmremGenerator.compileCubemapShader();
let pmrem: any

let envmap = new THREE.CubeTextureLoader()
	.setPath('./')
	.load([
		'blue.png', 'green.png',
		'blue.png', 'green.png',
		'blue.png', 'green.png'
	], function () {
		//envmap.encoding = THREE.sRGBEncoding
		pmrem = pmremGenerator.fromCubemap(envmap);
		//pmrem.texture.magFilter = THREE.LinearFilter;
		//pmrem.needsUpdate = true;
		scene.environment = pmrem.texture
		scene.background = pmrem.texture
	});

//window["tex"] = envmap



var loader = new GLTFLoader()

let sphere = new THREE.Mesh(
	new THREE.SphereGeometry(1, 128, 128),
	new THREE.MeshStandardMaterial()
)
scene.add(sphere)
	; (window as any)["sphere"] = sphere


run(function (time: any) { })
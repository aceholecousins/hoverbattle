import * as THREE from 'three'
import { scene, run } from '../quickthree'

//@ts-ignore
window["THREE"] = THREE
//@ts-ignore
window["scene"] = scene

THREE.ShaderLib.physical.fragmentShader = THREE.ShaderLib.physical.fragmentShader.replace(
	`	#include <map_fragment>
	#include <color_fragment>`
	,
	`	#include <color_fragment>
	#include <map_fragment>`,
)

THREE.ShaderChunk.map_fragment = `
#ifdef USE_MAP
	vec4 texelColor = texture2D( map, vUv );
	texelColor = mapTexelToLinear( texelColor );
	#ifdef MOD
		diffuseColor.rgb = diffuseColor.rgb*(1.0-texelColor.a) + texelColor.rgb*texelColor.a;
	#else
		diffuseColor *= texelColor;
	#endif
#endif
`

THREE.ShaderChunk.emissivemap_fragment = `
#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vUv );
	emissiveColor.rgb = emissiveMapTexelToLinear( emissiveColor ).rgb;
	#ifdef MOD
		totalEmissiveRadiance = totalEmissiveRadiance*(1.0-emissiveColor.a) + emissiveColor.rgb*emissiveColor.a;
	#else
		totalEmissiveRadiance *= emissiveColor.rgb;
	#endif
#endif
`

let tex = new THREE.TextureLoader().load( 'test.png' )
let alpha = new THREE.TextureLoader().load( 'alpha.png' )
let stdmat = new THREE.MeshStandardMaterial({map:tex, alphaMap:alpha, color:"orange", transparent:true})
let custommat = new THREE.MeshStandardMaterial({map:tex, alphaMap:alpha, color:"orange", transparent:true})
custommat.defines["MOD"] = ""
let geom = new THREE.TorusKnotGeometry()

let m1 = new THREE.Mesh(geom, stdmat)
m1.position.setX(-2)
scene.add(m1)

let m2 = new THREE.Mesh(geom, custommat)
m2.position.setX(2)
scene.add(m2)

scene.add(new THREE.HemisphereLight(0xffffff,0x000000))

run(function(time:any){})
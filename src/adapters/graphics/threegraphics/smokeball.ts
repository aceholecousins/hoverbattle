import { broker } from "broker";
import { ExplosionConfig } from "game/graphics/fx";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

let EXPLOSION_DEBUG = false

const ASSET_PATH = "adapters/graphics/assets/"

let graphicsScene: THREE.Scene

let smokeBallMesh: THREE.Mesh;
let smokeballNormalmap: THREE.Texture
let smokeballAOmap: THREE.Texture

let renderOrder = 0;
let RENDER_ORDER: any = {};
RENDER_ORDER.terrain = renderOrder++;
RENDER_ORDER.water = renderOrder++;
RENDER_ORDER.phaser = RENDER_ORDER.phaserimpact = renderOrder++;
RENDER_ORDER.shield = renderOrder++;
RENDER_ORDER.smoke = renderOrder++;
RENDER_ORDER.explosion = renderOrder++;

export async function init(scene: THREE.Scene) {

	graphicsScene = scene

	smokeballNormalmap = await new THREE.TextureLoader().loadAsync(ASSET_PATH + 'smokeball_normal_lq.png');
	smokeballNormalmap.minFilter = THREE.LinearFilter // mip mapping causes a seam in the pacific

	smokeballAOmap = await new THREE.TextureLoader().loadAsync(ASSET_PATH + 'smokeball_ao_hc_mq.png');
	smokeballAOmap.minFilter = THREE.LinearFilter

	let smokeballVertexShader = `
		varying vec3 vLocalPosition;
		varying vec3 vGlobalPosition;
		varying vec3 vViewPosition;

		#include <common>

		void main() {
			#include <begin_vertex>
			#include <project_vertex>
			vLocalPosition = position;
			vGlobalPosition = (modelMatrix * vec4(position, 1.0)).xyz;
			vViewPosition = - mvPosition.xyz;
		}`;



	let smokeballFragmentShader = `
		uniform float coreGlowStrength;
		uniform vec3 coreColor;
		uniform vec3 smokeColor;
		uniform float smokeEmissiveness;
		uniform float opacity;

		uniform sampler2D smokeNormal;
		uniform sampler2D smokeAO;

		uniform mat3 normalMatrix;
		uniform mat4 modelMatrix;
		#include <common>

		#include <bsdfs>
		#include <lights_pars_begin>
		#include <lights_phong_pars_fragment>

		varying vec3 vLocalPosition;
		varying vec3 vGlobalPosition;

		float map(float value, float min1, float max1, float min2, float max2) {
			return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
		}

		void main() {

			float psi = atan(-vLocalPosition.x, vLocalPosition.y);
			float phi = asin(vLocalPosition.z/length(vLocalPosition));
			vec2 sphereUV = vec2(psi/2.0/PI+0.5, phi/PI+0.5);
			vec3 localNormal = normalize(texture2D(smokeNormal, sphereUV).rgb * 2.0 - 1.0);
			vec3 normal = normalize(normalMatrix * localNormal);
			float ao = texture2D(smokeAO, sphereUV).r;

			vec3 modelPos = modelMatrix[3].xyz;
			vec3 cameraPos = cameraPosition;

			float coreMask = saturate(
				coreGlowStrength *
				pow(
					dot(
						normalize(modelPos-vGlobalPosition),
						normalize(modelPos-cameraPos)
					),
					8.0
				) * normal.z * map(ao, 0.0, 1.0, 2.0, 0.5)
			);
			float smokeMask = 1.0-coreMask;


			vec4 diffuseColor = vec4( ao*smokeColor, opacity );
			ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );

			vec3 specular = vec3(0.0, 0.0, 0.0);
			float shininess = 0.0;
			float specularStrength = 0.0;

			#include <lights_phong_fragment>
			#include <lights_fragment_begin>
			#include <lights_fragment_end>

			vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular;

			vec3 smokeMix = smokeEmissiveness * smokeColor + (1.0-smokeEmissiveness) * outgoingLight;

			gl_FragColor = vec4( smokeMask * smokeMix + coreMask * coreColor, diffuseColor.a );
		}`;

	smokeBallMesh = (await new GLTFLoader().loadAsync(ASSET_PATH + 'smokeball.glb')).scene.children[0] as THREE.Mesh
	if (EXPLOSION_DEBUG && false) {
		smokeBallMesh.scale.x = smokeBallMesh.scale.y = smokeBallMesh.scale.z = 10
	}
	else {
		smokeBallMesh.scale.x = smokeBallMesh.scale.y = smokeBallMesh.scale.z = 0.0001
	}

	let uniforms = THREE.UniformsLib['lights'] as any
	uniforms.smokeNormal = { value: smokeballNormalmap }
	uniforms.smokeAO = { value: smokeballAOmap }

	let smokeballMaterial = new THREE.ShaderMaterial({ // uniforms do not get cloned (only linked) so this was necessary
		uniforms: uniforms,
		vertexShader: smokeballVertexShader,
		fragmentShader: smokeballFragmentShader,
		transparent: true,
		alphaTest: 0.01,
		lights: true
	});

	smokeBallMesh.material = smokeballMaterial;
	smokeBallMesh.renderOrder = RENDER_ORDER.explosion;

}

export function createSmokeBall(config: ExplosionConfig) {

	let color = new THREE.Color(config.color.r, config.color.g, config.color.b)

	let mesh = smokeBallMesh.clone() as THREE.Mesh;
	mesh.position.set(config.position[0], config.position[1], config.position[2])
	mesh.renderOrder = smokeBallMesh.renderOrder; // TODO: maybe remove if fixed in three.js
	let material = (smokeBallMesh.material as THREE.Material).clone() as THREE.ShaderMaterial; // so we can change the color without changing the color of all smokeballs
	material.uniforms.strength = { value: 1.1 };
	material.uniforms.coreColor = { value: new THREE.Color(0xffffff) };
	material.uniforms.coreGlowStrength = { value: 1.0 };
	material.uniforms.smokeColor = { value: color.clone() };
	material.uniforms.smokeEmissiveness = { value: 1.0 };
	material.uniforms.smokeNormal = { value: smokeballNormalmap };
	material.uniforms.smokeAO = { value: smokeballAOmap };
	material.uniforms.opacity = { value: 1.0 };
	mesh.material = material
	mesh.rotation.x = Math.random() * 1000;
	mesh.rotation.y = Math.random() * 1000;
	mesh.rotation.z = Math.random() * 1000;

	graphicsScene.add(mesh)

	let strength = 1.5
	let decay = 3.3
	let growth = 10 * config.scaling[0]

	let smokeTarget = new THREE.Color(0xbbbbbb)

	let update = function (dt: number) {
		strength -= decay * dt;
		mesh.scale.x += growth * dt;
		mesh.scale.y += growth * dt;
		mesh.scale.z += growth * dt;

		let cappedStrength = THREE.MathUtils.clamp(strength, 0.0, 1.0)
		material.uniforms.coreGlowStrength.value = cappedStrength + 0.5
		material.uniforms.coreColor.value.setRGB(1.0, 1.0, 1.0).lerp(color, 1.0 - cappedStrength)
		material.uniforms.smokeColor.value.copy(color).lerp(smokeTarget, 1.0 - cappedStrength)
		material.uniforms.smokeEmissiveness.value = 0.7 * cappedStrength
		material.uniforms.opacity.value = Math.pow(cappedStrength, 0.25)

		if (strength <= 0) {
			graphicsScene.remove(mesh)
			broker["graphicsUpdate"].removeHandler(update)
		}
	}

	broker["graphicsUpdate"].addHandler(update)
}

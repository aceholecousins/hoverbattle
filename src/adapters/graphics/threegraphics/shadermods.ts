
import * as THREE from "three"
import { broker } from "broker"
import { ThreeWater } from "./threewater"

export function modMaterials(
	object: THREE.Object3D,
	tintUniform: { value: THREE.Matrix3 },
	water: ThreeWater
) {

	if (object.type === "Mesh") {
		let mesh = object as THREE.Mesh
		let mat = mesh.material as THREE.Material

		if (!mat.userData.isWater && !mat.userData.useTinting) {
			return
		}

		mesh.material = mat.clone()
		mat = mesh.material

		if (mat.userData.isWater) {
			water.sceneHasWater = true

			if (mat.type === "MeshStandardMaterial") {
				let frequency = mat.userData.waveFrequency ?? 0.5
				let amplitude = mat.userData.waveAmplitude ?? 0.2
				let turbulence = mat.userData.turbulenceRadius ?? 0.1
				let speed = mat.userData.uvFlowSpeed ?? 0.03

				let timeUniform = { value: 0 }
				broker.update.addHandler((e: any) => { timeUniform.value += e.dt })

				let obcBefore = mat.onBeforeCompile
				mat.onBeforeCompile = (shader, renderer) => {
					if (obcBefore !== undefined) {
						obcBefore(shader, renderer)
					}

					shader.uniforms['time'] = timeUniform
					shader.uniforms['resolution'] = water.resolutionUniform
					shader.uniforms['rippleMap'] = water.normalTextureUniform

					let chunk = ""
					for (let angle = 0.001; angle < 2 * Math.PI; angle += 2 * Math.PI / 3) {
						chunk += `{
							mat2 rotmat = mat2(${Math.cos(angle)}, ${-Math.sin(angle)}, ${Math.sin(angle)}, ${Math.cos(angle)});
							vec3 normalPart = texture2D( normalMap, rotmat * vNormalMapUv + vec2(time*${speed}, ${angle}) ).xyz * 2.0 - 1.0;
							normalPart.xy = rotmat * normalPart.xy;
							normal += normalPart;
						}
						`
					}

					shader.fragmentShader = `#define USE_NORMALMAP_OBJECTSPACE
						uniform float time;
						uniform vec2 resolution;
						uniform sampler2D rippleMap;
						`
						+ shader.fragmentShader.replace(
							"\t#include <normal_fragment_maps>",
							chunk + `
								vec3 ripple = texture2D( rippleMap, gl_FragCoord.xy / resolution ).rgb * 2.0 - 1.0;
								normal += 3.0 * ripple;
								#ifdef FLIP_SIDED
									normal = - normal;
								#endif
								#ifdef DOUBLE_SIDED
									normal = normal * faceDirection;
								#endif
								normal = normalize( normalMatrix * normal );
							`
						)

					shader.vertexShader = "\nuniform float time;\n"
						+ shader.vertexShader.replace(
							"#include <displacementmap_vertex>",
							`
								float w1 = ${2 * Math.PI * frequency} * (0.9 + 0.2*rand(position.xy));
								float w2 = ${2 * Math.PI * frequency} * (0.9 + 0.2*rand(position.yx));
								float phi = ${2 * Math.PI} * rand(position.yx);
								transformed += vec3(
									${turbulence} * sin(w1 * time + phi),
									${turbulence} * cos(w1 * time + phi),
									${amplitude} * sin(w2 * time + phi)
								);
							`
						)

				}
			}
			else {
				console.error("Only MeshStandardMaterial is supported for water, not ", mat.type)
			}
		}

		if (mat.userData.useTinting) {
			mat.userData.tintMatrix = tintUniform

			if (mat.type === "MeshBasicMaterial") {
				let obcBefore = mat.onBeforeCompile
				mat.onBeforeCompile = (shader, renderer) => {
					if (obcBefore !== undefined) {
						obcBefore(shader, renderer)
					}

					shader.uniforms['tint'] = tintUniform
					shader.fragmentShader = shader.fragmentShader.replace(
						"void main() {",
						"uniform mat3 tint;\n" +
						"void main() {"
					).replace(
						"vec3 outgoingLight = reflectedLight.indirectDiffuse;",
						"vec3 outgoingLight = tint * reflectedLight.indirectDiffuse;"
					)
					console.assert(
						shader.fragmentShader.includes("mat3 tint;")
						&& shader.fragmentShader.includes("tint * ref"),
						"tint injection failed, shader code must have changed"
					);
				}
			}
			else if (mat.type === "MeshStandardMaterial") {
				let obcBefore = mat.onBeforeCompile
				mat.onBeforeCompile = (shader, renderer) => {
					if (obcBefore !== undefined) {
						obcBefore(shader, renderer)
					}

					shader.uniforms['tint'] = tintUniform
					shader.fragmentShader = shader.fragmentShader.replace(
						"void main() {",
						"uniform mat3 tint;\n" +
						"void main() {"
					).replace(
						"#include <color_fragment>",
						"#include <color_fragment>\n" +
						"diffuseColor.rgb = tint * diffuseColor.rgb;"
					).replace(
						"#include <emissivemap_fragment>",
						"#include <emissivemap_fragment>\n" +
						"totalEmissiveRadiance = tint * totalEmissiveRadiance;"
					)
					console.assert(
						shader.fragmentShader.includes("mat3 tint;")
						&& shader.fragmentShader.includes("tint * diff")
						&& shader.fragmentShader.includes("tint * total"),
						"tint injection failed, shader code must have changed"
					);
				}
			}
			else {
				console.error("Unsupported material type for tinting: ", mat.type)
			}
		}

	}

	for (let child of object.children) {
		modMaterials(child, tintUniform, water)
	}
}

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
		if (mat.side !== undefined) {
			mat.side = THREE.FrontSide
		}

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

					let chunk = "vec3 disturbanceSum = vec3(0.0, 0.0, 0.0);\n\n"

					// we don't start at 0 because ${0.0} becomes "0" and int instead of float doesn't compile
					for (let angle = 0.1; angle < 2 * Math.PI; angle += 2 * Math.PI / 3) {
						const s = Math.sin(angle)
						const c = Math.cos(angle)
						const rot2d = `mat2(${c}, ${-s}, ${s}, ${c})`
						chunk += `{
							vec3 noise = texture2D( normalMap, ${rot2d} * vNormalMapUv + vec2(time*${speed}, ${angle}) ).xyz * 2.0 - 1.0;
							noise.xy = ${rot2d} * noise.xy;
							disturbanceSum += noise;
						}
						`
					}

					chunk += `
						vec3 ripples = texture2D( rippleMap, gl_FragCoord.xy / resolution ).rgb * 2.0 - 1.0;
						disturbanceSum += 2.0 * ripples;

						#ifdef FLIP_SIDED
							disturbanceSum = - disturbanceSum;
						#endif
						#ifdef DOUBLE_SIDED
							disturbanceSum = disturbanceSum * faceDirection;
						#endif
						normal = normalize(normal + normalMatrix * disturbanceSum);
					`

					shader.fragmentShader = `#define USE_NORMALMAP_OBJECTSPACE
						uniform float time;
						uniform vec2 resolution;
						uniform sampler2D rippleMap;
						`
						+ shader.fragmentShader.replace(
							"\t#include <normal_fragment_maps>",
							chunk
						)

					//shader.fragmentShader = shader.fragmentShader.substring(0,shader.fragmentShader.length-1) + "gl_FragColor = vec4(normal * 0.5 + 0.5, 1.0);}"

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
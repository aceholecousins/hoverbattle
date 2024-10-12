
import { SceneInfo } from "./sceneinfo"
import { ThreeGraphics } from "./threegraphics"
import { renderer } from "./threerenderer"
import { GraphicsController } from "game/graphics/graphicscontroller"
import { vec3 } from "gl-matrix"
import { Skybox } from "game/graphics/asset"
import { ThreeSkybox } from "./threeskybox"
import { LightProbeGenerator } from 'three/examples/jsm/lights/LightProbeGenerator.js'
import * as THREE from "three"
import { Model } from "game/graphics/asset"
import { ThreeModel } from "./threemodel"
import { broker } from "broker"

export class ThreeGraphicsController implements GraphicsController {

	graphics: ThreeGraphics

	constructor(graphics: ThreeGraphics) {
		this.graphics = graphics

		broker.newChannel("graphicsUpdate")

		const resize = () => {
			renderer.setSize(
				renderer.domElement.clientWidth,
				renderer.domElement.clientHeight,
				false
			)
		}

		window.addEventListener('resize', resize)
		resize()
	}

	setEnvironment(env: Skybox) {
		this.graphics.scene.background = (env as ThreeSkybox).threeCubemap
		this.graphics.scene.environment = (env as ThreeSkybox).threePmrem
	}

	setEnvironmentOrientation(ypr: vec3) {
		this.graphics.scene.backgroundRotation.set(ypr[2], ypr[1], ypr[0], "XYZ")
		this.graphics.scene.environmentRotation.set(ypr[2], ypr[1], ypr[0], "XYZ")
	}

	update(time: number) {
		broker["graphicsUpdate"].fire(1 / 60)
		renderer.render(
			this.graphics.scene,
			(this.graphics.scene.userData as SceneInfo).activeCamera
		)
	}
}
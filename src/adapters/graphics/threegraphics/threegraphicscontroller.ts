
import {SceneInfo} from "./sceneinfo"
import {ThreeGraphics} from "./threegraphics"
import {GraphicsController} from "domain/graphics/graphicscontroller"
import { quat } from "gl-matrix"
import { Skybox } from "domain/graphics/skybox"
import { ThreeSkybox } from "./threeskybox"
import { LightProbeGenerator } from 'three/examples/jsm/lights/LightProbeGenerator.js'
import * as THREE from "three"

export class ThreeGraphicsController implements GraphicsController{

	graphics:ThreeGraphics

	constructor(graphics:ThreeGraphics){
		this.graphics = graphics

		const resize = ()=>{
			graphics.renderer.setSize(
				graphics.canvas.clientWidth,
				graphics.canvas.clientHeight,
				false
			)

			const cam = (graphics.scene.userData as SceneInfo).activeCamera
			cam.aspect = graphics.canvas.clientWidth / graphics.canvas.clientHeight
			cam.updateProjectionMatrix()
		}
		
		window.addEventListener('resize', resize)
		resize()
	}

	setSceneOrientation(q:quat){
		this.graphics.scene.quaternion.set(q[0], q[1], q[2], q[3])
	}

	setEnvironment(env:Skybox){
		let cubeMap = (env as ThreeSkybox).threeCubemap

		this.graphics.scene.background = cubeMap
		this.graphics.scene.environment = cubeMap

		let lightProbe = new THREE.LightProbe()
		this.graphics.scene.add( lightProbe )

		lightProbe.copy( LightProbeGenerator.fromCubeTexture( cubeMap ) )
	}

	update(time: number){
		this.graphics.renderer.render(
			this.graphics.scene, 
			(this.graphics.scene.userData as SceneInfo).activeCamera
		)
	}
}
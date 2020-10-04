import { Graphics } from "domain/graphics/graphics";
import { vec3 } from "gl-matrix";
import { Camera } from "domain/graphics/camera";
import { SceneNode } from "domain/graphics/scenenode";



class ActionCam{

	constructor(
		camera:Camera,
		up:vec3,
		forward:vec3,
		dMin:number, // minimum distance from 000 along -forward
	){

	}

	keepInView(thing:SceneNode<any>, radius:number){

	}

}
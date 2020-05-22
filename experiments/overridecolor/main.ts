import * as THREE from 'three'
import { scene, run } from '../quickthree'
import * as ASSETS from './assets'

ASSETS

let sun = new THREE.PointLight()
sun.position.set(0,0,3)
scene.add(sun)

let sphereGeometry = new THREE.SphereGeometry(1, 20, 20)
let parentMaterial = new THREE.MeshStandardMaterial({color: new THREE.Color("red"), metalness:0})

let mesh1 = new THREE.Mesh(sphereGeometry, parentMaterial)
scene.add(mesh1)


let childMaterial = Object.create(parentMaterial, {color: new THREE.Color("green")})

let mesh2 = new THREE.Mesh(sphereGeometry, childMaterial)
mesh2.position.x = 2
scene.add(mesh2)

;(window as any).scene = scene

run(function(time:any){})
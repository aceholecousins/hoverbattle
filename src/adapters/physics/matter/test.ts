
import * as Matter from 'matter-js'

const { Engine, Render, Runner, Bodies, World } = Matter;

console.log(Matter)

Matter.Detector.canCollide = function(){return false}

const engine = Engine.create();
const world = engine.world;

const render = Render.create({
	element: document.body,
	engine: engine,
	options: { width: 800, height: 600 }
});

const ground = Bodies.rectangle(400, 580, 810, 60, { isStatic: true });
const ball = Bodies.circle(400, 100, 50);


World.add(world, [ground, ball]);

Render.run(render);
Runner.run(Runner.create(), engine);

export let test=5
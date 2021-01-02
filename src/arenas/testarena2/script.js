
// this is still highly prototypical
// typescript somehow needs to be involved

devlog: irgendwie muss das Level ts Zugriff auf die anderen Module bekommen (?)

let terrainActor = {
	roles:{
		bits: 1,
		mask: 0,
		list:[
			{
				bit:1,
				mask:0
			}
		]
	}
}

let arena = graphics.arena.load(
	"arenas/testarena2/testarena2.glb",
	function(info){

		for(tri of info.boundary){
			physics.addRigidBody(
				{
					actor:terrainActor,
					mass:Infinity,

					position:[0, 0],
					velocity:[0, 0],
					damping:0,
				
					angle:0,
					angularVelocity:0,
					angularDamping:0,

					shapes:[{kind:"triangle", corners:tri}]
				}
			)
		}

		graphics.mesh.createFromModel({
			kind:"mesh",
			asset:arena,
			position:[0,0,0],
			orientation:[0,0,0,1],
			scaling:[1,1,1]
		})
	}
)


let env = graphics.skybox.load(
	"arenas/testarena2/environment/*.jpg",
	function(){
		graphics.control.setEnvironment(env)
	}
)


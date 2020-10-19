

let arena = graphics.model.load(
	"arenas/testarena2/testarena2.glb",
	function(meta){

		for(tri of meta.collision){
			physics.addRigidBody(
				{
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


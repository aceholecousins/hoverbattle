

let arena = graphics.model.load(
	"arenas/testarena2/testarena2.glb",
	function(){
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


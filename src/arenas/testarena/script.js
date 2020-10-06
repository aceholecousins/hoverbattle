
let arena = graphics.model.load(
	"arenas/testarena/testarena.glb",
	function(){
		console.log(arena)
		graphics.mesh.createFromModel({
			kind:"mesh",
			asset:arena,
			position:[0,0,0],
			orientation:[0,0,0,1],
			scaling:[1,1,1]
		})
	}
)

interface Entity{
	id:number
	kind:string
	body:PhysicsBody
	model:GraphicsModel
	exert(influence:Influence)
	update()
}
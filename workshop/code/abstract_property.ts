
class PropBase{
	a:number
}
class PropChild extends PropBase{
	b:number
}

class Base{
	p: PropBase;
	constructor(p:PropBase){
		this.p = p
	}
}
class Child extends Base{
	p: PropChild
	constructor(p:PropChild){
		super(p)
		console.log(this.p)
	}
}

let c = new Child({a:111, b:222})
console.log(c)
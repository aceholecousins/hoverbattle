
let worker = new Worker("worker.js")

let divs:any[] = []

let first = true
worker.onmessage = function(e){
	let positions = e.data
	if(first){
		first = false
		for(let i = 0; i < positions.length; i++){
			let div = document.createElement("div")
			div.style.position = "absolute"
			div.style.left = "0px"
			div.style.top = "0px"
			div.style.width = "10px"
			div.style.height = "10px"
			div.style.display = "block"
			div.style.backgroundColor = "white"
			div.style.borderRadius = "5px"
			div.style.border = "solid 1px red"
			divs.push(div)
			document.body.appendChild(div)
		}
	}
	for(let i = 0; i < positions.length; i++){
		divs[i].style.left = window.innerWidth/2 + positions[i].x*5 + "px"
		divs[i].style.top = window.innerHeight/2 + positions[i].y*5 + "px"
	}
}
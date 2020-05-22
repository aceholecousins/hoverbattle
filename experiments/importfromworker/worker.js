console.log("hi from worker!")

import("./import.js")
	.then(
		function(){
			console.log("imported in worker")
		}
	)
	.catch(
		function(){
			console.log("!!!! CATCH IN WORKER !!!!")
		}
	)

console.log("synchronous import:")
importScripts('./import.js')
console.log("synchronous import done.")

console.log("asynchronous import:")
setTimeout(function(){
	importScripts('./import.js')
	console.log("asynchronous import done.")
}, 0)
console.log("after asynchronous import.")

eval("console.log('hi out of eval')")
let evalstring = ""
eval("evalstring = 'hi from evaled stuff!'")
console.log(evalstring)


let counter = 5
for(let i=0; i<100; i++){
	importScripts('./increaser.js')
}
console.log(counter)

import {WorkerBridge} from "./workerbridge"

let bridge = new WorkerBridge("worker.js")

let myObj = {
	property:0,
	name:"Fred",

	body:{leg:{foot:{toe:{
		nail:"long"
	}}}},

	method(arg1:number, arg2:number, arg3:number){
		console.log("called myObj.method(", arg1, ",", arg2, ",", arg3, ")")
	},

	callMeBack(cb:Function){
		setTimeout(()=>{
			console.log("----------------------------")
			console.log("remote side inside callMeBack(cb):")
			console.log('cb("ding")')
			cb("ding!")
			bridge.sendAll()
			console.log("----------------------------")
		}, 200)
	},

	useNestedCallback(arg:any){
		setTimeout(()=>{
			console.log("----------------------------")
			console.log("remote side inside useNestedCallback(arg):")
			console.log('arg.child.cb("dong!")')
			arg.child.cb("dong!")
			bridge.sendAll()
			console.log("----------------------------")
		}, 400)
	},

	sayTheName(thing:any){
		console.log("----------------------------")
		console.log("remote side inside sayTheName(thing):")
		console.log('console.log(thing.name)')
		console.log(thing.name)
		console.log("----------------------------")
	},

	dispose(){
		console.log("----------------------------")
		console.log("remote side: dispose() called on myObj")
		console.log("----------------------------")		
	}
}

console.log("----------------------------")
console.log('remote side: bridge.register(myObj, "myObj")')
bridge.register(myObj, "myObj")
console.log('bridge.registry["myObj"] now points to myObj')
console.log("----------------------------")

setTimeout(function(){
	console.log("myObj is now:")
	console.log(JSON.stringify(myObj))
}, 1000)
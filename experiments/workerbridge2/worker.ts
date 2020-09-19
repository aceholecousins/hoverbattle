
import {WorkerBridge} from "./workerbridge"
import { assert } from "chai"

let bridge = new WorkerBridge()

console.log("----------------------------")

console.log('let myObj = bridge.createProxy("myObj") as any')
let myObj = bridge.createProxy("myObj") as any
console.log('myObj now contains a proxy to the remote object registry["myObj"]')
bridge.sendAll()
console.log("(nothing is sent)")

console.log("----------------------------")

console.log("myObj.property = 5")
myObj.property = 5
bridge.sendAll()

console.log("----------------------------")

console.log("let toe = myObj.body.leg.foot.toe")
let toe = myObj.body.leg.foot.toe
bridge.sendAll()
console.log("(does not send anything, only creates a new proxy that knows its relation to myObj)")

console.log("----------------------------")

console.log('toe.nail = "short"')
toe.nail = "short"
bridge.sendAll()
console.log(`Now toe gets linked to myObj.body.leg.foot.toe on the remote side.
Both sides increase an index counter, the proxy stores the index
and the remote side creates
registry[index] = registry["myObj"].body.leg.foot.toe
Then we send a message changing registry[index]`)

console.log("----------------------------")

console.log('myObj.body.leg.foot.toe.nail = "crazy short"')
myObj.body.leg.foot.toe.nail = "crazy short"
bridge.sendAll()
console.log("as the toe is already linked, only a set message is sent")

console.log("----------------------------")

console.log('let myResult = myObj.method(1, 2, 3)')
let myResult = myObj.method(1, 2, 3)
bridge.sendAll()
console.log(`remote and local index counter are increased,
the local side gets a new proxy with the index, remote side does:
registry[index] = registry["myObj"].method(1, 2, 3)`)

console.log("----------------------------")

console.log('function ring(sound:string){console.log(sound)}')
function ring(sound:string){
	console.log("----------------------------")
	console.log("inside callback:")
	console.log("console.log(sound)")
	console.log(sound)
	console.log("----------------------------")
}
console.log('myObj.callMeBack(ring)')
myObj.callMeBack(ring)
bridge.sendAll()
console.log(`Each time "call" or "set" are used, the argument
is scanned for functions, they are stored locally (with a new local index)
and the remote side receives a proxy.
{__cb__:"new"} means a new callback (gets a new index)
{__cb__:27} means that the already known callback with index 27 is used
{__cb__:true, ...} means that this object has callbacks somewhere nested in it`)

console.log("----------------------------")

console.log('myObj.useNestedCallback({child:{age:13, cb:ring}, misc:"0815"})')
myObj.useNestedCallback({child:{age:13, cb:ring}, misc:"0815"})
bridge.sendAll()

console.log("----------------------------")

console.log('myObj.sayTheName(myObj)')
myObj.sayTheName(myObj)
bridge.sendAll()
console.log(`proxy objects as arguments are resolved`)

console.log("----------------------------")

setTimeout(function(){
	console.log('myObj.dispose()')
	myObj.dispose()
	bridge.sendAll()
	assert(myObj.__ref__ === undefined)
}, 500)
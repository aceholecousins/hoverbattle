//@ts-ignore
if(typeof(window) === "undefined"){importScripts("bridge.js")}

//@ts-ignore
dynamicImport("twilight.js", function(twilight:any){
	setTimeout(function(){
		twilight.myWorkerFunction("called from window")
		twilight.myWindowFunction("called from window")
	}, 100)
})


export const DEBUG = false
export const IN_WINDOW = typeof(window) !== "undefined" && "document" in window
export const IN_WORKER = !IN_WINDOW
export const DBG_ME = IN_WORKER? "worker" : "window"
export const DBG_OTHER = IN_WORKER? "window" : "worker"

export function DBG_LOG(...msgs:any[]){
	if(DEBUG){
		console.log(...msgs)
	}
}

let functionCache: { [key: string]: Function } = {}

// the call is synchronous (i.e. onLoaded is executed right away)
// if the function script is already cached, otherwise it is asynchronous
export function executeFile(
	url: string,
	args: Object,
	onLoaded: (returned: any) => void,
	onError?: (err: ProgressEvent<XMLHttpRequestEventTarget>) => void
) {
	if (url in functionCache) {
		let returned = functionCache[url](args)
		onLoaded(returned)
	}
	else {
		var request = new XMLHttpRequest()

		request.addEventListener("load", function () {
			let fnBody = this.responseText
			let fn = new Function("{" + Object.keys(args).join() + "}", fnBody)
			functionCache[url] = fn
			let returned = fn(args)
			onLoaded(returned)
		})

		if (onError !== undefined) {
			request.addEventListener("error", onError)
			request.addEventListener("abort", onError)
		}

		request.open("GET", url)
		request.send()
	}
}
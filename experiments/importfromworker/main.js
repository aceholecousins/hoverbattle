
var worker = new Worker('worker.js')

import("./import.js")
	.then(
		function () {
			console.log("imported in window")
		}
	)
	.catch(
		function () {
			console.log("!!!! CATCH IN WINDOW !!!!")
		}
	)


const myWorker = new Worker("worker.js");

myWorker.onmessage = function (e) {
	console.log(e.data);
}

const n = 1000

for (let k = 0; k < 10; k++) {

	t0 = performance.now()
	let msg = []
	for (let i = 0; i < n; i++) {
		msg.push({ txt: "txt", 2: 2, 3: ["three"] })
	}
	myWorker.postMessage(msg)
	t1 = performance.now() - t0

	t0 = performance.now()
	for (let i = 0; i < n; i++) {
		myWorker.postMessage({ txt: "txt", 2: 2, 3: ["three"] })
	}
	t2 = performance.now() - t0

	console.log(t1 * 1000 / n)
	console.log(t2 * 1000 / n)
	console.log(t2 / t1)
	console.log("----------")

}

const ctx: Worker = self as any;

ctx.onmessage = function(e) {
	ctx.postMessage({
		x: e.data.x + 0.01,
		y: e.data.y + 0.02,
		z: e.data.z + 0.03,
	})
}
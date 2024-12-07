
gl-matrix is a pain in the ass with its out parameters and it isn't even fast anymore.

https://github.com/toji/gl-matrix/issues/359

A shame we married it.

However, there isn't really a good alternative out there. The best thing is the math library inside three.js but we don't want to marry three.js and I also don't want to wrap the math module. However, there is a project that ripped just the math module out of three.js: https://github.com/ros2jsguy/threejs-math. Howeverever, seems it's no longer maintained. I checked if the math module in three.js changed since then and it actually did here and there.

So I wrote a custom three-js-math-outripper, see workshop/threemath/threemath-extractor.py. It queries what the most recent version of @types/three is and installs that version of the three types and three.js. It then cuts the math folder out, modifies imports, mocks imports from outer folders and creates an index file.

There are several ways we can use that. We can just copy it into the src folder and it lives there. We can create an npm package but then we have to maintain it. We can place it somewhere and link it from inside node_modules.

For now however, we don't need it since we actually use three.js. Then we don't have any awkwardness with the code completion not being able to decide where to import from. So we can marry the math from three.js and if we ever ditch three.js, we can still extract and use its math.

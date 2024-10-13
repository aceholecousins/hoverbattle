
# glTF and normal maps

We want object space normal maps and gltf does not support them. We can manually select object space after import but that leads to surprises (see most annoying bug hunt below). We must somehow make this an explicit and unoverlookable-if-chosen choice, for which there are some options:

* filename myArena.osn.glb - osn for object space normals, this would be somewhat consistent with .tint.png for signaling that colors will be multiplied with a tint matrix
* create an empty coordinate frame named `__use_object_space_normal_maps__` or something
* use object space normals if normals are not included in vertex information (I find this the most elegant but also the easiest to overlook and also vertex information is part of the geometry where objectSpace flag is part of the material, so this is also the least elegant)
* complain here https://github.com/KhronosGroup/glTF/issues/1284 and wait until this is implemented in blender and threejs

# Most Annoying Bug Hunt

I have refactored the arena import, so I had to change the arena a little. I opened the glb in blender, made the changes (spawn points are now coordinate systems and not triangles anymore), saved it and done.

But suddenly the scene looked a bit weird in the game. Just different. Something about the normals. I opened the old and the new glb in blender and in the threejs editor and they looked identical... Problem must be on the game side then.

I commented the spawning mechanism code so I could open both the old and the new glb inside the game, and they looked clearly different. I analyzed the scenes and the materials via console.log but I couldn't find any difference. I disabled the normal maps, then the arenas looked the same. I copied the normal maps into the pigment maps to see them, they looked the same. But the normals were clearly different!!! I replaced the arena geometries with box geometries, still somehow different normals. I was already considering posting both glb files on some forum to ask what's going on.

I exported both glbs as json objects so I could analyze them in a text editor. It didn't really work since both were 5MB but I could see that the textures were the same.

Then I converted both glb files to gltf files so I could see the differences in meld. And there it was. In the new glb, the point coordinates of the mesh were rotated about x and the mesh itself was rotated back (via transform relative to parent). Blender has an export "feature" where you can check "+y points up". Which is apparently what I did (I didn't check it, I just didn't uncheck it). After that the arena had the wrong orientation in the game but instead of changing the checkmark, I rotated the mesh. Forgot about that.

That explains why the new arena looks different. Normals are in object space. Rotating the point coordinates without swapping color channels in the normal map will result in different normals. Changing the orientation in relation to the parent will both rotate the points as well as the already wrong normals as if they were correct. So it made sense that the normals are now wrong. But then why do they look identical in both blender and threejs editor?

I created a test suzanne in blender and imported it in threejs editor. It looked crap. Seams everywhere and also normals just wrong in general. All my test meshes also looked even crappier in whatever gltf viewer I tried.

Multiple long stories short, here is a list of things I don't want to have to figure out ever again:

- for baking normals in blender, you need to select the cycles engine
- reduce max samples to 8
- performance -> memory -> tile size 128
- Shading tab -> add -> Texture -> Image Texture -> new -> ... -> Color Space -> Linear
- Bake -> Bake Type -> Normal -> Space -> Object (?)
- when wanting to use the baked normal map: add -> Vector -> Normal Map node -> select Object Space
- feed the texture color into the normal map node, feed the normal into the BSDF node

Finally the suzanne with normal map image looked exactly the same as without.

When I saw that selecting object space in the normal map node made some seams disappear, it dawned on me that this maybe does not get exported to glb.

And then it double dawned on me that that's why both arenas looked identical in blender and threejs editor, they were interpreting the normal maps in tangent space and the actual images were the same, as well as the tangent spaces on unrotated and rotated point coordinates.

And then I saw that I manually switched all materials to objectSpace normal maps after glb import in the game (3 years ago).

And then I found this: https://github.com/KhronosGroup/glTF/issues/1284
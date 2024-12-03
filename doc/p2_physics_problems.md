
When I switched from gliders being circular to triangle based, they bounced around the world and glitched in the environment. I removed all but one triangles from arena and glider and managed to get this undetected intersection. The glider is then ejected downwards, once the next vertex comes into contact.

Created an issue [here](https://github.com/pmndrs/p2-es/issues/163).


There is also [this](https://github.com/schteppe/p2.js/issues/372) issue:

In the depicted case, the collision is missed. For each edge of the convex shape (box), the engine looks for the point on the circle that is furthest in the direction which is normal to the edge and checks whether it is inside the convex. This is not the case for any edge in the depicted scenario. It will successfully detect the collision if the circle slowly moves into the box but if the circle exceeds the back wall of the box in one step, the collision will be missed.


Since p2.js is no longer maintained and neither seems p2 es, I am considering switching to another physics engine, who knows what else pops up.

Candidates: https://daily.dev/blog/top-9-open-source-2d-physics-engines-compared
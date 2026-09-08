
this file lists all planck-specific info that I just got from the manual

Shapes only have geometrical properties (such as vertices or radius), and do not have physical properties. A fixture is used to add a shape to a body, and adds physical properties (such as density, friction, etc.) to a body. A body can have any number of shapes fixed together.

Fixture
A fixture binds a shape to a body and adds physical properties such as density, friction, and restitution. A fixture puts a shape into the collision system (broad-phase) so that it can collide with other shapes.

Shape's geometrical coordinates are local to the body. A fixture does not have location and angle. So when a body moves, all fixtures/shapes in the body move with the body. However we don't move a shape around on the body.

Fixtures hold the following:

a single shape
broad-phase proxies
density, friction, and restitution
collision filtering flags
back pointer to the parent body
user data
sensor flag


A static body has zero mass by definition

Planck.js has been tuned to work well with moving shapes between 0.1 and 10 units (meters). So this means objects between soup cans and buses in size should work well. Static shapes may be up to 50 meters long without trouble.


Planck.js uses radians for angles. The body rotation is stored in radians and may grow unbounded. Consider normalizing the angle of your bodies if the magnitude of the angle becomes too large (use body.setAngle).



Implicit Destruction
Often when using Planck.js you will create and destroy many bodies, shapes, and joints. Managing these entities is somewhat automated by Planck.js. If you destroy a body then all associated shapes and joints are automatically destroyed. This is called implicit destruction.

When you destroy a body, all its attached shapes, joints, and contacts are destroyed. Any body connected to one of those joints and/or contacts is woken. This process is usually convenient. However, you must be aware of one crucial issue:

Caution: When a body is destroyed, all fixtures and joints attached to the body are automatically destroyed. You must nullify any references you have to those shapes and joints. Otherwise, your program will die horribly if you try to use those fixtures or joints later.

To help you nullify your references, Planck.js world publishes events (remove-joint, remove-fixture, remove-body) that you can listen to. Then the world object will notify you when an object is going to be implicitly destroyed.


world.on('remove-joint', function(joint) {
  // remove all references to joint.  
});
world.on('remove-fixture', function(fixture) {
  // remove all references to fixture.
});
world.on('remove-body', function(body) {
  // bodies are not removed implicitly,
  // but the world publishes this event if a body is removed
})


The Fixture, Body, and Joint classes allow you to attach user data.


for (let b = myWorld.getBodyList(); b; b = b.getNext()) {
  ...
}
Everything goes ok until a body is destroyed. Once a body is destroyed, its next pointer becomes invalid. So the call to body.getNext() will return garbage. The solution to this is to copy the next pointer before destroying the body.

static/kinematic/dynamic - kinematic: moves with infinite mass



Damping is approximated for stability and performance. At small damping values the damping effect is mostly independent of the time step. At larger damping values, the damping effect will vary with the time step. This is not an issue if you use a fixed time step (recommended).


Fast moving objects in Planck.js can be labeled as bullets. Bullets will perform CCD with both static and dynamic bodies



The mass of a body is not adjusted when you set the density. You must call resetMassData for this to occur.


fixture.setDensity(5);
body.resetMassData();



Planck.js must combine the friction parameters of the two parent fixtures. This is done with the geometric mean:


function mixFriction(friction1, friction2) {
  return Math.sqrt(friction1 * friction2);
}
So if one fixture has zero friction then the contact will have zero friction.

You can override the default mixed friction using contact.setFriction. This is usually done in the contact listener callback.

function mixRestitution(restitution1, restitution2) {
  return Math.max(restitution1, restitution2);
}



Planck.js also uses inelastic collisions when the collision velocity is small. This is done to prevent jitter. See Settings.velocityThreshold.


A fixture on a static body can only collide with a dynamic body.
A fixture on a kinematic body can only collide with a dynamic body.
Fixtures on the same body never collide with each other.
You can optionally enable/disable collision between fixtures on bodies connected by a joint.

let hit = shape.testPoint(transform, point);

Transform xfA = ..., xfB = ...;
bool overlap = TestOverlap(shapeA, indexA, shapeB, indexB, xfA, xfB);


Polygon vertices are stored with a counter-clockwise winding (CCW). We must be careful because the notion of CCW is with respect to a right-handed coordinate system with the z-axis pointing out of the plane.


You can create a polygon shape by passing in a vertex array. The maximal size of the array is controlled by Setting.MaxPolygonVertices which has a default value of 8.


Polygons inherit a radius from Shape. The radius creates a skin around the polygon. The skin is used in stacking scenarios to keep polygons slightly separated. This allows continuous collision to work against the core polygon.


All joints have a reaction force and torque. This the reaction force applied to body 2 at the anchor point.


A contact normal is a unit vector that points from one shape to another. By convention, the normal points from fixtureA to fixtureB.


Accessing Contacts
You can get access to contacts in several ways. You can access the contacts directly on the world and body structures. You can also implement a contact listener.

You can iterate over all contacts in the world:


for (let c = myWorld.getContactList(); c; c = c.getNext()) {
  // process c
}
You can also iterate over all the contacts on a body. These are stored in a graph using a contact edge structure.


for (let ce = myBody.getContactList(); ce; ce = ce.next) {
  let c = ce.contact;
  // process c
}
You can also access contacts using the contact listener that is described below.

Caution: Accessing contacts off World and Body may miss some transient contacts that occur in the middle of the time step. Use ContactListener to get the most accurate results.

Contact Events
You can receive contact data by adding event listeners to world. The World supports several events: begin-contact, end-contact, pre-solve, and post-solve.


world.on('begin-contact', function(contact) {
  /* handle begin event */
});
world.on('end-contact', function(contact) {
  /* handle end event */
});
world.on('pre-solve', function(contact, oldManifold) {
  /* handle pre-solve event */
});
world.on('post-solve', function(contact, contactImpulse) {
  /* handle post-solve event */
});
Caution: Do not keep a reference to the pointers sent to ContactListener. Instead make a deep copy of the contact point data into your own buffer.


The ray-cast ignores shapes that contain the starting point.
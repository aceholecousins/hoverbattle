This was a todo: powerups should not be bounced against when collected

This is a bit tricky. A powerup has a mass and a glider collecting a powerup is triggered after the impact. Or we ignore the collision but then it's not triggered. We can either create either restore the glider velocity after collecting a powerup (which is bad because it will also ignore other simultaneous collisions that should not be ignored) or we ignore the collision but the powerup drags a glider detector around which has mass 0 but that's a bit ugly.
Or we just live with the fact that gliders get slowed down by colliding with powerup boxes :)
p2 has sensors, maybe we can somehow implement that but probably still tricky because the powerups are supposed to collide normally with other objects
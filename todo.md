
Debug:

* the gliders glitch through the walls but not all walls <- probably solved when ditching p2 for planck
* sometimes if they collect a powerup, it gets collected multiple times
* makes me think that the shapes are in there multiple times, gonna random wiggle each point a bit
* somehow seems to glitch only form the inside of the level, not once it's already left the arena and wants to go back in <- probably solved when ditching p2 for planck
* missiles not homing anymore
* planck just glitched out when I collected a shield while nashwan was running
* if colliding gliders both have power shields, they get shot apart
* shooting missiles while having powershield makes the missiles explode right away

Features:

* shake camera upon explosion
* glider jumps around after spawning
* reset() everything on game end? (alternatively reload the window...)
* coast looks shit (maybe white foam as part of mountain texture, semi covered by waves?)
* mine color
* the powerup boxes need more pizzazz, they somehow fade into the background. Emissiveness?
* implement standard shields and phaser charge
* remove all traces of nashwan and xenon
* things should not spawn into each other, have more spawning points or maybe spawning areas and also check if a spawn place is free
* refactor this extra update handler member everywhere
* vec utils (euler, temp, etc)
* config file
* color without tint
* shinethrower, flame, contrails
* physics feeling like in the old game
* adapt physics to glider looks
* create some levels with terrain editor and available assets
* player color
* tweak(myObj, "myParam")
* explosions need to look a bit different for mines, gliders and missiles

* MVP game:
  - menu is just a bunch of pictures that select a level
  - spawn by shooting
  - switch control by pressing a button
  - 3 minutes game
  - show table
  - rinse and repeat

* should it be visible what powerup someone has? -> no. minigun exception?
* chain lightning?
* phaser in all directions
* minigun
* shockwave + EMP = push everything away + disable control for some time
* drift karts

* recycle old levels

* build a community :)

* crate texture might not be free

for Dani:

* sound
* gamepad

* kümmer that testing works again or scratch testing
* npm run autoformat-all-files-in-src-and-experiments
* raise performance warning size limit (but don't disable it)

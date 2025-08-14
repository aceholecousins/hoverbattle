
starting the devlog way too late, noticing how much effort it was to pick the project up after 6 months

last things I did:

moved away from js magic set bla get bla to setBla() getBla() since it's more expressive about what it does instead of sneakily being methods, also I think setter only or getter only did not work or was not possible to be described by typescript or something

replace glmatrix with threejs vector math (which can be used as a separate module so we dont marry threejs) because the syntax of glmatrix is super awkward and its also no longer efficient with modern js engines

replace p2 with planck js (lots of effort and I did the half year break in the middle):
- p2 no longer maintained
- convex-circle collision can be missed in p2
- triangle-triangle collision can be missed in p2
(also tried matter.js briefly but https://github.com/liabru/matter-js/issues/1323)
planck js seems a bit overpowered and a simpler engine might suffice but it also seems well thought-through and comes from the famous box2d
- it wasnt easy to unify attachments (weldjoint in planck, lockconstraint in p2) as they seem to work very differently
    - I think p2 just has a spring in both x and y from originA to originB and a rotational spring
    - planck requires some anchor point which I now just set in the middle between both origins
    - both allow me to tweak stiffness and stuff but since they work so differently, I just leave that at default settings

was about to tackle these bugs:
* just noticed that p2 resets inertia when updating mass, so after I fixed that, the glider spins slower now, need to readjust

next steps:
replace the default parameter handling to the scheme at the bottom of workshop/code/defaultparameters.ts
remove nashwan because the company that bought bitmap brothers are anal about it
implement minigun

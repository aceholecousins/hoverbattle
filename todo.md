* action cam should wait until an explosion is finished
* powerups should not be bounced against when collected
* it's a bit ugly that you need to remember to call thing.update(0) after you initially set its position

the repetition of this sucks:
```
engine.actionCam.unfollow(powerupBox.body)
remove(powerupBoxes, powerupBox)
powerupBox.dispose()
```

for Dani:

* kümmer that testing works again
* make that index.html does not disappear
* npm run autoformat-all-files-in-src-and-experiments
* raise performance warning size limit (but don't disable it)
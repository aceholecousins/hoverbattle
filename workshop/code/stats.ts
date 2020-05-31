import * as Stats from "stats.js"

let stats = new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)

stats.update()
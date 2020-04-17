
import {GraphicsManager} from "./graphics/graphicsmanager"
import { Color, Mesh, BoxGeometry, MeshNormalMaterial } from "three"

let gm = new GraphicsManager("rendertarget")

gm.setup()
gm.setBackground(new Color("skyblue"))
gm.addToScene(new Mesh(new BoxGeometry(), new MeshNormalMaterial()))
gm.animate()

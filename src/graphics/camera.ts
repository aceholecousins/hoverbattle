
import {GraphicsObject, GraphicsObjectConfig} from "./graphicsobject"

// the camera has a 90deg field of view, both horizontally
// and vertically and a depth range from 0.0001 to 1.0
// use scale x, y and z to modify

export interface Camera extends GraphicsObject<"camera">{}

export interface CameraConfig extends GraphicsObjectConfig<"camera">{}
import { vec3, mat3 } from "gl-matrix";

/**
 * Wraps an angle in order to be in the limits of the wrapping point.
 * 
 * @param angle Angle to be wrapped in rad
 * @param wrapAt Wrapping point. Defaults to Math.PI
 * 
 * @returns the wrapped angle in the range between [-wrapAt, wrapAt)
 */
export function wrapAngle(angle: number, wrapAt = Math.PI): number {
	let revs = (angle - wrapAt) / 2.0 / Math.PI;
  return (revs - Math.floor(revs) - 1) * 2.0 * Math.PI + wrapAt
}

export function mat3fromVectors(out:mat3, x:vec3, y:vec3, z:vec3){
	// note that matrices are stored column-wise

	out[0] = x[0]
	out[1] = x[1]
	out[2] = x[2]

	out[3] = y[0]
	out[4] = y[1]
	out[5] = y[2]

	out[6] = z[0]
	out[7] = z[1]
	out[8] = z[2]

	return out
}
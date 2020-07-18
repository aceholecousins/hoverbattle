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
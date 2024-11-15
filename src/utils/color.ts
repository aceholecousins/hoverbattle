
export interface Color {
	r: number
	g: number
	b: number
}

export function colorLerp(a: Color, b: Color, q: number): Color {
	return {
		r: a.r + (b.r - a.r) * q,
		g: a.g + (b.g - a.g) * q,
		b: a.b + (b.b - a.b) * q
	}
}

export function darker(color: Color, q: number): Color {
	return {
		r: color.r * q,
		g: color.g * q,
		b: color.b * q
	}
}

export function brighter(color: Color, q: number): Color {
	return {
		r: color.r + (1 - color.r) * q,
		g: color.g + (1 - color.g) * q,
		b: color.b + (1 - color.b) * q
	}
}
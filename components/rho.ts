import { Mode, Position } from "./types"

function distance([x1, y1]: Position, [x2, y2]: Position) {
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}

function rho_A(position: Position, center: Position, _: number) {
	return 1 / (1 + distance(position, center))
}

function rho_B(position: Position, center: Position, radius: number) {
	if (distance(position, center) < radius) {
		return 1
	}

	return 0
}

export function getRho(mode: Mode) {
	if (mode === "A") return rho_A
	return rho_B
}


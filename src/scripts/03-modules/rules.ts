import { Shape } from '01-global/enum';

/* == CONSTANTS ============================================================= */
const tileDrawPenalty = -5;
const initialTiles = [
	9, // 2
	7, // 3
	7, // 4
	6, // 5
	6 // 6
];
const roundBonus = 25;
const shapeBonus = {
	[Shape.Bridge]: 40,
	[Shape.DoubleSided]: 40,
	[Shape.Hexagon]: 50
};
const passPenalty = -10;

/* == PUBLIC METHODS ======================================================== */
export function getDrawnTilesPenalty(tilesDrawn?: number): number {
	return (tilesDrawn ?? 0) * tileDrawPenalty;
}

export function getInitialTileCount(playerCount: number): number {
	const correctedIndex = Math.min(Math.max(0, playerCount - 2), 4);

	return initialTiles[correctedIndex];
}

export function getOpeningBonus(playedPoints: number): number {
	return playedPoints === 0 ? 40 : 10;
}

export function getRoundBonus(): number {
	return roundBonus;
}

export function getPassPenalty(): number {
	return passPenalty;
}

export function getShapeBonus(shape?: Shape): number {
	return shapeBonus[shape] ?? 0;
}

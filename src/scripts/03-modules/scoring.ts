import { Turn } from '01-global/interfaces/Turn';
import { TurnType } from '01-global/enum';
import {
	getDrawnTilesPenalty,
	getOpeningBonus,
	getPassPenalty,
	getRoundBonus,
	getShapeBonus
} from './rules';
import { PlayerPoints } from '01-global/interfaces/PlayerPoints';
import { TurnSummary } from '01-global/interfaces/TurnSummary';
import { RemainingPoints } from '01-global/interfaces/RemainingPoints';
import { PlayerSummary } from '01-global/interfaces/PlayerSummary';

/* == CONSTANTS ============================================================= */
const dummyWinner: RemainingPoints = {
	id: Symbol('dummy'),
	points: Infinity
};

/* == PRIVATE METHODS ======================================================= */
function calculateScore(turn: Turn): number {
	switch (turn.turnType) {
		case TurnType.Default:
			return scoreDefaultTurn(turn);

		case TurnType.RoundStart:
			return scoreRoundStart(turn);

		default:
			return 0;
	}
}

function calculateTileDelta(turn: Turn): number {
	const points = turn.points ?? 0;
	const tilePlayed = points === 0 ? 0 : -1;

	return tilePlayed + (turn.tilesDrawn ?? 0);
}

function scoreDefaultTurn(turn: Turn): number {
	return turn.points === undefined
		? getDrawnTilesPenalty(turn.tilesDrawn) + getPassPenalty()
		: turn.points +
				getShapeBonus(turn.completedShape) +
				getDrawnTilesPenalty(turn.tilesDrawn);
}

function scoreRoundStart(turn: Turn): number {
	const points = turn.points ?? 0;
	const bonusPoints = turn.isTriple ? getOpeningBonus(points) : 0;

	return points + bonusPoints;
}

/* == PUBLIC METHODS ======================================================== */
export function awardRemainingPoints(
	remainingPoints: RemainingPoints[]
): RemainingPoints {
	// The winner is the player with the least remaining points.
	const winner = remainingPoints.reduce((winner, entry) => {
		return entry.points < winner.points ? entry : winner;
	}, dummyWinner);

	const remainingPlayers = remainingPoints.filter(
		entry => entry.id !== winner.id
	);
	const points = remainingPlayers.reduce(
		(total, entry) => total + entry.points,
		0
	);

	return {
		id: winner.id,
		points: points - winner.points
	};
}

export function rankPlayers(players: PlayerSummary[]): PlayerSummary['id'][] {
	const temp = [...players];
	temp.sort((a, b) => b.score - a.score);

	return temp.map(player => player.id);
}

export function scoreLockedRound(
	pointsPerPlayer: PlayerPoints[]
): PlayerPoints {
	const winner = pointsPerPlayer.reduce((winner, player) => {
		return player.points < winner.points ? player : winner;
	}, dummyWinner);
	const points = pointsPerPlayer
		.filter(player => player.id !== winner.id)
		.reduce((total, player) => total + player.points, 0);

	return {
		id: winner.id,
		points: points - winner.points
	};
}

export function scoreTurn(turn: Turn): TurnSummary {
	return {
		scoreDelta: calculateScore(turn),
		tileDelta: calculateTileDelta(turn)
	};
}

export function scoreWonRound(pointsPerPlayer: PlayerPoints[]): number {
	return (
		pointsPerPlayer.reduce((total, player) => total + player.points, 0) +
		getRoundBonus()
	);
}

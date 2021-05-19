export enum TurnType {
	/**
	 * The default state is for a regular turn. It allows the user to specify
	 * the number of points played as well as how many tiles were drawn and if
	 * a special shape has been completed in the turn.
	 */
	Default = 'default',

	/**
	 * In the collection state all controls except the number pad will be
	 * hidden. It is meant to collect the points each player has left at the
	 * end of a round so the points can be added to the score of the winner.
	 */
	Collection = 'collection',

	/**
	 * In the round start only the number pad and the control to indicate a trio
	 * has been played will be displayed.
	 */
	RoundStart = 'round-start'
}

export enum Shape {
	Bridge = 'bridge',
	DoubleSided = 'double-sided',
	Hexagon = 'hexagon'
}

export enum StepId {
	Names = 'names',
	PlayerSelect = 'player-select',
	PointsLimit = 'points-limit',
	Round = 'round',
	Collection = 'collection',
	Leaderboard = 'leader-board'
}

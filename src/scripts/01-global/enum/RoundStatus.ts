export enum RoundStatus {
	/**
	 * The round is still being played.
	 */
	InProgress = 'in-progress',

	/**
	 * All players have been unable to play a tile, the round is locked.
	 */
	Locked = 'locked',

	/**
	 * There is a player with an empty hand, this player has won the round.
	 */
	Won = 'won'
}

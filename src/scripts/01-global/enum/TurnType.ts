export enum TurnType {
	/**
	 * The default state is for a regular turn. It allows the user to specify
	 * the number of points played as well as how many tiles were drawn and if
	 * a special shape has been completed in the turn.
	 */
	Default = 'default',

	/**
	 * In the round start only the number pad and the control to indicate a trio
	 * has been played will be displayed.
	 */
	RoundStart = 'round-start'
}

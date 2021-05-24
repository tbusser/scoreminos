import { Shape } from '01-global/enum/Shape';
import { TurnType } from '01-global/enum';

/* == EXPORTS =============================================================== */
export interface Turn {
	/**
	 * Optional property to specifies the kind of shape completed by playing a
	 * tile. Completed shapes may award bonus points.
	 */
	completedShape?: Shape;

	/**
	 * Indicates whether or not a triple tile was played. This is important in
	 * the first turn of a round as it may be rewarded with bonus points.
	 */
	isTriple?: boolean;

	/**
	 * The points played by the player. When the property is omitted or set to
	 * undefined it indicates the turn was skipped.
	 */
	points?: number;

	/**
	 * Optional property which specifies the number of tiles drawn by
	 * the player.
	 */
	tilesDrawn?: number;

	/**
	 * Indicates the kind of turn was played.
	 */
	turnType: TurnType;
}

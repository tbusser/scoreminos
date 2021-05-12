/* == PRIVATE FIELDS ======================================================== */
let id = 0;

/* == CLASS ================================================================= */
export class Player {
	/* -- CONSTRUCTOR ------------------------------------------------------- */
	constructor(public name: string, tileCount: number) {
		this._id = Symbol(`player__${id++}`);
		this._tiles = tileCount;
	}

	/* -- FIELDS ------------------------------------------------------------ */
	private _id: symbol;
	private _score = 0;
	private _tiles: number;

	/* -- INSTANCE PROPERTIES ----------------------------------------------- */
	get hasEmptyHand(): boolean {
		return this._tiles === 0;
	}

	get id(): symbol {
		return this._id;
	}

	get score(): number {
		return this._score;
	}

	get tileCount(): number {
		return this._tiles;
	}

	/* -- PUBLIC METHODS ---------------------------------------------------- */
	updateScore(delta: number): number {
		this._score += delta;

		return this._score;
	}

	updateTileCount(delta: number): number {
		this._tiles += delta;

		return this._tiles;
	}
}

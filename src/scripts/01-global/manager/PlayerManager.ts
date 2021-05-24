import { PlayerSummary } from '01-global/interface/PlayerSummary';
import { bind } from '01-global/decorator/bind';
import { Player } from '01-global/model/Player';

/* == CONSTANTS ============================================================= */
const singletonEnforcer = Symbol('singleton');

/* == CLASS ================================================================= */
export class PlayerManager {
	/* -- CONSTRUCTOR ------------------------------------------------------- */
	constructor(enforcer: symbol) {
		if (enforcer !== singletonEnforcer) {
			throw 'Use the static property instance to get the PlayerManager';
		}
	}

	/* -- SINGLETON --------------------------------------------------------- */
	private static _instance: PlayerManager | null = null;
	static get instance(): PlayerManager {
		if (PlayerManager._instance === null) {
			PlayerManager._instance = new PlayerManager(singletonEnforcer);
		}

		return PlayerManager._instance;
	}

	/* -- FIELDS ------------------------------------------------------------ */
	private activeIndex: number | null = null;
	private _activePlayer: Player | null = null;
	private tilesPerRound: number | undefined;
	private _players: Player[] = [];

	get activePlayer(): PlayerSummary | null {
		return this._activePlayer === null
			? null
			: this.createPlayerSummary(this._activePlayer);
	}

	get firstRankedPlayer(): PlayerSummary {
		const player = this._players.reduce(
			(result, player) => {
				return player.score > result.score ? player : result;
			},
			{ score: -Infinity } as Player
		);

		return this.createPlayerSummary(player);
	}

	get numberOfPlayers(): number {
		return this._players.length;
	}

	get players(): PlayerSummary[] {
		return this._players.map(this.createPlayerSummary);
	}

	/* -- PRIVATE METHODS --------------------------------------------------- */
	@bind
	private createPlayerSummary(player: Player): PlayerSummary {
		return {
			hasEmptyHand: player.hasEmptyHand,
			id: player.id,
			isActive: this._activePlayer?.id === player.id,
			name: player.name,
			score: player.score,
			tileCount: player.tileCount
		};
	}

	/* -- PUBLIC METHODS ---------------------------------------------------- */
	activateNextPlayer(): PlayerSummary | null {
		if (this.activeIndex === null) {
			return null;
		}

		this.activeIndex = (this.activeIndex + 1) % this._players.length;
		this._activePlayer = this._players[this.activeIndex];

		return this.players[this.activeIndex];
	}

	createPlayers(names: Player['name'][], initialTileCount: number): void {
		this.activeIndex = null;
		this._activePlayer = null;
		this.tilesPerRound = initialTileCount;

		this._players = names.map(name => new Player(name, initialTileCount));
	}

	setActivePlayer(id: Player['id']): PlayerSummary {
		this.activeIndex = this._players.findIndex(player => player.id === id);
		this._activePlayer = this._players[this.activeIndex];

		return this.players[this.activeIndex];
	}

	resetTileCount(): void {
		this._players.forEach(player => player.setTileCount(this.tilesPerRound ?? 0));
	}

	updateActivePlayerScore(delta: number): number {
		return this._activePlayer?.updateScore(delta) ?? 0;
	}

	updateActivePlayerTileCount(delta: number): number {
		return this._activePlayer?.updateTileCount(delta) ?? 0;
	}

	updatePlayerScore(id: Player['id'], delta: number): number {
		const player = this._players.find(player => player.id === id);

		return player?.updateScore(delta) ?? 0;
	}
}

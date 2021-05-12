import { PlayerSummary } from '01-global/interfaces/PlayerSummary';
import { bind } from '02-utilities/decorators/bind';
import { Player } from './Player';

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
	private static _instance: PlayerManager = null;
	static get instance(): PlayerManager {
		if (PlayerManager._instance === null) {
			PlayerManager._instance = new PlayerManager(singletonEnforcer);
		}

		return PlayerManager._instance;
	}

	/* -- FIELDS ------------------------------------------------------------ */
	private activeIndex: number = null;
	private _activePlayer: Player = null;
	private _players: Player[] = [];

	get activePlayer(): PlayerSummary {
		return this.createPlayerSummary(this._activePlayer);
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
	activateNextPlayer(): PlayerSummary {
		this.activeIndex = (this.activeIndex + 1) % this._players.length;
		this._activePlayer = this._players[this.activeIndex];

		return this.players[this.activeIndex];
	}

	createPlayers(names: Player['name'][], initialTileCount: number): void {
		this.activeIndex = null;
		this._activePlayer = null;

		this._players = names.map(name => new Player(name, initialTileCount));
	}

	setActivePlayer(id: Player['id']): PlayerSummary {
		this.activeIndex = this._players.findIndex(player => player.id === id);
		this._activePlayer = this._players[this.activeIndex];

		return this.players[this.activeIndex];
	}

	updateActivePlayerScore(delta: number): number {
		return this._activePlayer.updateScore(delta);
	}
	updateActivePlayerTileCount(delta: number): number {
		return this._activePlayer.updateTileCount(delta);
	}

	updatePlayerScore(id: Player['id'], delta: number): number {
		const player = this._players.find(player => player.id === id);

		return player?.updateScore(delta);
	}
}

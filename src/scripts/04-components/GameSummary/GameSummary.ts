import { PlayerSummary } from '01-global/interfaces/PlayerSummary';

/* == CONSTANTS ============================================================= */
const moduleName = 'game-summary';
const baseSelector = `.js-${moduleName}`;

/* == CLASS ================================================================= */
export class GameSummary {
	/* -- CONSTRUCTOR ------------------------------------------------------- */
	constructor(readonly base: HTMLElement) {
		//
	}

	/* -- PRIVATE METHODS --------------------------------------------------- */
	private createBody(players: PlayerSummary[]): string {
		return `<tbody>
			<tr>
				${players.map(player => `<td>${player.score}</td>`).join('')}
			</tr>
			<tr>
				${players
					.map(player => `<td>${player.tileCount} <img src="/images/tile.png"></td>`)
					.join('')}
			</tr>
		</tbody>`;
	}

	private createHeader(players: PlayerSummary[]): string {
		const createPlayer = player => {
			return `<th class="${player.isActive ? 'active' : ''}">${player.name}</th>`;
		};

		return `<thead>
			${players.map(createPlayer).join('')}
		</thead>`;
	}

	/* -- PUBLIC METHODS ---------------------------------------------------- */
	updateSummary(players: PlayerSummary[]): void {
		const summary = `<table>
			${this.createHeader(players)}
			${this.createBody(players)}
		</table>`;

		this.base.innerHTML = summary;
	}
}

/* == EXPORTS =============================================================== */
export { baseSelector };

import { PlayerSummary } from '01-global/interfaces/PlayerSummary';
import { rankPlayers } from './scoring';

/* == INTERFACES ============================================================ */
interface Configuration {
	includeTiles: boolean;
}

/* == CONSTANTS ============================================================= */
const medals = ['🥇', '🥈', '🥉'];

/* == PRIVATE METHODS ======================================================= */
function createBody(
	players: PlayerSummary[],
	includeTiles: Configuration['includeTiles']
): string {
	const ranking = rankPlayers(players);
	const rows = players
		.map(player => {
			const place = ranking.findIndex(id => id === player.id);
			const medal = medals[place] ?? place + 1;

			return `<tr>
			<td>${medal}</td>
			<td>${player.name}</td>
			<td>${player.score}</td>
			${includeTiles ? `<td>${player.tileCount}</td>` : ''}
		</tr>`;
		})
		.join('');

	return `<tbody>
		${rows}
	</tbody>`;
}

function createHeader(includeTiles: Configuration['includeTiles']): string {
	return `<thead>
		<tr>
			<th></th>
			<th>Player</th>
			<th>Score</th>
			${includeTiles ? '<th>Tiles</th>' : ''}
		</tr>
	</thead>`;
}

/* == PUBLIC METHODS ======================================================== */
export function createLeaderboard(
	players: PlayerSummary[],
	config: Configuration
): string {
	return `<table class="c-leaderboard">
		${createHeader(config.includeTiles)}
		${createBody(players, config.includeTiles)}
	</table>`;
}

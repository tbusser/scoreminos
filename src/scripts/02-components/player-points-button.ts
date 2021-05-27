import { PlayerSummary } from '01-global/interface';

/* == PRIVATE METHODS ======================================================= */
function getDisabledAttribute(hasEmptyHand: boolean): string {
	return hasEmptyHand ? 'disabled' : '';
}

function getRoundWinnerDescription(hasEmptyHand: boolean): string {
	return hasEmptyHand ? '<span>Round winner</span>' : '';
}

function getSetPoints(points?: number): string {
	return (points ?? 0) === 0
		? ''
		: `<p class="c-score-button__score">${points}</p>`;
}

function getSetPointsPrompt(points?: number): string {
	return points === undefined ? '<span>No points set</span>' : '';
}

/* == PUBLIC METHODS ======================================================== */
export function createPlayerButton(
	id: string,
	player: PlayerSummary,
	points?: number
): string {
	const { hasEmptyHand, name } = player;

	return `
		<button
			type="button"
			class="o-structure o-structure--vertical-center c-score-button"
			data-id="${id}"
			${getDisabledAttribute(hasEmptyHand)}
		>
			<p class="o-structure o-structure--vertical o-structure--grow">
				<span class="c-score-button__name">${name}</span>
				${getRoundWinnerDescription(hasEmptyHand)}
				${getSetPointsPrompt(points)}
			</p>
			${getSetPoints(points)}
		</button>`;
}

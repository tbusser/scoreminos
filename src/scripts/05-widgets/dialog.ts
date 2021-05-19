import { PlayerSummary } from '01-global/interfaces/PlayerSummary';
import { Dialog, dialogCloseTriggerSelector } from '04-components/Dialog';
import { TimedButton } from '04-components/TimedButton';

/* == CONSTANTS ============================================================= */
const dialog = new Dialog();
const dialogId = {
	gameWinner: 'game-winner',
	lastRound: 'last-round',
	roundWinner: 'round-winner',
	turnPlayed: 'turn-played'
};

/* == PUBLIC METHODS ======================================================== */
export function showGameWinnerDialog(
	winner: PlayerSummary,
	onClose?: () => void
): void {
	dialog.showDialog(dialogId.gameWinner, {
		onClose,
		placeholders: {
			name: winner.name,
			score: winner.score.toString(10)
		}
	});
}

export function showLastRoundDialog(
	currentPlayerName: string,
	limit: number
): void {
	dialog.showDialog(dialogId.lastRound, {
		placeholders: {
			name: currentPlayerName,
			limit: limit.toString(10)
		}
	});
}

export function showRoundWinnerDialog(
	points: number,
	name: string,
	onClose?: () => void
): void {
	dialog.showDialog(dialogId.roundWinner, {
		onClose,
		placeholders: {
			name,
			points: points.toString(10)
		}
	});
}

export function showTurnPlayedDialog(
	activePlayer: PlayerSummary,
	delta: number,
	onClose?: () => void
): void {
	const formattedDelta = `${delta > 0 ? '+' : ''}${delta}`;
	const onBeforeShow = (content: HTMLElement) => {
		const button = content.querySelector(
			dialogCloseTriggerSelector
		) as HTMLElement;
		if (button === null) {
			return;
		}
		const timedButton = new TimedButton(button, () => dialog.hideDialog());
		setTimeout(() => timedButton.start(), 0);
	};

	dialog.showDialog(dialogId.turnPlayed, {
		onBeforeShow,
		onClose,
		placeholders: {
			delta: formattedDelta,
			name: activePlayer.name,
			score: activePlayer.score.toString(10)
		}
	});
}

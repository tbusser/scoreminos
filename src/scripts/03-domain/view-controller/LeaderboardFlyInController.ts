import { PlayerSummary } from '01-global/interface';
import { createLeaderboard } from '02-components/leaderboard';
import { FlyIn } from '02-components/FlyIn';

/* == INTERFACES ============================================================ */
interface Configuration {
	onStartNewGame?: () => void;
	selectors: Selectors;
}

interface Selectors {
	background: string;
	board: string;
	closeTrigger: string;
}

/* == CLASS ================================================================= */
export class LeaderboardFlyInController {
	constructor(readonly base: HTMLElement, private config: Configuration) {
		this.setup();
	}

	/* -- FIELDS ------------------------------------------------------------ */
	private board: HTMLElement | undefined;
	private flyOutController: FlyIn | undefined;

	/* -- PRIVATE METHODS --------------------------------------------------- */
	private setup(): void {
		this.board = this.base.querySelector(
			this.config.selectors.board
		) as HTMLElement;
		const closeTrigger = this.base.querySelector(
			this.config.selectors.closeTrigger
		);
		const background = document.querySelector(
			this.config.selectors.background
		) as HTMLElement | null;

		if (closeTrigger !== null) {
			closeTrigger.addEventListener('click', () => {
				this.flyOutController?.hide();
			});
		}

		this.flyOutController = new FlyIn(this.base, {
			background: background ?? undefined
		});
	}

	/* -- PUBLIC METHODS ---------------------------------------------------- */
	showLeaderboard(players: PlayerSummary[], includeTiles = false): void {
		if (this.board === undefined) {
			return;
		}

		this.board.innerHTML = createLeaderboard(players, {
			includeTiles
		});

		this.flyOutController?.show();
	}
}

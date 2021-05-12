import { PlayerSummary } from '01-global/interfaces/PlayerSummary';
import { createLeaderboard } from '03-modules/leaderboard';
import { BaseController } from '04-components/BaseController';

/* == INTERFACES ============================================================ */
interface Configuration {
	onStartNewGame: () => void;
	selectors: Selectors;
}

interface Selectors {
	board: string;
}

/* == CLASS ================================================================= */
export class LeaderboardController extends BaseController {
	constructor(readonly base: HTMLElement, private config: Configuration) {
		super(base);
		this.setup();
	}

	/* -- FIELDS ------------------------------------------------------------ */
	private board: HTMLElement;

	/* -- PROTECTED METHODS ------------------------------------------------- */
	protected onPrimaryAction(): void {
		this.config.onStartNewGame?.();
	}

	/* -- PRIVATE METHODS --------------------------------------------------- */
	private setup(): void {
		this.board = this.base.querySelector(
			this.config.selectors.board
		) as HTMLElement;
	}

	/* -- PUBLIC METHODS ---------------------------------------------------- */
	showLeaderboard(players: PlayerSummary[]): void {
		if (this.board === null) {
			return;
		}

		this.board.innerHTML = createLeaderboard(players, {
			includeTiles: false
		});
	}
}

import { bind } from '01-global/decorator/bind';
import { RoundStatus } from '01-global/enum/RoundStatus';
import { ManagedViewController } from '01-global/interface/ManagedViewController';
import { Turn } from '01-global/interface/Turn';

import { TurnSummary } from '01-global/interface/TurnSummary';
import { PlayerManager } from '01-global/manager/PlayerManager';
import { scoreTurn } from '01-global/utility/scoring';

import {
	RoundController as RoundViewController,
	RoundType
} from '03-domain/view-controller/TurnController';

/* == CONSTANTS ============================================================= */
const playerManager = PlayerManager.instance;

/* == INTERFACES ============================================================ */
interface Configuration {
	onShowLeaderboard: () => void;
	onTurnSubmitted: (report: TurnReport) => void;
}

export interface TurnReport extends TurnSummary {
	state: RoundStatus;
}

/* == PUBLIC METHODS ======================================================== */
export class RoundController implements ManagedViewController {
	constructor(readonly base: HTMLElement, private config: Configuration) {
		this.setup();
	}

	/* -- FIELDS ------------------------------------------------------------ */
	private _viewController?: RoundViewController;
	private maxPassedTurnStreak = 0;
	private passedTurnStreak = 0;
	private status: RoundStatus = RoundStatus.InProgress;

	/* -- INSTANCE PROPERTIES ----------------------------------------------- */
	private get canProceedToNextPlayer(): boolean {
		return (
			this.status === RoundStatus.InProgress &&
			!playerManager.activePlayer?.hasEmptyHand &&
			this.passedTurnStreak < this.maxPassedTurnStreak
		);
	}

	get isVisible(): boolean {
		return this._viewController?.isVisible ?? false;
	}
	set isVisible(value: boolean) {
		if (this._viewController === undefined) {
			return;
		}

		this._viewController.isVisible = value;
	}

	public get viewController(): RoundViewController | undefined {
		return this._viewController;
	}

	/* -- EVENT HANDLING ---------------------------------------------------- */
	@bind
	private onShowLeaderboard(): void {
		this.config.onShowLeaderboard?.();
	}

	@bind
	private onTurnSubmitted(turn: Turn): void {
		const turnSummary = this.processTurn(turn);
		this.determineStatus();

		this.config.onTurnSubmitted?.({
			...turnSummary,
			state: this.status
		});
	}

	/* -- PRIVATE METHODS --------------------------------------------------- */
	private determineStatus(): void {
		if (this.passedTurnStreak === this.maxPassedTurnStreak) {
			this.status = RoundStatus.Locked;
		} else if (playerManager.activePlayer?.hasEmptyHand) {
			this.status = RoundStatus.Won;
		}
	}

	private goToNextPlayer(): boolean {
		if (!this.canProceedToNextPlayer) {
			return false;
		}

		playerManager.activateNextPlayer();
		this._viewController?.play(
			RoundType.Default,
			playerManager.activePlayer?.name ?? ''
		);

		return true;
	}

	private processTurn(turn: Turn): TurnSummary {
		const turnSummary = scoreTurn(turn);
		playerManager.updateActivePlayerScore(turnSummary.scoreDelta);
		playerManager.updateActivePlayerTileCount(turnSummary.tileDelta);

		if (turnSummary.tileDelta === 0) {
			this.passedTurnStreak++;
		} else {
			this.passedTurnStreak = 0;
		}

		return turnSummary;
	}

	private setup() {
		this._viewController = new RoundViewController(this.base, {
			onShowLeaderboard: this.onShowLeaderboard,
			onTurnSubmitted: this.onTurnSubmitted
		});
	}

	/* -- PUBLIC METHODS ---------------------------------------------------- */
	continueRound(): boolean {
		return this.goToNextPlayer();
	}

	startRound(numberOfPlayers: number): void {
		this.maxPassedTurnStreak = numberOfPlayers;
		this.passedTurnStreak = 0;
		this.status = RoundStatus.InProgress;

		this.viewController?.play(
			RoundType.RoundStart,
			playerManager.activePlayer?.name ?? ''
		);
	}
}

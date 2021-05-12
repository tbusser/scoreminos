import { TurnType } from '01-global/enum';
import { PlayerSummary } from '01-global/interfaces/PlayerSummary';
import { Turn } from '01-global/interfaces/Turn';
import { PlayerManager } from '03-modules/PlayerManager';
import { BaseController } from '04-components/BaseController';
import { baseSelector, TurnInput } from '04-components/TurnInput/TurnInput';
import { scoreTurn } from '03-modules/scoring';
import { TurnSummary } from '01-global/interfaces/TurnSummary';
import { createLeaderboard } from '03-modules/leaderboard';
import { FlyOut } from '03-modules/fly-out';

/* == INTERFACES ============================================================ */
interface Configuration {
	onRoundCompleted: (reason: RoundCompletedReason) => void;
	onTurnSubmitted: (turnSummary: TurnSummary) => void;
	selectors: Selectors;
}

interface Selectors {
	flyOut: string;
	flyOutClose: string;
	leaderboard: string;
}

/* == CONSTANTS ============================================================= */
export enum RoundCompletedReason {
	RoundLocked = 'round-locked',
	RoundWon = 'round-won'
}

enum RoundType {
	Default = 'default',
	RoundLocked = 'round-locked',
	RoundStart = 'round-start',
	RoundWon = 'round-won'
}

const playerManager = PlayerManager.instance;

/* == CLASS ================================================================= */
export class RoundController extends BaseController {
	/* -- CONSTRUCTOR ------------------------------------------------------- */
	constructor(readonly base: HTMLElement, private config: Configuration) {
		super(base);
		this.setup();
	}

	/* -- FIELDS ------------------------------------------------------------ */
	private _activePlayer: PlayerSummary;
	private _roundType: RoundType;
	private leaderboardFlyout: FlyOut;
	private leaderboard: HTMLElement;
	private maxPassedTurnStreak = 0;
	private passedTurnsStreak = 0;
	private turnInput: TurnInput = null;

	/* -- INSTANCE PROPERTIES ----------------------------------------------- */
	private get activePlayer(): PlayerSummary {
		return this._activePlayer;
	}
	private set activePlayer(player: PlayerSummary) {
		this._activePlayer = player;
		this.header.title = player.name;
	}

	private get roundType(): RoundType {
		return this._roundType;
	}
	private set roundType(value: RoundType) {
		if (value === this._roundType) {
			return;
		}

		this._roundType = value;

		switch (value) {
			case RoundType.Default:
				this.turnInput.turnType = TurnType.Default;
				this.header.subtitle = 'turn in progress';
				break;

			case RoundType.RoundStart:
				this.turnInput.turnType = TurnType.RoundStart;
				this.header.subtitle = 'Eerste speelbeurt';
				break;

			default:
				this.turnInput.turnType = TurnType.Collection;
				this.header.subtitle = 'collecting points';
				break;
		}
	}

	/* -- EVENT HANDLING ---------------------------------------------------- */
	protected onPrimaryAction(): void {
		const turn = this.turnInput.turn;
		this.processPlayerInput(turn);
	}

	protected onSecondaryAction(): void {
		if (this.leaderboard === null) {
			return;
		}

		this.leaderboard.innerHTML = createLeaderboard(playerManager.players, {
			includeTiles: true
		});
		this.leaderboardFlyout.show();
	}

	/* -- PRIVATE METHODS --------------------------------------------------- */
	private goToNextPlayer(): void {
		this.activePlayer = playerManager.activateNextPlayer();
		this.turnInput.reset();
	}

	private processPassedTurn(): void {
		this.passedTurnsStreak++;

		if (this.passedTurnsStreak === this.maxPassedTurnStreak) {
			this.config.onRoundCompleted?.(RoundCompletedReason.RoundLocked);

			return;
		}

		this.goToNextPlayer();
	}

	private processPlayedTurn(): void {
		this.passedTurnsStreak = 0;
		this.roundType = RoundType.Default;

		if (playerManager.activePlayer.hasEmptyHand) {
			this.config.onRoundCompleted?.(RoundCompletedReason.RoundWon);

			return;
		}

		this.goToNextPlayer();
	}

	private processPlayerInput(turn: Turn): void {
		const turnSummary = scoreTurn(turn);

		playerManager.updateActivePlayerScore(turnSummary.scoreDelta);
		playerManager.updateActivePlayerTileCount(turnSummary.tileDelta);
		this.config.onTurnSubmitted?.(turnSummary);

		if (turn.points === 0) {
			this.processPassedTurn();
		} else {
			this.processPlayedTurn();
		}
	}

	private reset(): void {
		this.maxPassedTurnStreak = playerManager.players.length;
		this.passedTurnsStreak = 0;
	}

	private setup(): void {
		const turnBase = this.base.querySelector(baseSelector) as HTMLElement;
		const flyOutBase = this.base.querySelector(
			this.config.selectors.flyOut
		) as HTMLElement;
		const flyOutClose = this.base.querySelector(
			this.config.selectors.flyOutClose
		) as HTMLElement;
		this.leaderboard = this.base.querySelector(
			this.config.selectors.leaderboard
		) as HTMLElement;

		if (baseSelector !== null) {
			this.turnInput = new TurnInput(turnBase);
		}
		if (flyOutBase !== null) {
			this.leaderboardFlyout = new FlyOut(flyOutBase);
			flyOutClose.addEventListener('click', () => this.leaderboardFlyout.hide());
		}
	}

	/* -- PUBLIC METHODS ---------------------------------------------------- */
	start(startingPlayerId: PlayerSummary['id']): void {
		this.activePlayer = playerManager.setActivePlayer(startingPlayerId);

		this.reset();

		this.roundType = RoundType.RoundStart;
		this.turnInput.reset();
	}
}

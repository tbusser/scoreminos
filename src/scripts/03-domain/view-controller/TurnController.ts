import { Turn } from '01-global/interface/Turn';
import { TurnType } from '01-global/enum/TurnType';
import { BaseController } from '02-components/BaseViewController';
import { baseSelector, TurnInput } from '02-components/TurnInput';

/* == INTERFACES ============================================================ */
interface Configuration {
	onShowLeaderboard: () => void;
	onTurnSubmitted: (turnSummary: Turn) => void;
}

/* == CONSTANTS ============================================================= */
export enum RoundType {
	Default = 'default',
	RoundStart = 'round-start'
}

/* == CLASS ================================================================= */
export class RoundController extends BaseController {
	/* -- CONSTRUCTOR ------------------------------------------------------- */
	constructor(readonly base: HTMLElement, private config: Configuration) {
		super(base);
		this.setup();
	}

	/* -- FIELDS ------------------------------------------------------------ */
	private _roundType: RoundType = RoundType.Default;
	private turnInput: TurnInput | null = null;

	/* -- INSTANCE PROPERTIES ----------------------------------------------- */
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
				this.setTurnType(TurnType.Default);
				this.header.subtitle = 'turn in progress';
				break;

			case RoundType.RoundStart:
				this.setTurnType(TurnType.RoundStart);
				this.header.subtitle = 'initial turn';
				break;
		}
	}

	/* -- EVENT HANDLING ---------------------------------------------------- */
	protected onPrimaryAction(): void {
		const turn = this.turnInput?.turn;
		this.config.onTurnSubmitted?.(turn);
	}

	protected onSecondaryAction(): void {
		this.config.onShowLeaderboard?.();
	}

	/* -- PRIVATE METHODS --------------------------------------------------- */
	private reset(): void {
		this.turnInput?.reset();
	}

	private setTurnType(turnType: TurnType): void {
		if (this.turnInput === null) {
			return;
		}

		this.turnInput.turnType = turnType;
	}

	private setup(): void {
		const turnBase = this.base.querySelector(baseSelector) as HTMLElement;
		if (baseSelector !== null) {
			this.turnInput = new TurnInput(turnBase);
		}
	}

	/* -- PUBLIC METHODS ---------------------------------------------------- */
	play(roundType: RoundType, playerName: string): void {
		this.header.title = playerName;
		this.roundType = roundType;
		this.reset();
	}
}

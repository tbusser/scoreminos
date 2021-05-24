import { Turn } from '01-global/interface/Turn';
import { TurnType } from '01-global/enum/TurnType';
import { BaseController } from '02-components/BaseViewController';
import { baseSelector, TurnInput } from '02-components/TurnInput';

/* == INTERFACES ============================================================ */
interface Configuration {
	onShowLeaderboard: () => void;
	onTurnSubmitted: (turnSummary: Turn) => void;
}

/* == CLASS ================================================================= */
export class RoundController extends BaseController {
	/* -- CONSTRUCTOR ------------------------------------------------------- */
	constructor(readonly base: HTMLElement, private config: Configuration) {
		super(base);
		this.setup();
	}

	/* -- FIELDS ------------------------------------------------------------ */
	private _turnType: TurnType = TurnType.Default;
	private turnInput: TurnInput | null = null;

	/* -- INSTANCE PROPERTIES ----------------------------------------------- */
	private get turnType(): TurnType {
		return this._turnType;
	}
	private set turnType(value: TurnType) {
		if (value === this._turnType) {
			return;
		}

		this._turnType = value;

		switch (value) {
			case TurnType.Default:
				this.setTurnType(TurnType.Default);
				this.header.subtitle = 'turn in progress';
				break;

			case TurnType.RoundStart:
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
	play(turnType: TurnType, playerName: string): void {
		this.header.title = playerName;
		this.turnType = turnType;
		this.reset();
	}
}

import { BaseController } from '04-components/BaseController';
import {
	PlayerInput,
	baseSelector as playerInputSelector
} from '04-components/PlayerInput/PlayerInput';
import { updateMessageVisibility } from '03-modules/error-message';

/* == INTERFACES ============================================================ */
interface Selectors {
	form: string;
}

interface Configuration {
	onPlayersSelected: (names: string[]) => void;
	selectors: Selectors;
	warningId: string;
}

/* == CONSTANTS ============================================================= */
const minimumRequiredPlayers = 2;

/* == CLASS ================================================================= */
export class GameStartController extends BaseController {
	/* -- CONSTRUCTOR ------------------------------------------------------- */
	constructor(readonly base: HTMLElement, readonly config?: Configuration) {
		super(base);
		this.setup();
	}

	/* -- FIELDS ------------------------------------------------------------ */
	private playerInput: PlayerInput;

	/* -- PROTECTED METHODS ------------------------------------------------- */
	protected onPrimaryAction(): void {
		const playerNames = this.playerInput?.playerNames ?? [];
		const isValid = playerNames.length >= minimumRequiredPlayers;

		this.updateWarningVisibility(isValid);

		if (isValid) {
			this.config.onPlayersSelected?.call(this, playerNames);
		}
	}

	/* -- PRIVATE METHODS --------------------------------------------------- */
	private setup(): void {
		const playerInputBase = this.base.querySelector(
			playerInputSelector
		) as HTMLElement;
		if (playerInputBase) {
			this.playerInput = new PlayerInput(playerInputBase);
		}
	}

	private updateWarningVisibility(hide: boolean): void {
		const visibleIds = hide ? [] : [this.config.warningId];

		updateMessageVisibility(this.base, visibleIds);
	}
}

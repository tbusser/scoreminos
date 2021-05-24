import { PlayerSummary } from '01-global/interface/PlayerSummary';
import { updateMessageVisibility } from '01-global/utility/error-message';
import { BaseController } from '02-components/BaseViewController';

/* == INTERFACES ============================================================ */
interface Configuration {
	isVisible: boolean;
	onCancel: () => void;
	onPlayerSelected: (player: PlayerSummary) => void;
	selectors: Selectors;
	warningId: string;
}

interface Player {
	id: string;
	summary: PlayerSummary;
}

interface Selectors {
	nameList: string;
}

/* == CONSTANTS ============================================================= */
const selector = {
	selectedPlayer: 'input[type="radio"]:checked'
};

/* == CLASS ================================================================= */
export class PlayerSelectController extends BaseController {
	/* -- CONSTRUCTOR ------------------------------------------------------- */
	constructor(readonly base: HTMLElement, private config: Configuration) {
		super(base);
		this.setup();
	}

	/* -- FIELDS ------------------------------------------------------------ */
	private players: Player[];
	private _round: number;

	/* -- INSTANCE PROPERTIES ----------------------------------------------- */
	get round(): number {
		return this._round;
	}
	set round(value: number) {
		if (value === this._round || !Number.isFinite(value)) {
			return;
		}

		this._round = value;
		this.updateHeader();
	}

	/* -- EVENT HANDLING ---------------------------------------------------- */
	protected onSecondaryAction(): void {
		this.config.onCancel?.call(this);
	}

	protected onPrimaryAction(): void {
		const selectedPlayer = this.getSelectedPlayer();
		const isValid = selectedPlayer !== null;

		this.updateWarningVisibility(isValid);

		if (isValid) {
			this.config.onPlayerSelected?.call(this, selectedPlayer);
		}
	}

	/* -- PRIVATE METHODS --------------------------------------------------- */
	private getSelectedPlayer(): PlayerSummary | null {
		const selectedInput = this.base.querySelector(selector.selectedPlayer);

		return selectedInput === null
			? null
			: this.players.find(player => player.id === selectedInput.id)?.summary ??
					null;
	}

	private renderPlayer(player: Player): string {
		return `<li class="c-radio-button">
			<input class="c-radio-button__input" type="radio" name="player-select" id="${player.id}">
			<label for="${player.id}" class="c-radio-button__button">
				${player.summary.name}
			</label>
		</li>`;
	}

	private renderPlayersList(): void {
		const listElement = this.base.querySelector(this.config.selectors.nameList);
		if (listElement === null) {
			return;
		}

		listElement.innerHTML = this.players
			.map(player => this.renderPlayer(player))
			.join('');
	}

	private setup(): void {
		this.isVisible = this.config.isVisible;
	}

	private updateHeader(): void {
		this.header.title = `Start Round ${this.round}`.trim();
	}

	private updateWarningVisibility(hide: boolean): void {
		const visibleIds = hide ? [] : [this.config.warningId];

		updateMessageVisibility(this.base, visibleIds);
	}

	/* -- PUBLIC METHODS ---------------------------------------------------- */
	setPlayers(players: PlayerSummary[]): void {
		this.players = players.map((player, index) => ({
			id: `player_${index}`,
			summary: player
		}));

		this.renderPlayersList();
	}
}

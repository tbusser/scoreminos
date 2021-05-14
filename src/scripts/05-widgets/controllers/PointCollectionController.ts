/**
 * TODO:
 * - Restore header title after setting points
 * - Use NumberEntry
 */

import { PlayerSummary } from '01-global/interfaces/PlayerSummary';
import { RemainingPoints } from '01-global/interfaces/RemainingPoints';
import { bind } from '02-utilities/decorators/bind';
import { updateMessageVisibility } from '03-modules/error-message';
import { FlyOut } from '03-modules/fly-out';
import { BaseController } from '04-components/BaseController';
import { NumberEntry } from '04-components/NumberEntry';

/* == INTERFACES ============================================================ */
interface Configuration {
	isVisible: boolean;
	onPointsCollected: (points: RemainingPoints[]) => void;
	selectors: Selectors;
	translations: {
		headerPrompt: string;
	};
	warningId: string;
}

interface Player {
	id: string;
	points?: number;
	summary: PlayerSummary;
}

interface Selectors {
	flyOut: string;
	numberEntry: string;
	playerList: string;
	setPoints: string;
}

/* == CONSTANTS ============================================================= */
const attribute = {
	id: 'data-id'
};

/* == CLASS ================================================================= */
export class PointCollectionController extends BaseController {
	/* -- CONSTRUCTOR ------------------------------------------------------- */
	constructor(readonly base: HTMLElement, private config: Configuration) {
		super(base);
		this.setup();
	}

	/* -- FIELDS ------------------------------------------------------------ */
	private flyIn: FlyOut;
	private numberEntry: NumberEntry;
	private players: Player[];
	private selectedPlayer: Player;

	/* -- EVENT HANDLING ---------------------------------------------------- */
	@bind
	private onClicked(event: MouseEvent): void {
		const playerId = (event.target as HTMLElement)
			.closest(`[${attribute.id}]:not(:disabled)`)
			?.getAttribute(attribute.id);

		if (playerId === undefined) {
			return;
		}

		this.selectedPlayer = this.players.find(player => player.id === playerId);
		if (this.selectedPlayer === undefined) {
			return;
		}

		this.numberEntry.value = this.selectedPlayer.points ?? 0;

		this.header.title = this.selectedPlayer.summary.name;
		this.footer.primaryEnabled = false;
		this.flyIn?.show();
	}

	@bind
	private onSetPoints(): void {
		if (this.numberEntry.value !== 0) {
			this.selectedPlayer.points = this.numberEntry.value;
		}
		this.renderPlayersList();
		this.flyIn?.hide();
		this.header.title = this.config.translations.headerPrompt;
		this.footer.primaryEnabled = true;
	}

	protected onPrimaryAction(): void {
		const invalidPlayers = this.getPlayersWithoutPoints();
		const isValid = invalidPlayers.length === 0;

		this.updateWarningVisibility(isValid);

		if (!isValid) {
			return;
		}

		const result = this.players.map(({ points, summary: { id } }) => ({
			id,
			points
		}));
		this.config.onPointsCollected?.(result);
	}

	/* -- PRIVATE METHODS --------------------------------------------------- */
	private getPlayersWithoutPoints(): Player[] {
		return this.players.filter(({ points, summary: { hasEmptyHand } }) => {
			return (points ?? 0) === 0 && !hasEmptyHand;
		});
	}

	private renderPlayer(player: Player): string {
		const {
			id,
			points,
			summary: { hasEmptyHand, name }
		} = player;

		return `<li>
			<button
				type="button"
				class="o-structure o-structure--vertical-center c-score-button"
				data-id="${id}"
				${hasEmptyHand ? 'disabled' : ''}
			>
				<p class="o-structure o-structure--vertical o-structure--grow">
					<span class="c-score-button__name">${name}</span>
					${hasEmptyHand ? '<span>Round winner</span>' : ''}
					${points === undefined ? '<span>No points set</span>' : ''}
				</p>
				${(points ?? 0) === 0 ? '' : `<p class="c-score-button__score">${points}</p>`}
				${hasEmptyHand ? '' : '<p class="c-score-button__chevron">❯</p>'}
			</button>
		</li>`;
	}

	private renderPlayersList(): void {
		const listElement = this.base.querySelector(this.config.selectors.playerList);
		if (listElement === null) {
			return;
		}

		listElement.innerHTML = this.players
			.map(player => this.renderPlayer(player))
			.join('');
	}

	private setup(): void {
		const flyInBase = this.base.querySelector(
			this.config.selectors.flyOut
		) as HTMLElement;
		if (flyInBase !== null) {
			this.flyIn = new FlyOut(flyInBase);
		}

		const numberEntryBase = this.base.querySelector(
			this.config.selectors.numberEntry
		) as HTMLElement;
		if (numberEntryBase !== null) {
			this.numberEntry = new NumberEntry(numberEntryBase, {
				selectors: {
					display: '.js-number-entry__display',
					numberPad: '.js-number-entry__number-pad'
				}
			});
		}

		const setPointsButton = this.base.querySelector(
			this.config.selectors.setPoints
		);
		if (setPointsButton !== null) {
			setPointsButton.addEventListener('click', this.onSetPoints);
		}
		this.base.addEventListener('click', this.onClicked);
		this.isVisible = this.config.isVisible;
	}

	private updateWarningVisibility(hide: boolean): void {
		const visibleIds = hide ? [] : [this.config.warningId];

		updateMessageVisibility(this.base, visibleIds);
	}

	/* -- PUBLIC METHODS ---------------------------------------------------- */
	setPlayers(players: PlayerSummary[]): void {
		this.players = players.map((player, index) => ({
			id: `player_${index}`,
			points: player.hasEmptyHand ? 0 : undefined,
			summary: player
		}));

		this.renderPlayersList();
	}
}

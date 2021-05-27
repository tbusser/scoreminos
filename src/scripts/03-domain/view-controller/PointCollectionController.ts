import { PlayerSummary, RemainingPoints } from '01-global/interface';
import { bind } from '01-global/decorator/bind';
import { updateMessageVisibility } from '01-global/utility/error-message';
import { FlyIn } from '02-components/FlyIn';
import { BaseController } from '02-components/BaseViewController';
import { NumberEntry } from '02-components/NumberEntry';
import { createPlayerButton } from '02-components/player-points-button';

/* == INTERFACES ============================================================ */
interface Configuration {
	flyInBackground?: HTMLElement;
	isVisible: boolean;
	onPointsCollected: (points: RemainingPoints[]) => void;
	selectors: Selectors;
	warningId: string;
}

interface Player {
	id: string;
	points?: number;
	summary: PlayerSummary;
}

interface Selectors {
	cancelSetPoints: string;
	flyInPortal: string;
	flyInTitle: string;
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
	private flyIn?: FlyIn;
	private flyInTitle: HTMLElement | null = null;
	private numberEntry: NumberEntry | null = null;
	private players?: Player[];
	private selectedPlayer: Player | undefined;

	/* -- EVENT HANDLING ---------------------------------------------------- */
	@bind
	private onCancelSetPoints(event: Event): void {
		this.flyIn?.hide();
	}

	@bind
	private onClicked(event: MouseEvent): void {
		const playerId = (event.target as HTMLElement)
			.closest(`[${attribute.id}]:not(:disabled)`)
			?.getAttribute(attribute.id);

		if (playerId === undefined) {
			return;
		}

		this.selectedPlayer = this.players?.find(player => player.id === playerId);
		if (this.selectedPlayer === undefined) {
			return;
		}

		this.prepareFlyInView();
		this.showFlyIn();
	}

	@bind
	private onFlyInHidden(): void {
		if (this.flyIn) {
			this.base.appendChild(this.flyIn.base);
		}
	}

	@bind
	private onSetPoints(): void {
		if (this.numberEntry?.value !== 0 && this.selectedPlayer) {
			this.selectedPlayer.points = this.numberEntry?.value;
		}
		this.renderPlayersList();
		this.flyIn?.hide();
	}

	protected onPrimaryAction(): void {
		const invalidPlayers = this.getPlayersWithoutPoints();
		const isValid = invalidPlayers.length === 0;

		this.updateWarningVisibility(isValid);

		if (!isValid) {
			return;
		}

		const result =
			this.players?.map(({ points, summary: { id } }) => ({
				id,
				points: points ?? 0
			})) ?? [];
		this.config.onPointsCollected?.(result);
	}

	/* -- PRIVATE METHODS --------------------------------------------------- */
	private getPlayersWithoutPoints(): Player[] {
		return this.players === undefined
			? []
			: this.players.filter(({ points, summary: { hasEmptyHand } }) => {
					return (points ?? 0) === 0 && !hasEmptyHand;
			  });
	}

	private renderPlayer(player: Player): string {
		const { id, points, summary } = player;

		return `<li>
			${createPlayerButton(id, summary, points)}
		</li>`;
	}

	private renderPlayersList(): void {
		const listElement = this.base.querySelector(this.config.selectors.playerList);
		if (listElement === null || this.players === undefined) {
			return;
		}

		listElement.innerHTML = this.players
			?.map(player => this.renderPlayer(player))
			.join('');
	}

	private setup(): void {
		this.setupFlyIn();

		const numberEntryBase = this.base.querySelector(
			this.config.selectors.numberEntry
		) as HTMLElement;
		this.numberEntry =
			numberEntryBase === null
				? null
				: new NumberEntry(numberEntryBase, {
						defaultPoints: 0,
						selectors: {
							display: '.js-number-entry__display',
							numberPad: '.js-number-entry__number-pad'
						}
				  });

		this.base.addEventListener('click', this.onClicked);
		this.isVisible = this.config.isVisible;
	}

	private prepareFlyInView(): void {
		if (this.numberEntry) {
			this.numberEntry.value = this.selectedPlayer?.points ?? 0;
		}
		if (this.flyInTitle) {
			this.flyInTitle.textContent = this.selectedPlayer?.summary.name ?? '';
		}
	}

	private setupFlyIn(): void {
		const flyInBase = this.base.querySelector(
			this.config.selectors.flyOut
		) as HTMLElement;
		if (flyInBase === null) {
			return;
		}

		this.flyIn = new FlyIn(flyInBase, {
			background: this.config.flyInBackground,
			onHidden: this.onFlyInHidden
		});

		this.flyInTitle = this.base.querySelector(this.config.selectors.flyInTitle);

		this.base
			.querySelector(this.config.selectors.setPoints)
			?.addEventListener('click', this.onSetPoints);
		this.base
			.querySelector(this.config.selectors.cancelSetPoints)
			?.addEventListener('click', this.onCancelSetPoints);
	}

	private showFlyIn(): void {
		if (this.flyIn === undefined) {
			return;
		}

		// The fly-in needs to be moved to the portal to make sure the UI looks
		// like it is intended.
		document
			.querySelector(this.config.selectors.flyInPortal)
			?.appendChild(this.flyIn.base);
		this.flyIn.show();
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

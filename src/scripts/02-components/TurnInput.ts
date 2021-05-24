import { Shape, TurnType } from '01-global/enum';
import { Turn } from '01-global/interface';
import { bind } from '01-global/decorator/bind';
import { CheckboxGroup } from '02-components/CheckboxGroup';
import { NumberEntry } from '02-components/NumberEntry';

/* == CONSTANTS ============================================================= */
const moduleName = 'turn-input';
const baseSelector = `.js-${moduleName}`;
const selector = {
	completedShape: `${baseSelector}__completed-shape`,
	form: `${baseSelector}__form`,
	numberEntry: `${baseSelector}__number-entry`,
	playedTriple: `${baseSelector}__played-triple`,
	playedTripleContainer: `${baseSelector}__played-triple-container`,
	tilesDrawn: `${baseSelector}__drawn-tiles`
};

/* == CLASS ================================================================= */
export class TurnInput {
	/* -- CONSTRUCTOR ------------------------------------------------------- */
	constructor(private base: HTMLElement) {
		this.setup();
	}

	/* -- FIELDS ------------------------------------------------------------ */
	private completedShape: CheckboxGroup;
	private numberEntry: NumberEntry;
	private _turnType = TurnType.Default;
	private tilesDrawn: CheckboxGroup;

	/* -- INSTANCE PROPERTIES ----------------------------------------------- */

	/* --[ HAS-PLAYED-TRIPLE ]-- */
	private get hasPlayedTriple(): boolean {
		const element = this.base.querySelector(
			selector.playedTriple
		) as HTMLInputElement;

		return element === null ? false : !element.disabled && element.checked;
	}

	/* --[ TURN ]-- */
	get turn(): Turn {
		return this.convertInputToObject();
	}

	/* --[ TURN-TYPE ]-- */
	get turnType(): TurnType {
		return this._turnType;
	}
	set turnType(newState: TurnType) {
		if (newState === this._turnType) {
			return;
		}
		this._turnType = newState;
		this.updateVisualState();
	}

	/* -- EVENT HANDLING ---------------------------------------------------- */
	@bind
	private onPointsChanged(value: number | undefined): void {
		if (this.turnType !== TurnType.RoundStart) {
			return;
		}

		const element = this.base.querySelector(
			selector.playedTriple
		) as HTMLInputElement;
		element.disabled = (value ?? 0) % 3 !== 0;
	}

	/* -- PRIVATE METHODS --------------------------------------------------- */
	private convertInputToObject(): Turn {
		const turn: Turn = {
			completedShape: this.completedShape.selectedValue as Shape,
			turnType: this._turnType
		};

		if (this.numberEntry.value !== undefined) {
			turn.points = this.numberEntry.value;
		}

		if (this.tilesDrawn.selectedValue) {
			turn.tilesDrawn = parseInt(this.tilesDrawn.selectedValue, 10);
		}

		if (this.hasPlayedTriple) {
			turn.isTriple = true;
		}

		return turn;
	}

	private setup(): void {
		const completedShape = this.base.querySelector(
			selector.completedShape
		) as HTMLElement;
		const numberEntryBase = this.base.querySelector(
			selector.numberEntry
		) as HTMLElement;
		const tilesDrawn = this.base.querySelector(
			selector.tilesDrawn
		) as HTMLElement;

		if (completedShape !== null) {
			this.completedShape = new CheckboxGroup(completedShape);
		}
		if (numberEntryBase !== null) {
			this.numberEntry = new NumberEntry(numberEntryBase, {
				onPointsChanged: this.onPointsChanged,
				selectors: {
					display: '.js-number-entry__display',
					numberPad: '.js-number-entry__number-pad'
				}
			});
		}
		if (tilesDrawn !== null) {
			this.tilesDrawn = new CheckboxGroup(tilesDrawn);
		}

		this.updateVisualState();
	}

	private updateVisualState(): void {
		if (this.completedShape) {
			this.completedShape.base.hidden = this.turnType !== TurnType.Default;
		}
		if (this.tilesDrawn) {
			this.tilesDrawn.base.hidden = this.turnType !== TurnType.Default;
		}

		const playedTripleContainer = this.base.querySelector(
			selector.playedTripleContainer
		) as HTMLElement;
		if (playedTripleContainer !== null) {
			playedTripleContainer.hidden = this.turnType !== TurnType.RoundStart;
		}
	}

	/* -- PUBLIC METHODS ---------------------------------------------------- */
	reset(): void {
		const playedTriple = this.base.querySelector(
			selector.playedTriple
		) as HTMLInputElement;
		if (playedTriple) {
			playedTriple.checked = false;
		}

		this.completedShape?.reset();
		this.numberEntry?.reset();
		this.tilesDrawn?.reset();

		this.numberEntry.base.scrollIntoView();
	}
}

/* == EXPORTS =============================================================== */
export { baseSelector };

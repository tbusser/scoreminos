import { bind } from '01-global/decorator/bind';
import { NumberPad } from '02-components/NumberPad';

/* == INTERFACES ============================================================ */
interface Configuration {
	defaultPoints?: number;
	onPointsChanged?: (value: number | undefined) => void;
	selectors: Selectors;
}

interface Selectors {
	display: string;
	numberPad: string;
}

/* == CLASS ================================================================= */
export class NumberEntry {
	/* -- CONSTRUCTOR ------------------------------------------------------- */
	constructor(readonly base: HTMLElement, private configuration: Configuration) {
		this.setup();
	}

	/* -- PRIVATE FIELDS ---------------------------------------------------- */
	private display: HTMLElement | undefined;
	private numberPad: NumberPad | undefined;

	/* -- INSTANCE PROPERTIES ----------------------------------------------- */
	get value(): number | undefined {
		return this.numberPad?.value;
	}
	set value(value: number | undefined) {
		if (this.numberPad === undefined) {
			return;
		}

		this.numberPad.value = value;
		this.showPoints(value);
	}

	/* -- EVENT HANDLING ---------------------------------------------------- */
	@bind
	private onPointsChanged(value: number | undefined): void {
		this.showPoints(value);
		this.configuration.onPointsChanged?.(value);
	}

	/* -- PRIVATE METHODS --------------------------------------------------- */
	private setup(): void {
		this.display = this.base.querySelector(
			this.configuration.selectors.display
		) as HTMLElement;

		const numberPadBase = this.base.querySelector(
			this.configuration.selectors.numberPad
		) as HTMLElement;
		if (numberPadBase !== null) {
			this.numberPad = new NumberPad(numberPadBase, this.onPointsChanged);
		}

		this.value = this.configuration.defaultPoints;
	}

	private showPoints(points: number | undefined): void {
		if (!this.display) {
			return;
		}

		this.display.textContent = points?.toString() ?? '--';
	}

	/* -- PULBIC METHODS ---------------------------------------------------- */
	reset(): void {
		this.value = this.configuration.defaultPoints;
	}
}

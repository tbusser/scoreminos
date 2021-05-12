import { bind } from '02-utilities/decorators/bind';
import { NumberPad } from '04-components/NumberPad';

/* == INTERFACES ============================================================ */
interface Configuration {
	defaultPoints?: number;
	onPointsChanged?: (value: number) => void;
	selectors: Selectors;
}

interface Selectors {
	display: string;
	numberPad: string;
}

/* == CONSTANTS ============================================================= */
const defaultValue = 0;

/* == CLASS ================================================================= */
export class NumberEntry {
	/* -- CONSTRUCTOR ------------------------------------------------------- */
	constructor(readonly base: HTMLElement, private configuration: Configuration) {
		this.setup();
	}

	/* -- PRIVATE FIELDS ---------------------------------------------------- */
	private display: HTMLElement;
	private numberPad: NumberPad;

	/* -- INSTANCE PROPERTIES ----------------------------------------------- */
	get value(): number | undefined {
		return this.numberPad.value;
	}
	set value(value: number) {
		this.numberPad.value = value;
		this.showPoints(value);
	}

	/* -- EVENT HANDLING ---------------------------------------------------- */
	@bind
	private onPointsChanged(value: number): void {
		this.showPoints(value);
		this.configuration.onPointsChanged?.(value);
	}

	/* -- PRIVATE METHODS --------------------------------------------------- */
	private setup(): void {
		this.display = this.base.querySelector(this.configuration.selectors.display);

		const numberPadBase = this.base.querySelector(
			this.configuration.selectors.numberPad
		) as HTMLElement;
		if (numberPadBase !== null) {
			this.numberPad = new NumberPad(numberPadBase, this.onPointsChanged);
		}

		if (this.configuration.defaultPoints !== undefined) {
			this.value = this.configuration.defaultPoints;
		}
	}

	private showPoints(points: number): void {
		if (!this.display) {
			return;
		}

		this.display.textContent = points?.toString() ?? '0';
	}

	/* -- PULBIC METHODS ---------------------------------------------------- */
	reset(): void {
		this.value = defaultValue;
	}
}

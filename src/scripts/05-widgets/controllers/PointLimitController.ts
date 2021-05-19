import { updateMessageVisibility } from '03-modules/error-message';
import { BaseController } from '04-components/BaseController';
import { NumberEntry } from '04-components/NumberEntry';

/* == INTERFACES ============================================================ */
interface Configuration {
	defaultPoints: number;
	isVisible: boolean;
	onCancel: () => void;
	onLimitSet: (points: number) => void;
	pointsValidation: PointsValidation;
	selectors: Selectors;
}

interface PointsValidation {
	maximum: number;
	minimum: number;
	warningId: string;
}

interface Selectors {
	numberEntry: string;
}

/* == CLASS ================================================================= */
export class PointLimitController extends BaseController {
	/* -- CONSTRUCTOR ------------------------------------------------------- */
	constructor(readonly base: HTMLElement, private config: Configuration) {
		super(base);
		this.setup();
	}

	/* -- FIELDS ------------------------------------------------------------- */
	private numberEntry: NumberEntry;

	/* -- EVENT HANDLING ---------------------------------------------------- */
	protected onSecondaryAction(): void {
		this.config.onCancel?.call(this);
	}

	protected onPrimaryAction(): void {
		const { pointsValidation } = this.config;
		// setLimit = this.numberPad.value,
		const setLimit = this.numberEntry.value;
		const isValid: boolean =
			setLimit >= pointsValidation.minimum && setLimit <= pointsValidation.maximum;

		this.updateWarningVisibility(isValid);

		if (isValid) {
			this.config.onLimitSet?.call(this, setLimit);
		}
	}

	/* -- PRIVATE METHODS --------------------------------------------------- */
	private setup(): void {
		this.isVisible = this.config.isVisible;

		const numberEntryBase = this.base.querySelector(
			this.config.selectors.numberEntry
		) as HTMLElement;
		if (numberEntryBase !== null) {
			this.numberEntry = new NumberEntry(numberEntryBase, {
				defaultPoints: this.config.defaultPoints,
				selectors: {
					display: '.js-number-entry__display',
					numberPad: '.js-number-entry__number-pad'
				}
			});
		}
	}

	private updateWarningVisibility(hide: boolean): void {
		const visibleIds = hide ? [] : [this.config.pointsValidation.warningId];

		updateMessageVisibility(this.base, visibleIds);
	}

	/* -- PUBLIC METHODS ---------------------------------------------------- */
	reset(): void {
		this.numberEntry?.reset();
	}
}

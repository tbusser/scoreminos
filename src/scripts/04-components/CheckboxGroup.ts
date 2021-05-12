import { bind } from '02-utilities/decorators/bind';

/* == CONSTANTS ============================================================= */
const moduleName = 'checkbox-group';
const baseSelector = `.js-${moduleName}`;
const selector = {
	selectedInput: 'input:checked'
};

/* == CLASS ================================================================= */
export class CheckboxGroup {
	/* -- CONSTRUCTOR ------------------------------------------------------- */
	constructor(
		readonly base: HTMLElement,
		private callback?: (value: string | undefined) => void
	) {
		this.bindEvents();
		this.setup();
	}

	/* -- FIELDS ------------------------------------------------------------ */
	private initialCheckbox: HTMLInputElement;
	private selectedCheckbox: HTMLInputElement;

	/* -- INSTANCE PROPERTIES ----------------------------------------------- */
	get selectedValue(): string | undefined {
		return this.selectedCheckbox?.value ?? undefined;
	}

	/* -- EVENT HANDLING ---------------------------------------------------- */
	private bindEvents(): void {
		this.base.addEventListener('change', this.onCheckboxSelected);
	}

	@bind
	private onCheckboxSelected(event: Event): void {
		const checkbox = event.target as HTMLInputElement;

		if (checkbox.checked && this.selectedCheckbox) {
			this.selectedCheckbox.checked = false;
		}

		this.selectedCheckbox = checkbox.checked ? checkbox : null;

		if (this.callback) {
			this.callback(this.selectedValue);
		}
	}

	/* -- PRIVATE METHODS --------------------------------------------------- */
	private setup(): void {
		this.initialCheckbox = this.base.querySelector(selector.selectedInput);
		this.selectedCheckbox = this.initialCheckbox;
	}

	/* -- PUBLIC METHODS ---------------------------------------------------- */
	reset(): void {
		if (this.selectedCheckbox === this.initialCheckbox) {
			return;
		}

		if (this.selectedCheckbox) {
			this.selectedCheckbox.checked = false;
		}

		this.selectedCheckbox = this.initialCheckbox;

		if (this.selectedCheckbox) {
			this.selectedCheckbox.checked = true;
		}
	}
}

/* == EXPORTS =============================================================== */
export { baseSelector };

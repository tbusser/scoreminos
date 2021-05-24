import { bind } from '01-global/decorator/bind';

/* == CONSTANTS ============================================================= */
const moduleName = 'number-pad';
const baseSelector = `.js-${moduleName}`;
const defaultValue = '';

const action = {
	backspace: 'backspace',
	clear: 'clear'
};

const attributeName = {
	action: 'data-action',
	value: 'data-value'
};

const selector = {
	button: `[${attributeName.action}], [${attributeName.value}]`
};

/* == CLASS ================================================================= */
export class NumberPad {
	/* -- CONSTRUCTOR ------------------------------------------------------- */
	constructor(
		readonly base: HTMLElement,
		private callback?: (value: number | undefined) => void
	) {
		this.bindEvents();
	}

	/* -- FIELDS ------------------------------------------------------------ */
	private _value: string = defaultValue;

	/* -- INSTANCE PROPERTIES ----------------------------------------------- */
	get value(): number | undefined {
		return this._value === '' ? undefined : parseInt(this._value, 10);
	}
	set value(value: number | undefined) {
		// @ts-ignore value can't be undefined as we check if it is finite.
		this._value = Number.isFinite(value) ? value.toString() : '';
	}

	/* -- EVENT HANDLING ---------------------------------------------------- */
	private bindEvents(): void {
		this.base.addEventListener('click', this.onClick);
	}

	@bind
	private onClick(event: Event): void {
		const button = (event.target as HTMLElement).closest(selector.button);
		if (button === null) {
			return;
		}

		const hasChanged = button.hasAttribute(attributeName.action)
			? this.processAction(button.getAttribute(attributeName.action))
			: this.processValue(button.getAttribute(attributeName.value));

		if (hasChanged && this.callback) {
			this.callback(this.value);
		}
	}

	/* -- PRIVATE METHODS --------------------------------------------------- */
	private processAction(selectedAction: string): boolean {
		if (this._value === '') {
			return false;
		}

		switch (selectedAction) {
			case action.backspace:
				this._value = this._value.slice(0, -1);

				return true;

			case action.clear:
				this.reset();

				return true;

			default:
				return false;
		}
	}

	private processValue(value: string): boolean {
		this._value += value;

		return true;
	}

	/* -- PUBLIC METHODS ---------------------------------------------------- */
	reset(): void {
		this._value = defaultValue;
	}
}

/* == EXPORTS =============================================================== */
export { baseSelector };

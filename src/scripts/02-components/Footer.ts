import { bind } from '01-global/decorator/bind';

/* == INTERFACES ============================================================ */
interface Configuration {
	onPerformPrimaryAction?: () => void;
	onPerformSecondaryAction?: () => void;
}

/* == CONSTANTS ============================================================= */
const moduleName = 'footer';
const baseSelector = `.js-${moduleName}`;
const selector = {
	buttonPrimary: `${baseSelector}__primary`,
	buttonSecondary: `${baseSelector}__secondary`
};

/* == CLASS ================================================================= */
export class Footer {
	/* -- CONSTRUCTOR ------------------------------------------------------- */
	constructor(readonly base: HTMLElement, private config: Configuration) {
		this.setup();
		this.bindEvents();
	}

	/* -- FIELDS ------------------------------------------------------------ */
	private primaryButton: HTMLButtonElement;
	private secondaryButton: HTMLButtonElement;

	/* -- EVENT HANDLING ---------------------------------------------------- */
	private bindEvents(): void {
		this.primaryButton?.addEventListener('click', this.onPrimaryButtonClicked);
		this.secondaryButton?.addEventListener(
			'click',
			this.onSecondaryButtonClicked
		);
	}

	@bind
	private onPrimaryButtonClicked(event: Event): void {
		this.config.onPerformPrimaryAction?.call(this);
	}

	@bind
	private onSecondaryButtonClicked(event: Event): void {
		this.config.onPerformSecondaryAction?.call(this);
	}

	/* -- PRIVATE METHODS --------------------------------------------------- */
	private setup(): void {
		this.primaryButton = this.base.querySelector(
			selector.buttonPrimary
		) as HTMLButtonElement;
		this.secondaryButton = this.base.querySelector(
			selector.buttonSecondary
		) as HTMLButtonElement;
	}

	/* -- PUBLIC METHODS ---------------------------------------------------- */
	get primaryEnabled(): boolean {
		return this.primaryButton?.disabled ?? false;
	}
	set primaryEnabled(value: boolean) {
		if (this.primaryButton === null) {
			return;
		}

		this.primaryButton.disabled = !value;
	}

	get secondaryEnabled(): boolean {
		return this.secondaryButton?.disabled ?? false;
	}
	set secondaryEnabled(value: boolean) {
		if (this.secondaryButton === null) {
			return;
		}

		this.secondaryButton.disabled = !value;
	}

	get secondaryTitle(): string {
		return this.secondaryButton?.textContent ?? '';
	}
	set secondaryTitle(value: string) {
		if (this.secondaryButton === null) {
			return;
		}

		this.secondaryButton.textContent = value;
	}
}

/* == EXPORTS =============================================================== */
export { baseSelector };

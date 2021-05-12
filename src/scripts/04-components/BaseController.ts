import {
	Header,
	baseSelector as headerBaseSelector
} from '04-components/Header';
import {
	Footer,
	baseSelector as footerBaseSelector
} from '04-components/Footer';

/* == CLASS ================================================================= */
export class BaseController {
	/* -- CONSTRUCTOR ------------------------------------------------------- */
	constructor(readonly base: HTMLElement) {
		this.setupBase();
	}

	/* -- FIELDS ------------------------------------------------------------ */
	protected header: Header;
	protected footer: Footer;

	/* -- INSTANCE PROPERTIES ----------------------------------------------- */
	get isVisible(): boolean {
		return !this.base.hidden;
	}
	set isVisible(value: boolean) {
		this.base.hidden = !value;
	}

	/* -- PROTECTED METHODS ------------------------------------------------- */
	protected onSecondaryAction(): void {
		// noop'
	}

	protected onPrimaryAction(): void {
		// noop'
	}

	/* -- PRIVATE METHODS --------------------------------------------------- */
	private setupBase() {
		const headerBase = this.base.querySelector(headerBaseSelector) as HTMLElement;
		const footerBase = this.base.querySelector(footerBaseSelector) as HTMLElement;

		if (headerBase !== null) {
			this.header = new Header(headerBase);
		}

		if (footerBase !== null) {
			this.footer = new Footer(footerBase, {
				onPerformPrimaryAction: () => this.onPrimaryAction(),
				onPerformSecondaryAction: () => this.onSecondaryAction()
			});
		}
	}
}

import { bind } from '02-utilities/decorators/bind';

/* == INTERFACES ============================================================ */
type BeforeShow = (content: HTMLElement) => void;

interface Placeholder {
	[name: string]: string;
}

interface ShowOptions {
	onBeforeShow?: BeforeShow;
	onClose?: () => void;
	placeholders?: Placeholder;
}

/* == CONSTANTS ============================================================= */
const moduleName = 'dialog';
const baseSelector = `.js-${moduleName}`;

const cssClass = {
	isVisible: 'is-visible'
};

const selector = {
	closeTrigger: `${baseSelector}__close`,
	container: `${baseSelector}__container`,
	portal: '#dialog-portal'
};

export const dialogCloseTriggerSelector = selector.closeTrigger;

/* == CLASS ================================================================= */
export class Dialog {
	constructor() {
		this.setup();
	}

	/* -- FIELDS ------------------------------------------------------------ */
	private container: HTMLElement;
	private closeCallback: () => void;
	private portal: HTMLElement;

	/* -- INSTANCE PROPERTIES ----------------------------------------------- */
	get dialogContent(): HTMLElement {
		return this.container;
	}

	/* -- EVENT HANDLING ---------------------------------------------------- */
	@bind
	private onClose(): void {
		this.hideDialog();
	}

	/* -- PRIVATE METHODS --------------------------------------------------- */
	private bindCloseEvent(): void {
		const closeTrigger = this.container?.querySelector(selector.closeTrigger);
		closeTrigger?.addEventListener('click', this.onClose);
	}

	private fillPlaceholders(
		content: HTMLElement,
		placeholders: Placeholder
	): void {
		Object.keys(placeholders).forEach(id => {
			const element = content.querySelector(`[data-placeholder="${id}"]`);
			if (element !== null) {
				element.textContent = placeholders[id];
			}
		});
	}

	private getDialogContent(id: string): HTMLElement | null {
		const template = document.getElementById(
			`dialog-${id}`
		) as HTMLTemplateElement;

		return (
			(template?.content.firstElementChild.cloneNode(true) as HTMLElement) ?? null
		);
	}

	private setup() {
		this.portal = document.querySelector(selector.portal);
		this.container = this.portal?.querySelector(selector.container);
	}

	/* -- PUBLIC METHODS ---------------------------------------------------- */
	hideDialog(): void {
		this.portal.classList.remove(cssClass.isVisible);
		this.container.removeChild(this.container.firstElementChild);
		this.closeCallback?.();
		this.closeCallback = null;
	}

	showDialog(id: string, options: ShowOptions): void {
		this.closeCallback = options.onClose;

		const content = this.getDialogContent(id);
		if (options.placeholders) {
			this.fillPlaceholders(content, options.placeholders);
		}

		this.container.appendChild(content);
		this.bindCloseEvent();
		options.onBeforeShow?.(this.container);

		this.portal.classList.add(cssClass.isVisible);
	}
}

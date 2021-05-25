import { bind } from '01-global/decorator/bind';

/* == INTERFACES ============================================================ */
interface Configuration {
	background?: HTMLElement;
	onHidden?: () => void;
	onShown?: () => void;
}

/* == CONSTANTS ============================================================= */
const cssClass = {
	isVisible: 'is-visible'
};

/* == CLASS ================================================================= */
export class FlyIn {
	constructor(readonly base: HTMLElement, private config?: Configuration) {
		this.setup();
	}

	/* -- FIELDS ------------------------------------------------------------ */
	private isVisible = false;

	/* -- INSTANCE PROPERTIES ----------------------------------------------- */
	private get background(): HTMLElement | undefined {
		return this.config?.background;
	}

	/* -- EVENT HANDLING ---------------------------------------------------- */
	@bind
	private onTransitionEnd(event: TransitionEvent): void {
		if (this.isVisible) {
			this.config?.onShown?.();
		} else {
			this.base.hidden = true;
			this.config?.onHidden?.();
		}
	}

	/* -- PRIVATE METHODS --------------------------------------------------- */
	private setup(): void {
		this.base.addEventListener('transitionend', this.onTransitionEnd);
	}

	/* -- PUBLIC METHODS ---------------------------------------------------- */
	hide(): void {
		this.isVisible = false;

		this.background?.classList.remove(cssClass.isVisible);
		this.base.classList.remove(cssClass.isVisible);
	}

	show(): void {
		this.isVisible = true;
		this.base.hidden = false;

		setTimeout(() => {
			this.background?.classList.add(cssClass.isVisible);
			this.base.classList.add(cssClass.isVisible);
		}, 0);
	}
}

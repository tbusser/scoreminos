import { bind } from '02-utilities/decorators/bind';

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

	/* -- INSTANCE PROPERTIES ----------------------------------------------- */
	private get background(): HTMLElement | undefined {
		return this.config?.background;
	}

	private get isVisible(): boolean {
		return this.base.classList.contains(cssClass.isVisible);
	}

	/* -- EVENT HANDLING ---------------------------------------------------- */
	@bind
	private onTransitionEnd(event: TransitionEvent): void {
		if (this.isVisible) {
			this.config?.onShown?.();
		} else {
			this.config?.onHidden?.();
		}
	}

	/* -- PRIVATE METHODS --------------------------------------------------- */
	private setup(): void {
		if (
			this.config?.onHidden === undefined &&
			this.config?.onShown === undefined
		) {
			return;
		}
		this.base.addEventListener('transitionend', this.onTransitionEnd);
	}

	/* -- PUBLIC METHODS ---------------------------------------------------- */
	hide(): void {
		this.background?.classList.remove(cssClass.isVisible);
		this.base.classList.remove(cssClass.isVisible);
	}

	show(): void {
		this.background?.classList.add(cssClass.isVisible);
		this.base.classList.add(cssClass.isVisible);
	}
}

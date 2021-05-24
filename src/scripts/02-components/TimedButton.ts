import { bind } from '01-global/decorator/bind';

/* == TYPES ================================================================= */
type OnTimeOut = () => void;

/* == CONSTANTS ============================================================= */
const cssClass = {
	active: 'is-active'
};

/* == CLASS ================================================================= */
export class TimedButton {
	constructor(readonly base: HTMLElement, private callback: OnTimeOut) {
		this.bindEvents();
	}

	/* -- EVENT HANDLING ---------------------------------------------------- */
	private bindEvents(): void {
		this.base.addEventListener('transitionend', this.onTimeOut);
	}

	@bind
	private onTimeOut(event: TransitionEvent): void {
		if (event.propertyName === 'transform') {
			this.callback?.();
		}
	}

	/* -- PUBLIC METHODS ---------------------------------------------------- */
	stop(): void {
		this.base.classList.remove(cssClass.active);
	}

	start(): void {
		this.base.classList.add(cssClass.active);
	}
}

/* == CONSTANTS ============================================================= */
const cssClass = {
	isVisible: 'is-visible'
};

/* == CLASS ================================================================= */
export class FlyOut {
	constructor(readonly base: HTMLElement) {
		//
	}

	/* -- PUBLIC METHODS ---------------------------------------------------- */
	hide(): void {
		this.base.classList.remove(cssClass.isVisible);
	}

	show(): void {
		this.base.classList.add(cssClass.isVisible);
	}
}

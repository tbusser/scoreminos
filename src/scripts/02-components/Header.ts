import { classByPredicate } from '01-global/utility/dom';

/* == CONSTANTS ============================================================= */
const moduleName = 'header';
const baseSelector = `.js-${moduleName}`;
const cssClass = {
	hasSubtitle: 'c-header--has-subtitle'
};
const selector = {
	subtitle: `${baseSelector}__subtitle`,
	title: `${baseSelector}__title`
};

/* == CLASS ================================================================= */
export class Header {
	/* -- CONSTRUCTOR ------------------------------------------------------- */
	constructor(readonly base: HTMLElement) {
		this.setup();
	}

	/* -- FIELDS ------------------------------------------------------------ */
	private _subtitle: HTMLElement;
	private _title: HTMLElement;

	/* -- INSTANCE PROPERTIES ----------------------------------------------- */
	/* --[ HAS-SUBTITLE ]-- */
	get hasSubtitle(): boolean {
		return this.subtitle !== undefined;
	}

	/* --[ SUBTITLE ]-- */
	get subtitle(): string | undefined {
		const subtitle = this._subtitle?.textContent;

		return subtitle === '' ? undefined : subtitle;
	}
	set subtitle(value: string | undefined) {
		this.updateSubtitle(value);
	}

	/* --[ TITLE ]-- */
	get title(): string {
		return this._title?.textContent;
	}
	set title(value: string) {
		if (this._title !== null) {
			this._title.textContent = value;
		}
	}

	/* -- PRIVATE METHODS --------------------------------------------------- */
	private setup(): void {
		this._subtitle = this.base.querySelector(selector.subtitle);
		this._title = this.base.querySelector(selector.title);

		classByPredicate(this.base, cssClass.hasSubtitle, this.hasSubtitle);
	}

	private updateSubtitle(subtitle: string | undefined): void {
		if (this._subtitle === null) {
			return;
		}

		this._subtitle.textContent = subtitle ?? '';
		classByPredicate(this.base, cssClass.hasSubtitle, this.hasSubtitle);
	}

	/* -- PUBLIC METHODS ---------------------------------------------------- */
	clearSubtitle(): void {
		this.subtitle = undefined;
	}
}

/* == EXPORTS =============================================================== */
export { baseSelector };

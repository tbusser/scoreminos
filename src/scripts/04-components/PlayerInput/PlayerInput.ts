/* == CONSTANTS ============================================================= */
const moduleName = 'player-input';
const baseSelector = `.js-${moduleName}`;
const selector = {
	form: `${baseSelector}__form`,
	input: 'input'
};

/* == CLASS ================================================================= */
export class PlayerInput {
	/* -- CONSTRUCTOR ------------------------------------------------------- */
	constructor(readonly base: HTMLElement) {
		//
	}

	/* -- INSTANCE PROPERTIES ----------------------------------------------- */
	get playerNames(): string[] {
		return this.getPlayerNames();
	}

	/* -- PRIVATE METHODS --------------------------------------------------- */
	private getPlayerNames(): string[] {
		const inputs = this.base.querySelectorAll(selector.input);

		return (Array.from(inputs) as HTMLInputElement[])
			.map((input: HTMLInputElement) => input.value.trim())
			.filter(name => name !== '');
	}
}

/* == EXPORTS =============================================================== */
export { baseSelector };

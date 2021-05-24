/* == PUBLIC METHODS ======================================================== */
export function classByPredicate(
	target: HTMLElement,
	cssClass: string,
	predicate: boolean
): void {
	const manipulation = predicate ? 'add' : 'remove';
	target.classList[manipulation](cssClass);
}

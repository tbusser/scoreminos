/* == INTERFACES ============================================================ */
interface Configuration {
	messageSelector?: string;
	scrollToVisible?: boolean;
}

/* == CONSTANTS ============================================================= */
const defaultConfig: Required<Configuration> = {
	messageSelector: '.js-message',
	scrollToVisible: true
};

/* == PUBLIC METHODS ======================================================== */
export function updateMessageVisibility(
	scope: HTMLElement,
	visibleIds: string[],
	config?: Configuration
): void {
	const configuration = {
		...defaultConfig,
		...config
	};
	const messages: HTMLElement[] = Array.from(
		scope.querySelectorAll(configuration.messageSelector)
	);

	messages.forEach(message => {
		message.hidden = !visibleIds.includes(message.id);
	});

	if (!configuration.scrollToVisible) {
		return;
	}

	const firstMessage = messages.find(message => !message.hidden);
	firstMessage?.scrollIntoView({
		behavior: 'smooth'
	});
}

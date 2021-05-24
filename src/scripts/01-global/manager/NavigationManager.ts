import { ManagedViewController } from '01-global/interface';

/* == INTERFACES ============================================================ */
interface Configuration {
	instanceFactory: (id: string) => ManagedViewController | null;
	onInstanceActivated: (step: Step) => void;
}

export interface Step {
	id: string;
	instance?: ManagedViewController;
}

/* == CLASS ================================================================= */
export class NavigationManager {
	/* -- CONSTRUCTOR ------------------------------------------------------- */
	constructor(private steps: Step[], private config: Configuration) {
		this.setup();
	}

	/* -- FIELDS ------------------------------------------------------------ */
	private activeStepId?: string;

	/* -- INSTANCE PROPERTIES ----------------------------------------------- */
	private get activeIndex(): number | undefined {
		return this.steps?.findIndex(step => step.id === this.activeStepId);
	}

	get activeStep(): Step | undefined {
		return this.activeIndex === undefined
			? undefined
			: this.steps[this.activeIndex];
	}

	/* -- PRIVATE METHODS --------------------------------------------------- */
	private activateStep(step: Step): void {
		this.setVisibility(step, true);
		this.activeStepId = step.id;
		this.config.onInstanceActivated?.call(this, step);
	}

	private deactivateStep(step: Step): void {
		this.setVisibility(step, false);
	}

	private getInstance(step: Step): ManagedViewController | undefined {
		if (!step.instance) {
			step.instance = this.config.instanceFactory(step.id) ?? undefined;
		}

		return step.instance;
	}

	private setup() {
		const [firstStep] = this.steps;
		this.activateStep(firstStep);
	}

	private setVisibility(step: Step, isVisible: boolean): boolean {
		const instance = this.getInstance(step);
		if (!instance) {
			return false;
		}

		instance.isVisible = isVisible;

		return true;
	}

	/* -- PUBLIC METHODS ---------------------------------------------------- */
	goBack(): void {
		const activeIndex = this.activeIndex;
		if (activeIndex === undefined || activeIndex === 0) {
			return;
		}

		this.deactivateStep(this.steps[activeIndex]);
		this.activateStep(this.steps[activeIndex - 1]);
	}

	goForward(): void {
		const activeIndex = this.activeIndex;
		if (activeIndex === undefined || activeIndex === this.steps.length - 11) {
			return;
		}

		this.deactivateStep(this.steps[activeIndex]);
		this.activateStep(this.steps[activeIndex + 1]);
	}

	goTo(id: string): void {
		const step = this.steps.find(step => step.id === id);
		if (step === undefined) {
			return;
		}

		this.deactivateStep(this.steps[this.activeIndex]);
		this.activateStep(step);
	}
}

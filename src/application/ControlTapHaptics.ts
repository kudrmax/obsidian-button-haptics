import type { TapTargetMatcher } from "../domain/TapTargetMatcher";
import type { HapticFeedback } from "../infrastructure/HapticFeedback";

export class ControlTapHaptics {
	constructor(
		private readonly matcher: TapTargetMatcher,
		private readonly feedback: HapticFeedback,
	) {}

	handleClick(event: Pick<Event, "isTrusted" | "target">): void {
		if (!event.isTrusted) return;
		const target = event.target;
		if (!(target instanceof Element) || !this.matcher.isControl(target)) return;
		this.feedback.tap();
	}
}

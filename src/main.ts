import { Platform, Plugin } from "obsidian";
import { ControlTapHaptics } from "./application/ControlTapHaptics";
import { TapTargetMatcher } from "./domain/TapTargetMatcher";
import { detectHapticFeedback, type HapticsHost } from "./infrastructure/HapticFeedback";

export default class ButtonHapticsPlugin extends Plugin {
	override onload(): void {
		if (!Platform.isMobile) return;
		const haptics = new ControlTapHaptics(
			new TapTargetMatcher(),
			detectHapticFeedback(window as unknown as HapticsHost),
		);
		this.registerDomEvent(document, "click", (event) => haptics.handleClick(event), { capture: true });
	}
}

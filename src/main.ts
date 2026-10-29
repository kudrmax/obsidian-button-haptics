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
		const capture = { capture: true };
		const passive = { capture: true, passive: true };
		this.registerDomEvent(document, "pointerdown", (event) => haptics.handlePointerDown(event), passive);
		this.registerDomEvent(document, "pointermove", (event) => haptics.handlePointerMove(event), passive);
		this.registerDomEvent(document, "pointerup", () => haptics.handlePointerEnd(), passive);
		this.registerDomEvent(document, "pointercancel", () => haptics.handlePointerEnd(), passive);
		this.registerDomEvent(document, "click", (event) => haptics.handleClick(event), capture);
	}
}

import { ControlKind, type TapTargetMatcher } from "../domain/TapTargetMatcher";
import type { HapticFeedback } from "../infrastructure/HapticFeedback";

export type TapEvent = Pick<Event, "isTrusted" | "target">;
export type PressEvent = TapEvent & Pick<PointerEvent, "isPrimary" | "clientX" | "clientY">;

interface PendingPress {
	timer: ReturnType<typeof setTimeout>;
	x: number;
	y: number;
}

// Mirrors native iOS: buttons respond on touch-down, list rows once the finger
// has rested without moving (or on release), so scrolling a list stays silent.
export class ControlTapHaptics {
	static readonly LIST_PRESS_DELAY_MS = 100;
	static readonly MOVE_TOLERANCE_PX = 10;

	private pending: PendingPress | null = null;
	private firedForGesture = false;

	constructor(
		private readonly matcher: TapTargetMatcher,
		private readonly feedback: HapticFeedback,
	) {}

	handlePointerDown(event: PressEvent): void {
		if (!event.isTrusted || !event.isPrimary) return;
		this.cancelPending();
		this.firedForGesture = false;
		const kind = this.controlKind(event);
		if (kind === ControlKind.Button) this.fire();
		else if (kind === ControlKind.ListItem) this.waitForRestingPress(event);
	}

	handlePointerMove(event: PressEvent): void {
		if (this.pending === null || !event.isPrimary) return;
		const distance = Math.hypot(event.clientX - this.pending.x, event.clientY - this.pending.y);
		if (distance > ControlTapHaptics.MOVE_TOLERANCE_PX) this.cancelPending();
	}

	handlePointerEnd(): void {
		this.cancelPending();
	}

	handleClick(event: TapEvent): void {
		if (!event.isTrusted) return;
		if (!this.firedForGesture && this.controlKind(event) !== null) this.fire();
		this.firedForGesture = false;
	}

	private waitForRestingPress(event: PressEvent): void {
		const timer = setTimeout(() => {
			this.pending = null;
			this.fire();
		}, ControlTapHaptics.LIST_PRESS_DELAY_MS);
		this.pending = { timer, x: event.clientX, y: event.clientY };
	}

	private cancelPending(): void {
		if (this.pending === null) return;
		clearTimeout(this.pending.timer);
		this.pending = null;
	}

	private fire(): void {
		this.firedForGesture = true;
		this.feedback.tap();
	}

	private controlKind(event: TapEvent): ControlKind | null {
		const target = event.target;
		return target instanceof Element ? this.matcher.match(target) : null;
	}
}

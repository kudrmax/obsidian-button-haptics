import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ControlTapHaptics } from "../src/application/ControlTapHaptics";
import { TapTargetMatcher } from "../src/domain/TapTargetMatcher";

const DELAY = ControlTapHaptics.LIST_PRESS_DELAY_MS;

function setup() {
	const feedback = { tap: vi.fn() };
	document.body.innerHTML = '<button id="button">Ok</button><div class="menu-item" id="row">Copy</div><p id="text">Text</p>';
	const haptics = new ControlTapHaptics(new TapTargetMatcher(), feedback);
	const target = (id: string) => document.getElementById(id)!;
	const press = (id: string, x = 0, y = 0) => ({ isTrusted: true, isPrimary: true, target: target(id), clientX: x, clientY: y });
	const click = (id: string) => ({ isTrusted: true, target: target(id) });
	return { feedback, haptics, press, click };
}

describe("ControlTapHaptics", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	describe("buttons", () => {
		it("vibrate on touch-down", () => {
			const { feedback, haptics, press } = setup();
			haptics.handlePointerDown(press("button"));
			expect(feedback.tap).toHaveBeenCalledOnce();
		});

		it("do not vibrate again on the click that follows", () => {
			const { feedback, haptics, press, click } = setup();
			haptics.handlePointerDown(press("button"));
			haptics.handlePointerEnd();
			haptics.handleClick(click("button"));
			expect(feedback.tap).toHaveBeenCalledOnce();
		});

		it("vibrate on a click without a touch, such as from a keyboard", () => {
			const { feedback, haptics, click } = setup();
			haptics.handleClick(click("button"));
			expect(feedback.tap).toHaveBeenCalledOnce();
		});
	});

	describe("list rows", () => {
		it("vibrate once the finger rests on them", () => {
			const { feedback, haptics, press, click } = setup();
			haptics.handlePointerDown(press("row"));
			expect(feedback.tap).not.toHaveBeenCalled();

			vi.advanceTimersByTime(DELAY);
			haptics.handlePointerEnd();
			haptics.handleClick(click("row"));

			expect(feedback.tap).toHaveBeenCalledOnce();
		});

		it("vibrate on release after a quick tap", () => {
			const { feedback, haptics, press, click } = setup();
			haptics.handlePointerDown(press("row"));
			vi.advanceTimersByTime(DELAY / 2);
			haptics.handlePointerEnd();
			haptics.handleClick(click("row"));
			vi.advanceTimersByTime(DELAY);
			expect(feedback.tap).toHaveBeenCalledOnce();
		});

		it("stay silent when the finger starts scrolling", () => {
			const { feedback, haptics, press } = setup();
			haptics.handlePointerDown(press("row", 0, 0));
			haptics.handlePointerMove(press("row", 0, ControlTapHaptics.MOVE_TOLERANCE_PX + 1));
			vi.advanceTimersByTime(DELAY);
			haptics.handlePointerEnd();
			expect(feedback.tap).not.toHaveBeenCalled();
		});

		it("tolerate a small jitter of the finger", () => {
			const { feedback, haptics, press } = setup();
			haptics.handlePointerDown(press("row", 0, 0));
			haptics.handlePointerMove(press("row", 3, 4));
			vi.advanceTimersByTime(DELAY);
			expect(feedback.tap).toHaveBeenCalledOnce();
		});

		it("stay silent when the browser cancels the touch for a scroll", () => {
			const { feedback, haptics, press } = setup();
			haptics.handlePointerDown(press("row"));
			haptics.handlePointerEnd();
			vi.advanceTimersByTime(DELAY);
			expect(feedback.tap).not.toHaveBeenCalled();
		});
	});

	it("stays silent on a touch outside controls", () => {
		const { feedback, haptics, press, click } = setup();
		haptics.handlePointerDown(press("text"));
		vi.advanceTimersByTime(DELAY);
		haptics.handleClick(click("text"));
		expect(feedback.tap).not.toHaveBeenCalled();
	});

	it("ignores programmatic events", () => {
		const { feedback, haptics, press, click } = setup();
		haptics.handlePointerDown({ ...press("button"), isTrusted: false });
		haptics.handleClick({ ...click("button"), isTrusted: false });
		expect(feedback.tap).not.toHaveBeenCalled();
	});

	it("ignores a second finger", () => {
		const { feedback, haptics, press } = setup();
		haptics.handlePointerDown({ ...press("button"), isPrimary: false });
		expect(feedback.tap).not.toHaveBeenCalled();
	});

	it("vibrates on the next gesture after one that never became a click", () => {
		const { feedback, haptics, press, click } = setup();
		haptics.handlePointerDown(press("button"));
		haptics.handlePointerEnd();
		haptics.handlePointerDown(press("button"));
		haptics.handleClick(click("button"));
		expect(feedback.tap).toHaveBeenCalledTimes(2);
	});
});

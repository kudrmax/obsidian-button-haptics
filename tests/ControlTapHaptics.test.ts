import { describe, expect, it, vi } from "vitest";
import { ControlTapHaptics } from "../src/application/ControlTapHaptics";
import { TapTargetMatcher } from "../src/domain/TapTargetMatcher";

function setup() {
	const feedback = { tap: vi.fn() };
	document.body.innerHTML = '<button id="button">Ok</button><p id="text">Text</p>';
	const haptics = new ControlTapHaptics(new TapTargetMatcher(), feedback);
	const element = (id: string) => document.getElementById(id)!;
	return { feedback, haptics, element };
}

describe("ControlTapHaptics", () => {
	it("vibrates on a real tap on a control", () => {
		const { feedback, haptics, element } = setup();
		haptics.handleClick({ isTrusted: true, target: element("button") });
		expect(feedback.tap).toHaveBeenCalledOnce();
	});

	it("stays silent on a tap outside controls", () => {
		const { feedback, haptics, element } = setup();
		haptics.handleClick({ isTrusted: true, target: element("text") });
		expect(feedback.tap).not.toHaveBeenCalled();
	});

	it("stays silent on a programmatic click", () => {
		const { feedback, haptics, element } = setup();
		haptics.handleClick({ isTrusted: false, target: element("button") });
		expect(feedback.tap).not.toHaveBeenCalled();
	});

	it("stays silent when the target is not an element", () => {
		const { feedback, haptics } = setup();
		haptics.handleClick({ isTrusted: true, target: document });
		expect(feedback.tap).not.toHaveBeenCalled();
	});
});

import { describe, expect, it, vi } from "vitest";
import {
	CapacitorHaptics,
	detectHapticFeedback,
	NoHaptics,
	VibrationApiHaptics,
} from "../src/infrastructure/HapticFeedback";

describe("detectHapticFeedback", () => {
	it("prefers the native Capacitor haptics", () => {
		const impact = vi.fn().mockResolvedValue(undefined);
		const feedback = detectHapticFeedback({
			Capacitor: { Plugins: { Haptics: { impact } } },
			navigator: { vibrate: vi.fn() },
		});

		feedback.tap();

		expect(feedback).toBeInstanceOf(CapacitorHaptics);
		expect(impact).toHaveBeenCalledWith({ style: "LIGHT" });
	});

	it("falls back to a short tick of the Vibration API", () => {
		const vibrate = vi.fn().mockReturnValue(true);
		const feedback = detectHapticFeedback({ navigator: { vibrate } });

		feedback.tap();

		expect(feedback).toBeInstanceOf(VibrationApiHaptics);
		expect(vibrate).toHaveBeenCalledWith(VibrationApiHaptics.TICK_MS);
	});

	it("does nothing when the device cannot vibrate", () => {
		expect(detectHapticFeedback({ navigator: {} })).toBeInstanceOf(NoHaptics);
	});

	it("swallows a rejected native impact", async () => {
		const impact = vi.fn().mockRejectedValue(new Error("unavailable"));
		new CapacitorHaptics({ impact }).tap();
		await Promise.resolve();
		expect(impact).toHaveBeenCalledOnce();
	});
});

export interface HapticFeedback {
	tap(): void;
}

export interface CapacitorHapticsPlugin {
	impact(options: { style: "LIGHT" | "MEDIUM" | "HEAVY" }): Promise<void>;
}

export interface HapticsHost {
	Capacitor?: { Plugins?: { Haptics?: Partial<CapacitorHapticsPlugin> } };
	navigator: { vibrate?: (pattern: number) => boolean };
}

export class CapacitorHaptics implements HapticFeedback {
	constructor(private readonly plugin: CapacitorHapticsPlugin) {}

	tap(): void {
		this.plugin.impact({ style: "LIGHT" }).catch(() => {});
	}
}

export class VibrationApiHaptics implements HapticFeedback {
	static readonly TICK_MS = 15;

	constructor(private readonly vibrate: (pattern: number) => boolean) {}

	tap(): void {
		this.vibrate(VibrationApiHaptics.TICK_MS);
	}
}

export class NoHaptics implements HapticFeedback {
	tap(): void {}
}

export function detectHapticFeedback(host: HapticsHost): HapticFeedback {
	const haptics = host.Capacitor?.Plugins?.Haptics;
	if (typeof haptics?.impact === "function") return new CapacitorHaptics(haptics as CapacitorHapticsPlugin);
	const vibrate = host.navigator.vibrate;
	if (typeof vibrate === "function") return new VibrationApiHaptics(vibrate.bind(host.navigator));
	return new NoHaptics();
}

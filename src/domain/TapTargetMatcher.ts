export const INTERFACE_CONTROLS = [
	"button",
	'[role="button"]',
	".clickable-icon",
	".view-action",
	".menu-item",
	".mobile-navbar-action",
	".workspace-drawer-header-icon",
	".workspace-drawer-tab-option-item",
	".modal-header-button",
	".modal-close-button",
	".modal-setting-back-button",
	".checkbox-container",
	".dropdown",
	".nav-action-button",
	".canvas-control-item",
	".suggestion-item",
	".vertical-tab-nav-item",
	".setting-editor-extra-setting-button",
].join(",");

// Obsidian already vibrates on the sidebar toggle itself.
export const IGNORED_CONTROLS = [
	".sidebar-toggle-button",
	".is-disabled",
	'[aria-disabled="true"]',
	"[disabled]",
].join(",");

export class TapTargetMatcher {
	constructor(
		private readonly controls: string = INTERFACE_CONTROLS,
		private readonly ignored: string = IGNORED_CONTROLS,
	) {}

	isControl(element: Element): boolean {
		const control = element.closest(this.controls);
		return control !== null && control.closest(this.ignored) === null;
	}
}

export enum ControlKind {
	Button = "button",
	ListItem = "list-item",
}

export const BUTTON_CONTROLS = [
	"button",
	'[role="button"]',
	".clickable-icon",
	".view-action",
	".mobile-navbar-action",
	".workspace-drawer-header-icon",
	".modal-header-button",
	".modal-close-button",
	".modal-setting-back-button",
	".checkbox-container",
	".dropdown",
	".nav-action-button",
	".canvas-control-item",
	".setting-editor-extra-setting-button",
].join(",");

// Rows of scrollable lists: a touch on them may turn into a scroll.
export const LIST_ITEM_CONTROLS = [
	".menu-item",
	".suggestion-item",
	".vertical-tab-nav-item",
	".workspace-drawer-tab-option-item",
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
		private readonly buttons: string = BUTTON_CONTROLS,
		private readonly listItems: string = LIST_ITEM_CONTROLS,
		private readonly ignored: string = IGNORED_CONTROLS,
	) {}

	match(element: Element): ControlKind | null {
		const listItem = element.closest(this.listItems);
		const button = element.closest(this.buttons);
		const control = this.innermost(listItem, button);
		if (control === null || control.closest(this.ignored) !== null) return null;
		return control === listItem ? ControlKind.ListItem : ControlKind.Button;
	}

	private innermost(listItem: Element | null, button: Element | null): Element | null {
		if (listItem === null || button === null) return listItem ?? button;
		return listItem !== button && listItem.contains(button) ? button : listItem;
	}
}

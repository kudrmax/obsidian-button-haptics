import { beforeEach, describe, expect, it } from "vitest";
import { ControlKind, TapTargetMatcher } from "../src/domain/TapTargetMatcher";

function render(html: string): HTMLElement {
	document.body.innerHTML = html;
	return document.getElementById("tap")!;
}

describe("TapTargetMatcher", () => {
	let matcher: TapTargetMatcher;

	beforeEach(() => {
		matcher = new TapTargetMatcher();
	});

	it("treats a button as a button", () => {
		expect(matcher.match(render('<button id="tap">Ok</button>'))).toBe(ControlKind.Button);
	});

	it("treats an icon nested inside a clickable control as a button", () => {
		expect(matcher.match(render('<div class="clickable-icon"><svg id="tap"></svg></div>'))).toBe(ControlKind.Button);
	});

	it("treats menu and suggestion rows as list items", () => {
		expect(matcher.match(render('<div class="menu-item"><span id="tap">Copy</span></div>'))).toBe(ControlKind.ListItem);
		expect(matcher.match(render('<div class="suggestion-item" id="tap">Note</div>'))).toBe(ControlKind.ListItem);
	});

	it("keeps a row a list item even when it also has the button role", () => {
		expect(matcher.match(render('<div class="menu-item" role="button" id="tap">Copy</div>'))).toBe(ControlKind.ListItem);
	});

	it("treats a button inside a list row as a button", () => {
		expect(matcher.match(render('<div class="suggestion-item"><div class="clickable-icon" id="tap"></div></div>'))).toBe(ControlKind.Button);
	});

	it("ignores plain text", () => {
		expect(matcher.match(render('<div class="markdown-preview-view"><p id="tap">Text</p></div>'))).toBeNull();
	});

	it("ignores disabled controls", () => {
		expect(matcher.match(render('<button id="tap" disabled>Ok</button>'))).toBeNull();
		expect(matcher.match(render('<div class="menu-item is-disabled"><span id="tap">Cut</span></div>'))).toBeNull();
		expect(matcher.match(render('<div role="button" aria-disabled="true" id="tap"></div>'))).toBeNull();
	});

	it("ignores the sidebar toggle that Obsidian vibrates on itself", () => {
		expect(matcher.match(render('<div class="sidebar-toggle-button"><div class="clickable-icon" id="tap"></div></div>'))).toBeNull();
	});
});

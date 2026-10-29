import { beforeEach, describe, expect, it } from "vitest";
import { TapTargetMatcher } from "../src/domain/TapTargetMatcher";

function render(html: string): HTMLElement {
	document.body.innerHTML = html;
	return document.getElementById("tap")!;
}

describe("TapTargetMatcher", () => {
	let matcher: TapTargetMatcher;

	beforeEach(() => {
		matcher = new TapTargetMatcher();
	});

	it("matches a button itself", () => {
		expect(matcher.isControl(render('<button id="tap">Ok</button>'))).toBe(true);
	});

	it("matches an icon nested inside a clickable control", () => {
		expect(matcher.isControl(render('<div class="clickable-icon"><svg id="tap"></svg></div>'))).toBe(true);
	});

	it("matches a menu item and a suggestion item", () => {
		expect(matcher.isControl(render('<div class="menu-item"><span id="tap">Copy</span></div>'))).toBe(true);
		expect(matcher.isControl(render('<div class="suggestion-item" id="tap">Note</div>'))).toBe(true);
	});

	it("ignores plain text", () => {
		expect(matcher.isControl(render('<div class="markdown-preview-view"><p id="tap">Text</p></div>'))).toBe(false);
	});

	it("ignores disabled controls", () => {
		expect(matcher.isControl(render('<button id="tap" disabled>Ok</button>'))).toBe(false);
		expect(matcher.isControl(render('<div class="menu-item is-disabled"><span id="tap">Cut</span></div>'))).toBe(false);
		expect(matcher.isControl(render('<div role="button" aria-disabled="true" id="tap"></div>'))).toBe(false);
	});

	it("ignores the sidebar toggle that Obsidian vibrates on itself", () => {
		expect(matcher.isControl(render('<div class="sidebar-toggle-button"><div class="clickable-icon" id="tap"></div></div>'))).toBe(false);
	});
});

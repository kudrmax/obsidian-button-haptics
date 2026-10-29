# Button Haptics

Light haptic feedback when you tap interface controls in Obsidian on mobile.

- iOS: native Taptic Engine through Capacitor Haptics (`impact`, light).
- Android and other devices without it: a short 15 ms tick of the Vibration API.

## How it decides what vibrates

Capture-phase pointer and `click` listeners on the document, timed like native iOS:

- Buttons and icons (`button`, `[role="button"]`, `.clickable-icon` and others) vibrate on touch-down.
- Rows of menus and lists (`.menu-item`, `.suggestion-item` and others) vibrate after the finger rests still for 100 ms, or on release after a quicker tap. A touch that turns into a scroll stays silent.

The selectors live in `src/domain/TapTargetMatcher.ts`. Disabled controls, programmatic clicks and the sidebar toggle, where Obsidian vibrates on its own, are ignored.

## Development

```bash
npm install
npm test
npm run build
```

# Button Haptics

Light haptic feedback when you tap interface controls in Obsidian on mobile.

- iOS: native Taptic Engine through Capacitor Haptics (`impact`, light).
- Android and other devices without it: a short 15 ms tick of the Vibration API.

## How it decides what vibrates

One capture-phase `click` listener on the document. A tap vibrates when its target sits inside an interface control (`button`, `[role="button"]`, `.clickable-icon`, `.menu-item`, `.suggestion-item` and others in `src/domain/TapTargetMatcher.ts`) and is not disabled. Programmatic clicks are ignored, and so is the sidebar toggle, where Obsidian vibrates on its own.

## Development

```bash
npm install
npm test
npm run build
```

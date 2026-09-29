# 07: Installable and offline

Spec: [Monster Truck Money, the Garage version](../../monster-truck-garage/spec.md) (see "Home Screen icon and name" and "Stack") · Reference art: the "Home Screen icon" prototype (`prototype/home-icon` @ `f426946`)

**What to build:** The preview can be added to the Home Screen with the "Truck head-on" icon and the name "Truck Money", and it works offline after the first load. Updates apply on the next launch, never mid-Round.

**Blocked by:** 01 (Skeleton)

**Status:** ready-for-agent

- [ ] The icon is one 512×512 SVG in code (background layer + art layer), rasterised at build time; no image files are committed
- [ ] Ships `apple-touch-icon` 180×180, manifest 192 and 512 (`purpose: any`), and a maskable 512 with the art at 80% on the same yellow; all full squares with no transparency
- [ ] `apple-mobile-web-app-title` and manifest `short_name` are "Truck Money"; manifest `name` and `<title>` are "Monster Truck Money"
- [ ] `theme_color` and `background_color` are `#23252b`, and the page paints it first
- [ ] `vite-plugin-pwa` precaches the app, clips and code with `autoUpdate`, applied on the next launch
- [ ] The service worker registers only on the web; nothing reads the Cache API, and the app works without the service worker
- [ ] A headless check loads the build, goes offline and reloads successfully

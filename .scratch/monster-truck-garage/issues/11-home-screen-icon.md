# Prototype the Home Screen icon

Type: prototype
Status: resolved
Map: [Monster Truck Garage](../map.md)

## Question

What does the app look like on the iPad Home Screen? When he adds it to the Home Screen he needs an icon he can pick out without reading, plus a short name under it. Prototype a few icon designs (for example his Truck head-on, a Bolt, a coin with monster tires) and show them at real Home Screen size next to other apps, in light and dark mode. Settle:

- the icon design and how it's made (drawn in code or SVG, so it stays with the no-image-assets Truck, or rendered from the three.js Truck)
- the name under the icon (short enough not to be cut off, for example "Truck Money")
- the theme and background colour for the manifest and the launch screen
- the sizes to ship: `apple-touch-icon` 180×180, manifest 192 and 512, and a maskable version

The answer fills in the "Home Screen icon and name" section of `spec.md`, and slice 7 (Cutover) builds it.

## Answer

The prototype is on the throwaway branch `prototype/home-icon` @ `f426946` (`.scratch/monster-truck-garage/prototypes/home-icon-prototype.html`; run `python3 -m http.server 8080` there). There were three variants: A Truck head-on, B Bolt in a tire, and C Coin on monster tires. **A won.** It was checked in Safari.

- **Icon: "Truck head-on"** (A of three). A red Truck seen from the front on two big black tires, with a blue windshield, headlights and a grille, black cartoon outlines, on a yellow (`#ffd23f`) sunburst. It stands out most among other apps at 76 pt and still reads at 40 pt. B got lost on dark wallpapers and looked like a Settings gear. C read as a robot rather than a truck.
- **How it's made**: one 512×512 SVG drawn in code (a background layer and an art layer), rasterised to PNG at build time. There are no image files, and the three.js Truck is not rendered. The source is a full square with no transparency, because iOS applies its own rounded mask and turns see-through parts black.
- **Sizes to ship**: `apple-touch-icon` 180×180, manifest 192 and 512 (`purpose: any`), and a maskable 512 with the art scaled to 80% so it sits inside the safe zone on the same yellow background.
- **Name under the icon: "Truck Money"** (the recommended default, not separately confirmed). It is set as both `apple-mobile-web-app-title` and the manifest `short_name`. The full name, "Monster Truck Money", is the manifest `name` and the page `<title>`, and it gets cut off under the icon.
- **Theme and background colour: `#23252b`**, the app's dark background (the recommended default, not separately confirmed). It is used for `theme_color`, `background_color` and the page's first paint, so the launch screen matches the app, and the yellow icon stands out on it.

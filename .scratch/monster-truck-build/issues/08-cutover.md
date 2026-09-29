# 08: Cutover: replace the old app and install on the iPad

Spec: [Monster Truck Money, the Garage version](../../monster-truck-garage/spec.md) (see "Player and device")

**What to build:** The new build replaces the old app at the main Pages URL, and he installs it on the iPad and plays from the Home Screen from then on.

**Blocked by:** 04 (Mastery and Levels), 06 (Mods and unlocking), 07 (Installable and offline)

**Status:** ready-for-human

- [ ] The Pages workflow publishes the new build at the root; the old single-file app and the `next/` preview are retired
- [ ] Installed on the iPad from Safari via Add to Home Screen (install before play: Safari-tab storage is separate)
- [ ] The Home Screen shows the "Truck Money" icon and name, and the launch screen is dark
- [ ] With the iPad offline, the app opens, speaks and plays a Round
- [ ] Bolts and the Garage survive closing the app and restarting the iPad

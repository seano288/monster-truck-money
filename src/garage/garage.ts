// Garage actions on the saved game: choosing and buying Bodies, fitting and unlocking Mods and Colours, and the Goal.
import { game, update } from '../game/store';
import { needBolts, type Phrase } from '../voice/phrases';
import type { Item } from '../voice/say';
import {
  bodyItem, BODY_IDS, BOUGHT_COLOURS, buyableName, colourById, colourItem, defaultFit, FREE_COLOUR, isLegendary, isModItem, isStarter, LEGENDARY, modId, modName, paintShowsColour, parseMod,
  BOLT_RUNGS, type BodyId, type BoughtColour, type Buyable, type BuyRung, type ColourId, type Fit, type ModId, type Rung, type SlotId,
} from './catalog';
import { affordable, boltsNeeded, CASH_PRICES, goalOf, isLocked, nextLegendary as nextLegendaryOf, priceOf, unlock, waitingOn } from './economy';

export const currentBody = (): BodyId => game.value.body ?? 'pickup';
export const currentFit = (): Fit => game.value.fitted[currentBody()] ?? defaultFit();

/** His Truck's paint as one flat colour, for the 2D Truck on Home and the celebration road: Plain shows his Colour. */
export function truckColor() {
  const f = currentFit();
  return f.paint === 0 ? colourById(f.colour).hex : ['', '#1e7bff', '#ff6a00', '#c04dff', '#d4a017'][f.paint]!;
}

export const owns = (b: BodyId) => game.value.ownedBodies.includes(b);

export function chooseBody(body: BodyId) {
  update(s => ({ ...s, body }));
}

/** The ◀ ▶ arrows step through the Bodies he owns. */
export function stepBody(d: 1 | -1) {
  const mine = BODY_IDS.filter(owns), i = mine.indexOf(currentBody());
  chooseBody(mine[(i + d + mine.length) % mine.length]!);
}

function fit(slot: SlotId, rung: Rung) {
  const body = currentBody();
  update(s => ({ ...s, fitted: { ...s.fitted, [body]: { ...s.fitted[body], [slot]: rung } } }));
}

/** The number on this Body's door. Changing it is always free. */
export function setDoorNumber(n: number) {
  const body = currentBody();
  update(s => ({ ...s, fitted: { ...s.fitted, [body]: { ...s.fitted[body], doorNumber: n } } }));
}

export const isUnlocked = (slot: SlotId, rung: Rung) => rung === 0 || game.value.unlocked.includes(modId(slot, rung));
/** A Bolt item he has enough Bolts for. */
const canBuyWithBolts = (x: Buyable) => isLocked(game.value, x) && priceOf(x).bolts !== undefined && boltsNeeded(game.value, x) === 0;
export const canAfford = (slot: SlotId, rung: Rung) => rung !== 0 && canBuyWithBolts(modId(slot, rung));
export const canAffordBody = (b: BodyId) => !isStarter(b) && canBuyWithBolts(bodyItem(b));
/** The Paint hotspot also rings for a Colour he can buy. */
export const slotHasAffordable = (slot: SlotId) => BOLT_RUNGS.some(r => canAfford(slot, r)) || (slot === 'paint' && BOUGHT_COLOURS.some(canAffordColour));
/** The top-Rung Mod this Legendary is still waiting on. */
export const waitingFor = (slot: SlotId) => waitingOn(game.value, modId(slot, LEGENDARY));
export const affordableCount = () => affordable(game.value).length;
export const goal = () => goalOf(game.value);

export type TapResult = 'fitted' | 'unlocked' | 'goal' | 'checkout' | 'waiting';

/**
 * Tapping a Mod tile: an owned Mod is fitted; an affordable one is unlocked and fitted in one tap; a locked one
 * becomes the Goal. A locked Legendary opens the checkout, or waits until the top Rung in its Slot is unlocked.
 */
export function tapMod(slot: SlotId, rung: Rung): TapResult {
  if (isUnlocked(slot, rung)) { fit(slot, rung); return 'fitted'; }
  const mod = modId(slot, rung as BuyRung);
  if (isLegendary(mod)) return waitingFor(slot) ? 'waiting' : 'checkout';
  if (canAfford(slot, rung)) {
    update(s => unlock(s, mod, { kind: 'bolts' }));
    fit(slot, rung);
    return 'unlocked';
  }
  update(s => ({ ...s, goal: mod }));
  return 'goal';
}

export const ownsColour = (c: ColourId) => c === FREE_COLOUR || game.value.colours.includes(c);
export const canAffordColour = (c: ColourId) => c !== FREE_COLOUR && canBuyWithBolts(colourItem(c));

/** Fit a Colour on this Body. If the fitted Paint covers it, the Paint goes back to Plain so he sees it. */
function fitColour(c: ColourId) {
  const body = currentBody(), paint = paintShowsColour(currentFit().paint) ? currentFit().paint : 0;
  update(s => ({ ...s, fitted: { ...s.fitted, [body]: { ...s.fitted[body], colour: c, paint } } }));
}

/** Tapping a Colour swatch: an owned one is fitted; an affordable one is bought and fitted; a locked one becomes the Goal. */
export function tapColour(c: ColourId): Exclude<TapResult, 'checkout' | 'waiting'> {
  if (ownsColour(c)) { fitColour(c); return 'fitted'; }
  const item = colourItem(c as BoughtColour);
  if (canBuyWithBolts(item)) {
    update(s => unlock(s, item, { kind: 'bolts' }));
    fitColour(c);
    return 'unlocked';
  }
  update(s => ({ ...s, goal: item }));
  return 'goal';
}

/** He paid exactly for a Legendary at the checkout: it's his, and fitted. */
export function buyLegendary(slot: SlotId, cents: number) {
  update(s => unlock(s, modId(slot, LEGENDARY), { kind: 'cash', cents }));
  fit(slot, LEGENDARY);
}

export type BodyTapResult = 'switched' | 'bought' | 'goal';

/** Tapping a Body in the switcher: an owned one is driven; an affordable one is bought and driven; a locked one becomes the Goal. */
export function tapBody(b: BodyId): BodyTapResult {
  if (owns(b) || isStarter(b)) { chooseBody(b); return 'switched'; }
  const item = bodyItem(b);
  if (canBuyWithBolts(item)) {
    update(s => ({ ...unlock(s, item, { kind: 'bolts' }), body: b }));
    return 'bought';
  }
  update(s => ({ ...s, goal: item }));
  return 'goal';
}

/** "Chunky. You need 2 more Bolts." */
export const needLines = (x: Buyable): Phrase[] => [buyableName(x), needBolts(boltsNeeded(game.value, x))];

/** "You got Chunky!", or "You bought Gold Flake!" for a Legendary. */
export function gotLine(x: Buyable): Phrase {
  if (isModItem(x) && isLegendary(x)) return `You bought ${buyableName(x)}!` as Phrase;
  return `You got ${buyableName(x)}!` as Phrase;
}

/** "Gold Flake costs $2.10." */
export const costLines = (slot: SlotId): Item[] => [`${modName(slot, LEGENDARY)} costs` as Phrase, { cents: CASH_PRICES[slot] }];

/** "Laser Show. Get Glow Under first!" */
export function waitLines(slot: SlotId, top: ModId): Phrase[] {
  const { rung } = parseMod(top);
  return [modName(slot, LEGENDARY), `Get ${modName(slot, rung)} first!` as Phrase];
}

export const nextLegendary = () => nextLegendaryOf(game.value);

/** What tapping the Goal bar says. */
export function goalLines(): Item[] {
  const g = goal();
  if (!g) { const l = nextLegendary(); return l ? costLines(l) : ['You built everything!']; }
  if (boltsNeeded(game.value, g) > 0) return needLines(g);
  return [`You can get ${buyableName(g)}!` as Phrase];
}

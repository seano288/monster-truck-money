// A money amount is spoken from recorded pieces: "2 dollars" + "25 cents".

export type CentsPiece = `${number} cent` | `${number} cents`;
export type DollarsPiece = `${number} dollar` | `${number} dollars`;
export type AmountPiece = DollarsPiece | CentsPiece;

export const MAX_DOLLARS = 9;

export function amountPieces(cents: number): AmountPiece[] {
  if (!Number.isInteger(cents) || cents < 0 || cents >= (MAX_DOLLARS + 1) * 100) throw new RangeError(`No clips for ${cents}¢`);
  const d = Math.floor(cents / 100), c = cents % 100, out: AmountPiece[] = [];
  if (d) out.push(d === 1 ? '1 dollar' : `${d} dollars`);
  if (c) out.push(c === 1 ? '1 cent' : `${c} cents`);
  return out;
}

export function allAmountPieces(): AmountPiece[] {
  const out: AmountPiece[] = [];
  for (let c = 1; c < 100; c++) out.push(...amountPieces(c));
  for (let d = 1; d <= MAX_DOLLARS; d++) out.push(...amountPieces(d * 100));
  return out;
}

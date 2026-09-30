// The Door Number picker: two wheels, tens and ones, that each turn round 0-9, so the number stays 0-99.
export type Wheel = 'tens' | 'ones';

export const digits = (n: number): [number, number] => [Math.floor(n / 10), n % 10];

export function turnWheel(n: number, wheel: Wheel, dir: 1 | -1): number {
  const [tens, ones] = digits(n), turn = (d: number) => (d + dir + 10) % 10;
  return wheel === 'tens' ? turn(tens) * 10 + ones : tens * 10 + turn(ones);
}

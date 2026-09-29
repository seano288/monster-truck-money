import { describe, expect, it, vi } from 'vitest';
import { savePhoto, type ShareNav } from './photo';

const file = new File(['png'], 'Big Foot.png', { type: 'image/png' });
const nav = (over: Partial<ShareNav> = {}): ShareNav => ({ canShare: () => true, share: vi.fn(async () => {}), ...over });

describe('saving the photo', () => {
  it('opens the share sheet with the picture when it can', async () => {
    const n = nav(), download = vi.fn();
    expect(await savePhoto(file, n, download)).toBe('shared');
    expect(n.share).toHaveBeenCalledWith({ files: [file] });
    expect(download).not.toHaveBeenCalled();
  });

  it('downloads it where files cannot be shared', async () => {
    const download = vi.fn();
    expect(await savePhoto(file, nav({ canShare: () => false }), download)).toBe('downloaded');
    expect(await savePhoto(file, { share: undefined, canShare: undefined }, download)).toBe('downloaded');
    expect(download).toHaveBeenCalledTimes(2);
    expect(download).toHaveBeenCalledWith(file);
  });

  it('does nothing more when he closes the share sheet', async () => {
    const download = vi.fn(), share = vi.fn(async () => { throw new DOMException('closed', 'AbortError'); });
    expect(await savePhoto(file, nav({ share }), download)).toBe('cancelled');
    expect(download).not.toHaveBeenCalled();
  });

  it('downloads it when the share sheet fails to open', async () => {
    const download = vi.fn(), share = vi.fn(async () => { throw new DOMException('no gesture', 'NotAllowedError'); });
    expect(await savePhoto(file, nav({ share }), download)).toBe('downloaded');
    expect(download).toHaveBeenCalledWith(file);
  });
});

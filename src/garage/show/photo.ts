// Saving the Show Off photo. On iPad Safari and the installed app the share sheet has "Save Image", which puts
// it in Photos; anywhere that can't share files, it downloads instead.

/** The part of `navigator` that shares files. */
export interface ShareNav {
  canShare?: ((data: ShareData) => boolean) | undefined;
  share?: ((data: ShareData) => Promise<void>) | undefined;
}

export type SaveResult = 'shared' | 'downloaded' | 'cancelled';

export function downloadFile(file: File) {
  const a = document.createElement('a'), url = URL.createObjectURL(file);
  a.href = url;
  a.download = file.name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function savePhoto(file: File, nav: ShareNav = navigator, download = downloadFile): Promise<SaveResult> {
  const data = { files: [file] };
  if (nav.share && nav.canShare?.(data)) {
    try {
      await nav.share(data);
      return 'shared';
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') return 'cancelled'; // he closed the sheet
    }
  }
  download(file);
  return 'downloaded';
}

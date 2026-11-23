export const contactAttachmentMaxBytes = 4 * 1024 * 1024;

const attachmentFormats = {
  pdf: 'application/pdf',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
} as const;

export const contactAttachmentAccept = Object.keys(attachmentFormats)
  .map(extension => `.${extension}`)
  .join(',');

export function contactAttachmentMime(filename: string) {
  const extension = /\.([a-z]+)$/i.exec(filename)?.[1]?.toLowerCase();

  if (extension && Object.hasOwn(attachmentFormats, extension)) {
    return attachmentFormats[extension as keyof typeof attachmentFormats];
  }
}

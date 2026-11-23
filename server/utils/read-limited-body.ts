import type { IncomingMessage } from 'node:http';

export async function readLimitedBody(
  request: IncomingMessage,
  limit: number,
  statusMessage = 'Request too large',
) {
  const chunks: Buffer[] = [];
  let size = 0;

  for await (const chunk of request.iterator({ destroyOnReturn: false })) {
    const bytes: Buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);

    size += bytes.byteLength;

    if (size > limit) {
      request.resume();

      throw createError({
        statusCode: 413,
        statusMessage,
      });
    }

    chunks.push(bytes);
  }

  return Buffer.concat(chunks, size);
}

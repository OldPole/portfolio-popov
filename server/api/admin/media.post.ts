import { randomUUID } from 'node:crypto';
import sharp from 'sharp';
import type { OutputInfo } from 'sharp';
import { requireAdminWrite } from '../../utils/admin-auth';
import { queryPortfolio } from '../../utils/database';
import { readLimitedBody } from '../../utils/read-limited-body';

const maxUpload = 8 * 1024 * 1024;
const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const jpeg = Buffer.from([0xff, 0xd8, 0xff]);

function isSupported(file: Buffer) {
  return (
    file.subarray(0, 8).equals(png) ||
    file.subarray(0, 3).equals(jpeg) ||
    (file.toString('ascii', 0, 4) === 'RIFF' &&
      file.toString('ascii', 8, 12) === 'WEBP')
  );
}

export default defineEventHandler(async event => {
  await requireAdminWrite(event);

  if (Number(getHeader(event, 'content-length')) > maxUpload) {
    throw createError({ statusCode: 413, statusMessage: 'Image exceeds 8 MB' });
  }

  const file = await readLimitedBody(event.node.req, maxUpload);
  const invalidImage = {
    statusCode: 422,
    statusMessage: 'Choose a valid PNG, JPG or WebP image',
  };

  if (!isSupported(file)) {
    throw createError(invalidImage);
  }

  let output: { data: Buffer; info: OutputInfo };

  try {
    output = await sharp(file, { limitInputPixels: 25000000 })
      .autoOrient()
      .resize({
        width: 3200,
        height: 3200,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 95 })
      .toBuffer({ resolveWithObject: true });
  } catch {
    throw createError(invalidImage);
  }

  const id = randomUUID();
  const { width, height } = output.info;

  await queryPortfolio(
    event,
    'INSERT INTO portfolio.media (id, bytes, width, height) VALUES ($1, $2, $3, $4)',
    [id, output.data, width, height],
  );

  return { src: '/media/' + id, width, height };
});

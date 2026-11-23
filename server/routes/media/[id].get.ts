import { hasAdminSession } from '../../utils/admin-auth';
import { mediaIdSchema } from '../../utils/admin-validation';
import { queryPortfolio } from '../../utils/database';

export default defineEventHandler(async event => {
  const id = mediaIdSchema.safeParse(getRouterParam(event, 'id'));

  setResponseHeader(event, 'Cache-Control', 'private, no-store');

  if (!id.success) {
    throw createError({ statusCode: 404, statusMessage: 'Image not found' });
  }

  const path = '/media/' + id.data;
  const [visibility] = await queryPortfolio<{ visible: boolean }>(
    event,
    `SELECT EXISTS (
       SELECT 1 FROM portfolio.profile WHERE content->'portrait'->>'src' = $1
       UNION ALL
       SELECT 1 FROM portfolio.projects WHERE published AND (
         content->>'image' = $1 OR EXISTS (
           SELECT 1 FROM jsonb_array_elements(content->'gallery') AS image WHERE image->>'src' = $1
         )
       )
     ) AS visible`,
    [path],
  );

  if (!visibility?.visible && !(await hasAdminSession(event))) {
    throw createError({ statusCode: 404, statusMessage: 'Image not found' });
  }

  const [image] = await queryPortfolio<{ bytes: Buffer }>(
    event,
    'SELECT bytes FROM portfolio.media WHERE id = $1',
    [id.data],
  );

  if (!image) {
    throw createError({ statusCode: 404, statusMessage: 'Image not found' });
  }

  setResponseHeaders(event, {
    'Content-Type': 'image/webp',
    'X-Content-Type-Options': 'nosniff',
  });

  if (visibility?.visible) {
    if (
      handleCacheHeaders(event, {
        etag: `"${id.data}"`,
        cacheControls: ['no-cache'],
      })
    ) {
      return;
    }
  }

  return image.bytes;
});

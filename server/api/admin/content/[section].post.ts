import { requireAdminWrite } from '../../../utils/admin-auth';
import {
  listAdminContent,
  saveAdminContent,
} from '../../../utils/admin-content';
import { saveSchema, sectionSchema } from '../../../utils/admin-validation';
import { readLimitedBody } from '../../../utils/read-limited-body';

export default defineEventHandler(async event => {
  await requireAdminWrite(event);

  const section = sectionSchema.safeParse(getRouterParam(event, 'section'));

  if (!section.success) {
    throw createError({ statusCode: 404, statusMessage: 'Section not found' });
  }

  const bytes = await readLimitedBody(event.node.req, 512 * 1024);
  let body: unknown;

  try {
    body = JSON.parse(bytes.toString('utf8'));
  } catch {
    throw createError({ statusCode: 400, statusMessage: 'Invalid JSON' });
  }

  const input = saveSchema.safeParse(body);

  if (!input.success) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Check the entry key and position',
      data: {
        issues: input.error.issues.map(issue => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      },
    });
  }

  const entry = await saveAdminContent(event, section.data, input.data);

  return { entry, entries: await listAdminContent(event, section.data) };
});

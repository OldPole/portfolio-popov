import { requireAdmin } from '../../../utils/admin-auth';
import { listAdminContent } from '../../../utils/admin-content';
import { sectionSchema } from '../../../utils/admin-validation';

export default defineEventHandler(async event => {
  await requireAdmin(event);

  const section = sectionSchema.safeParse(getRouterParam(event, 'section'));

  if (!section.success) {
    throw createError({ statusCode: 404, statusMessage: 'Section not found' });
  }

  return listAdminContent(event, section.data);
});

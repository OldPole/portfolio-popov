import type { PreviewContent } from '#shared/types/admin';
import { requireAdmin } from '../../utils/admin-auth';
import { listAdminContent } from '../../utils/admin-content';
import { previewSchema } from '../../utils/admin-validation';
import {
  readPortfolioHome,
  readPortfolioProfile,
  readPortfolioProject,
} from '../../utils/portfolio';

export default defineEventHandler(async (event): Promise<PreviewContent> => {
  await requireAdmin(event);

  const target = previewSchema.safeParse(getQuery(event));

  if (!target.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid preview target',
    });
  }

  const { section, key } = target.data;
  const entries = await listAdminContent(event, section);

  if (!entries.some(entry => entry.key === key)) {
    throw createError({ statusCode: 404, statusMessage: 'Preview not found' });
  }

  const profile = await readPortfolioProfile(event, section === 'profile');

  if (section === 'projects') {
    const project = await readPortfolioProject(event, key, true);

    return { profile, project };
  }

  const home = await readPortfolioHome(event, target.data);

  return { profile, home };
});

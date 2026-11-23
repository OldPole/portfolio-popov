import { readPortfolioProject } from '../../../utils/portfolio';

export default defineEventHandler(async event => {
  const slug = getRouterParam(event, 'slug') ?? '';
  const project = await readPortfolioProject(event, slug);

  if (!project) {
    throw createError({ statusCode: 404, statusMessage: 'Project not found' });
  }

  return project;
});

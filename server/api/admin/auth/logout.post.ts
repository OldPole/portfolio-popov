import {
  clearAdminSession,
  requireAdminWrite,
} from '../../../utils/admin-auth';

export default defineEventHandler(async event => {
  await requireAdminWrite(event);
  await clearAdminSession(event);

  return { success: true };
});

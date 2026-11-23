import {
  adminLogin,
  adminOAuthConfig,
  hasAdminSession,
  privateResponse,
} from '../../../utils/admin-auth';

export default defineEventHandler(async event => {
  privateResponse(event);

  const config = adminOAuthConfig(event);
  const authenticated = config && (await hasAdminSession(event));

  return {
    signInUrl: config ? config.origin + '/api/admin/auth/github' : null,
    user: authenticated ? adminLogin : null,
  };
});

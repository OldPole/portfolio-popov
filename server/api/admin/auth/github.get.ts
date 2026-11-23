import { createHash } from 'node:crypto';
import {
  adminCookie,
  adminLogin,
  adminOAuthConfig,
  callbackPath,
  privateResponse,
  randomToken,
  stateCookie,
  verifierCookie,
} from '../../../utils/admin-auth';

export default defineEventHandler(event => {
  privateResponse(event);

  const config = adminOAuthConfig(event);

  if (!config) {
    return sendRedirect(event, '/ru/admin?auth=setup');
  }

  const state = randomToken();
  const verifier = randomToken();
  const options = adminCookie(config.secure, callbackPath, 600);
  const query = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.callback,
    login: adminLogin,
    scope: '',
    state,
    code_challenge: createHash('sha256').update(verifier).digest('base64url'),
    code_challenge_method: 'S256',
  });

  setCookie(event, stateCookie, state, options);
  setCookie(event, verifierCookie, verifier, options);

  return sendRedirect(
    event,
    'https://github.com/login/oauth/authorize?' + query,
  );
});

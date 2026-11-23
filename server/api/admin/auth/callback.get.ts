import {
  adminCookie,
  adminGitHubId,
  adminLogin,
  adminOAuthConfig,
  callbackPath,
  createAdminSession,
  privateResponse,
  stateCookie,
  verifierCookie,
} from '../../../utils/admin-auth';

export default defineEventHandler(async event => {
  privateResponse(event);

  const config = adminOAuthConfig(event);

  if (!config) {
    return sendRedirect(event, '/ru/admin?auth=setup');
  }

  const { code, state } = getQuery(event);
  const savedState = getCookie(event, stateCookie);
  const verifier = getCookie(event, verifierCookie);
  const options = adminCookie(config.secure, callbackPath);

  deleteCookie(event, stateCookie, options);
  deleteCookie(event, verifierCookie, options);

  if (
    typeof code !== 'string' ||
    !code ||
    !savedState ||
    state !== savedState ||
    !verifier
  ) {
    return sendRedirect(event, '/ru/admin?auth=cancelled');
  }

  let identity: { id: number; login: string };

  try {
    const token = await $fetch<{ access_token?: string }>(
      'https://github.com/login/oauth/access_token',
      {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: {
          client_id: config.clientId,
          client_secret: config.clientSecret,
          code,
          redirect_uri: config.callback,
          code_verifier: verifier,
        },
        retry: 0,
        timeout: 10000,
      },
    );

    if (!token.access_token) {
      return sendRedirect(event, '/ru/admin?auth=error');
    }

    identity = await $fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${token.access_token}`,
        Accept: 'application/vnd.github+json',
        'User-Agent': 'portfolio-popov',
      },
      retry: 0,
      timeout: 10000,
    });
  } catch {
    return sendRedirect(event, '/ru/admin?auth=error');
  }

  if (
    identity.id !== adminGitHubId ||
    identity.login?.toLowerCase() !== adminLogin.toLowerCase()
  ) {
    return sendRedirect(event, '/ru/admin?auth=forbidden');
  }

  await createAdminSession(event, config.secure);

  return sendRedirect(event, '/ru/admin');
});

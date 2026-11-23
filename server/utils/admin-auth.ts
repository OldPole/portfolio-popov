import { createHash, randomBytes } from 'node:crypto';
import type { H3Event } from 'h3';
import { queryPortfolio } from './database';

export const adminLogin = 'OldPole';

export const adminGitHubId = 96002630;

export const callbackPath = '/api/admin/auth/callback';

export const stateCookie = 'portfolio-admin-oauth-state';

export const verifierCookie = 'portfolio-admin-oauth-verifier';
const sessionCookie = 'portfolio-admin-session';
const sessionSeconds = 8 * 60 * 60;

export const randomToken = () => randomBytes(32).toString('base64url');
const hashToken = (value: string) =>
  createHash('sha256').update(value).digest('hex');

export function adminOAuthConfig(event: H3Event) {
  const { adminOrigin, githubClientId, githubClientSecret } =
    useRuntimeConfig(event);
  const origin = URL.parse(adminOrigin);

  if (!origin || !githubClientId || !githubClientSecret) {
    return;
  }

  const secure = origin.protocol === 'https:';
  const loopback = ['127.0.0.1', 'localhost', '[::1]'].includes(
    origin.hostname,
  );

  if (
    origin.origin !== adminOrigin ||
    (!secure && !(loopback && origin.protocol === 'http:'))
  ) {
    return;
  }

  return {
    origin: origin.origin,
    secure,
    callback: origin.origin + callbackPath,
    clientId: githubClientId,
    clientSecret: githubClientSecret,
  };
}

export const privateResponse = (event: H3Event) =>
  setResponseHeader(event, 'Cache-Control', 'private, no-store');

export function adminCookie(secure: boolean, path: string, maxAge?: number) {
  return { httpOnly: true, sameSite: 'lax' as const, secure, path, maxAge };
}

export async function hasAdminSession(event: H3Event) {
  const token = getCookie(event, sessionCookie);

  if (!adminOAuthConfig(event) || !token || !/^[\w-]{43}$/.test(token)) {
    return false;
  }

  const [session] = await queryPortfolio(
    event,
    'SELECT 1 FROM portfolio.admin_sessions WHERE token_hash = $1 AND expires_at > now()',
    [hashToken(token)],
  );

  return Boolean(session);
}

export async function requireAdmin(event: H3Event) {
  privateResponse(event);

  if (!(await hasAdminSession(event))) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Admin sign-in required',
    });
  }
}

export async function requireAdminWrite(event: H3Event) {
  await requireAdmin(event);
  const config = adminOAuthConfig(event);

  if (!config || getHeader(event, 'origin') !== config.origin) {
    throw createError({ statusCode: 403, statusMessage: 'Origin not allowed' });
  }
}

export async function createAdminSession(event: H3Event, secure: boolean) {
  const token = randomToken();

  await queryPortfolio(
    event,
    `WITH remove_expired AS (
       DELETE FROM portfolio.admin_sessions WHERE expires_at <= now()
     )
     INSERT INTO portfolio.admin_sessions (token_hash, expires_at)
     VALUES ($1, now() + make_interval(secs => $2))`,
    [hashToken(token), sessionSeconds],
  );

  setCookie(
    event,
    sessionCookie,
    token,
    adminCookie(secure, '/', sessionSeconds),
  );
}

export async function clearAdminSession(event: H3Event) {
  const token = getCookie(event, sessionCookie);

  if (token) {
    await queryPortfolio(
      event,
      'DELETE FROM portfolio.admin_sessions WHERE token_hash = $1',
      [hashToken(token)],
    );
  }

  deleteCookie(
    event,
    sessionCookie,
    adminCookie(Boolean(adminOAuthConfig(event)?.secure), '/'),
  );
}

import { z } from 'zod';

const schema = z
  .object({
    name: z.string().trim().min(2).max(100),
    email: z.email().max(254),
    message: z.string().trim().min(10).max(5000),
    website: z.string().max(300).optional().default(''),
  })
  .strict();

const attempts = new Map<string, { count: number; expires: number }>();
const WINDOW = 10 * 60 * 1000;

export default defineEventHandler(async event => {
  setResponseHeader(event, 'Cache-Control', 'no-store');

  const config = useRuntimeConfig(event);
  const contentType = getHeader(event, 'content-type') || '';

  if (!contentType.startsWith('application/json')) {
    throw createError({ statusCode: 415, statusMessage: 'JSON required' });
  }

  const origin = getHeader(event, 'origin');
  const allowedOrigin =
    config.contactAllowedOrigin || getRequestURL(event).origin;

  if (origin && origin !== allowedOrigin) {
    throw createError({ statusCode: 403, statusMessage: 'Origin not allowed' });
  }

  if (Number(getHeader(event, 'content-length') || 0) > 20_000) {
    throw createError({ statusCode: 413, statusMessage: 'Message too large' });
  }

  const now = Date.now();

  for (const [key, value] of attempts) {
    if (value.expires < now) {
      attempts.delete(key);
    }
  }

  const ip = getRequestIP(event) || 'unknown';
  const attempt = attempts.get(ip);

  if (attempt && attempt.count >= 5) {
    setResponseHeader(
      event,
      'Retry-After',
      Math.ceil((attempt.expires - now) / 1000),
    );

    throw createError({
      statusCode: 429,
      statusMessage: 'Please try again later',
    });
  }

  if (attempt) {
    attempt.count++;
  } else {
    if (attempts.size >= 10_000) {
      throw createError({
        statusCode: 429,
        statusMessage: 'Please try again later',
      });
    }

    attempts.set(ip, { count: 1, expires: now + WINDOW });
  }

  let body: unknown;

  try {
    body = await readBody(event);
  } catch {
    throw createError({ statusCode: 400, statusMessage: 'Invalid message' });
  }

  const result = schema.safeParse(body);

  if (!result.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid message' });
  }

  if (result.data.website) {
    return { success: true };
  }

  if (!config.resendApiKey || !config.contactFrom) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Contact delivery unavailable',
    });
  }

  const { name, email, message } = result.data;

  try {
    await $fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${config.resendApiKey}` },
      body: {
        from: config.contactFrom,
        to: [config.contactTo],
        reply_to: email,
        subject: `Portfolio enquiry from ${name.replace(/[\r\n]/g, ' ')}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      },
      timeout: 15_000,
      retry: 0,
    });
  } catch {
    throw createError({
      statusCode: 502,
      statusMessage: 'Unable to deliver message',
    });
  }

  return { success: true };
});

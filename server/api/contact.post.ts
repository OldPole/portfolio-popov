import { Buffer } from 'node:buffer';
import { z } from 'zod';

import {
  contactAttachmentMaxBytes,
  contactAttachmentMime,
} from '#shared/utils/contact-attachment';
import { readLimitedBody } from '../utils/read-limited-body';

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
const JSON_MAX_BYTES = 32 * 1024;
const MULTIPART_MAX_BYTES = contactAttachmentMaxBytes + 64 * 1024;

const fileSignatures = {
  'application/pdf': Buffer.from('%PDF-'),
  'image/png': Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  'image/jpeg': Buffer.from([0xff, 0xd8, 0xff]),
};

async function prepareAttachment(file?: File) {
  if (!file) {
    return;
  }

  if (file.size > contactAttachmentMaxBytes) {
    throw createError({
      statusCode: 413,
      statusMessage: 'Attachment too large',
    });
  }

  const mime = contactAttachmentMime(file.name);
  const content = Buffer.from(await file.arrayBuffer());
  const signature = mime ? fileSignatures[mime] : undefined;

  if (!signature || !content.subarray(0, signature.length).equals(signature)) {
    throw createError({ statusCode: 422, statusMessage: 'Invalid attachment' });
  }

  return {
    filename: file.name.replace(/[\r\n\\/]/g, '_').slice(-120),
    content: content.toString('base64'),
  };
}

export default defineEventHandler(async event => {
  setResponseHeader(event, 'Cache-Control', 'no-store');

  const config = useRuntimeConfig(event);
  const contentType = getHeader(event, 'content-type') || '';
  const mediaType = contentType.split(';', 1)[0]?.trim().toLowerCase();
  const multipart = mediaType === 'multipart/form-data';
  const bodyLimit = multipart ? MULTIPART_MAX_BYTES : JSON_MAX_BYTES;

  if (!multipart && mediaType !== 'application/json') {
    throw createError({
      statusCode: 415,
      statusMessage: 'Unsupported content type',
    });
  }

  const origin = getHeader(event, 'origin');
  const allowedOrigin =
    config.contactAllowedOrigin || getRequestURL(event).origin;

  if (origin && origin !== allowedOrigin) {
    throw createError({ statusCode: 403, statusMessage: 'Origin not allowed' });
  }

  if (Number(getHeader(event, 'content-length') || 0) > bodyLimit) {
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

  const payload = await readLimitedBody(
    event.node.req,
    bodyLimit,
    'Message too large',
  );
  let body: unknown;
  let file: File | undefined;

  try {
    if (multipart) {
      const response = new Response(payload, {
        headers: { 'Content-Type': contentType },
      });
      const parts = await response.formData();
      const keys = [...parts.keys()];
      const attachment = parts.get('attachment');

      if (
        keys.length !== new Set(keys).size ||
        typeof attachment === 'string'
      ) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Invalid message',
        });
      }

      file = attachment ?? undefined;
      parts.delete('attachment');
      body = Object.fromEntries(parts);
    } else {
      body = JSON.parse(payload.toString('utf8'));
    }
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

  const attachment = await prepareAttachment(file);

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
        ...(attachment ? { attachments: [attachment] } : {}),
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

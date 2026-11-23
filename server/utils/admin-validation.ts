import { z } from 'zod';
import { adminSections } from '#shared/types/admin';

export const sectionSchema = z.enum(adminSections);

export const keySchema = z
  .string()
  .max(100)
  .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/);

export const mediaIdSchema = z.uuid();

export const saveSchema = z.object({
  action: z.enum(['draft', 'publish', 'unpublish']),
  key: keySchema,
  revision: z.number().int().nonnegative().nullable(),
  position: z.number().int().min(0).max(1000000),
  content: z.unknown().optional(),
});

export const previewSchema = z.object({
  section: sectionSchema,
  key: keySchema,
});

const localized = <T extends z.ZodType>(field: T) =>
  z.object({ en: field, ru: field });
const dimensions = z.number().int().min(1).max(15000);
const optionalText = (max: number) => z.string().trim().max(max);
const imagePath =
  /^(?:\/images\/[\w/-]+\.(?:webp|png|jpe?g)|\/media\/[a-f0-9-]{36})$/i;
const cvPath = /^\/cv\/[\w-]+\.pdf$/i;
const httpUrl = z.url({ protocol: /^https?$/ });

function contentSchemas(publishing: boolean) {
  const text = (max = 250) => optionalText(max).min(publishing ? 1 : 0);
  const long = () => text(8000);
  const list = (item: z.ZodString) =>
    z.preprocess(
      value =>
        Array.isArray(value)
          ? value.filter(entry => typeof entry !== 'string' || entry.trim())
          : value,
      z.array(item).max(40),
    );
  const paragraphs = localized(list(long()));
  const url = optionalText(2000).refine(
    value => (!publishing && !value) || httpUrl.safeParse(value).success,
    'Enter an HTTP or HTTPS URL',
  );
  const imageSource = optionalText(300).refine(
    value => (!publishing && !value) || imagePath.test(value),
    'Select an uploaded image or enter a path under /images/',
  );
  const image = z.object({
    src: imageSource,
    width: dimensions,
    height: dimensions,
    caption: localized(text()),
  });

  return {
    profile: z.object({
      name: localized(text()),
      role: localized(text()),
      description: localized(long()),
      location: localized(text()),
      wordmark: text(),
      email: text().refine(
        value => (!publishing && !value) || z.email().safeParse(value).success,
        'Enter a valid email',
      ),
      github: url,
      linkedin: url,
      telegram: url,
      telegramHandle: text(),
      cv: text().refine(
        value =>
          (!publishing && !value) ||
          cvPath.test(value) ||
          httpUrl.safeParse(value).success,
        'Enter a PDF path under /cv/ or an HTTP or HTTPS URL',
      ),
      portrait: image,
      seo: localized(z.object({ title: text(), description: text(500) })),
    }),
    experience: z.object({
      company: text(),
      initial: text(8),
      className: optionalText(40)
        .regex(/^[a-z0-9-]*$/)
        .optional(),
      location: localized(text()),
      role: localized(text()),
      period: localized(text()),
      description: localized(long()),
      points: paragraphs,
      tags: list(text(120)),
    }),
    skills: z.object({ label: localized(text()), items: list(text(120)) }),
    education: z.object({
      school: localized(text()),
      degree: localized(text()),
      period: localized(text()),
      grade: localized(optionalText(250)),
    }),
    languages: z.object({ name: localized(text()), level: localized(text()) }),
    projects: z.object({
      name: text(),
      year: text(32),
      category: localized(text()),
      description: localized(long()),
      overview: paragraphs,
      contribution: localized(long()),
      highlights: paragraphs,
      implementation: localized(
        z.array(z.object({ title: text(), body: long() })).max(30),
      ),
      stack: list(text(120)),
      repository: url,
      demo: optionalText(2000)
        .refine(
          value => !value || httpUrl.safeParse(value).success,
          'Enter an HTTP or HTTPS URL',
        )
        .optional(),
      image: imageSource,
      imageWidth: dimensions,
      imageHeight: dimensions,
      imageCaption: localized(text()),
      gallery: z
        .array(image)
        .max(35)
        .refine(
          items => new Set(items.map(item => item.src)).size === items.length,
          'Each gallery image needs a unique path',
        ),
      accent: z.string().regex(/^#[a-f0-9]{6}$/i),
    }),
  };
}

const draftSchemas = contentSchemas(false);
const publishSchemas = contentSchemas(true);

export function validateAdminContent(
  section: z.infer<typeof sectionSchema>,
  content: unknown,
  publishing: boolean,
) {
  const result = (publishing ? publishSchemas : draftSchemas)[
    section
  ].safeParse(content);

  if (!result.success) {
    throw createError({
      statusCode: 422,
      statusMessage: 'Check the content fields',
      data: {
        issues: result.error.issues.map(issue => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      },
    });
  }

  return result.data;
}

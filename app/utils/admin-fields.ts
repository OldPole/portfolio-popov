import type {
  AdminEntry,
  AdminSection,
  ContentObject,
  ContentValue,
} from '#shared/types/admin';
import type { Locale } from '#shared/types/portfolio';

export type EditorField = {
  path: string;
  label: string;
  kind?: 'textarea' | 'lines' | 'color' | 'email';
};

export const sectionLabels: Record<AdminSection, string> = {
  profile: 'Профиль',
  experience: 'Опыт',
  skills: 'Навыки',
  education: 'Образование',
  languages: 'Языки',
  projects: 'Проекты',
};

export const editorFields: Record<AdminSection, EditorField[]> = {
  profile: [
    { path: 'wordmark', label: 'Имя в шапке и футере' },
    { path: 'email', label: 'Публичный email', kind: 'email' },
    { path: 'github', label: 'GitHub' },
    { path: 'linkedin', label: 'LinkedIn' },
    { path: 'telegram', label: 'Ссылка на Telegram' },
    { path: 'telegramHandle', label: 'Юзернейм Telegram' },
    { path: 'cv', label: 'Ссылка на CV' },
    { path: 'name.$', label: 'Имя' },
    { path: 'role.$', label: 'Роль' },
    { path: 'location.$', label: 'Местоположение' },
    { path: 'description.$', label: 'О себе', kind: 'textarea' },
    { path: 'portrait.caption.$', label: 'Описание портрета для скринридера' },
    { path: 'seo.$.title', label: 'Заголовок страницы (SEO)' },
    {
      path: 'seo.$.description',
      label: 'Описание страницы (SEO)',
      kind: 'textarea',
    },
  ],
  experience: [
    { path: 'company', label: 'Компания' },
    { path: 'initial', label: 'Буквы на значке компании' },
    { path: 'tags', label: 'Технологии', kind: 'lines' },
    { path: 'location.$', label: 'Город' },
    { path: 'role.$', label: 'Должность' },
    { path: 'period.$', label: 'Период' },
    { path: 'description.$', label: 'Описание', kind: 'textarea' },
    { path: 'points.$', label: 'Задачи и достижения', kind: 'lines' },
  ],
  skills: [
    { path: 'items', label: 'Технологии', kind: 'lines' },
    { path: 'label.$', label: 'Название группы' },
  ],
  education: [
    { path: 'school.$', label: 'Учебное заведение' },
    { path: 'degree.$', label: 'Степень и специальность' },
    { path: 'period.$', label: 'Период' },
    { path: 'grade.$', label: 'Средний балл' },
  ],
  languages: [
    { path: 'name.$', label: 'Язык' },
    { path: 'level.$', label: 'Уровень' },
  ],
  projects: [
    { path: 'name', label: 'Название проекта' },
    { path: 'year', label: 'Год' },
    { path: 'repository', label: 'Ссылка на репозиторий' },
    { path: 'demo', label: 'Ссылка на демо (необязательно)' },
    { path: 'stack', label: 'Технологии', kind: 'lines' },
    { path: 'accent', label: 'Цвет обложки', kind: 'color' },
    { path: 'category.$', label: 'Категория' },
    { path: 'description.$', label: 'Краткое описание', kind: 'textarea' },
    { path: 'overview.$', label: 'Обзор проекта', kind: 'lines' },
    { path: 'contribution.$', label: 'Мой вклад', kind: 'textarea' },
    { path: 'highlights.$', label: 'Возможности проекта', kind: 'lines' },
    { path: 'imageCaption.$', label: 'Подпись к обложке' },
  ],
};

export function isContentObject(
  value: ContentValue | undefined,
): value is ContentObject {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

export function readField(source: ContentObject, path: string) {
  let value: ContentValue | undefined = source;

  for (const part of path.split('.')) {
    value = isContentObject(value) ? value[part] : undefined;
  }

  return value;
}

export function writeField(
  source: ContentObject,
  path: string,
  value: ContentValue,
) {
  const parts = path.split('.');
  const last = parts.pop()!;
  let parent = source;

  for (const part of parts) {
    const child = parent[part];
    const next = isContentObject(child) ? child : {};

    parent[part] = next;
    parent = next;
  }

  parent[last] = value;
}

export const fieldPath = (field: EditorField, locale: Locale) =>
  field.path.replace('$', locale);

export function createContent(section: AdminSection) {
  const content: ContentObject = {};

  for (const field of editorFields[section]) {
    const value = field.kind === 'lines' ? [] : '';

    writeField(content, fieldPath(field, 'en'), value);
    writeField(content, fieldPath(field, 'ru'), value);
  }

  if (section === 'projects') {
    Object.assign(content, {
      image: '',
      imageWidth: 1,
      imageHeight: 1,
      gallery: [],
      implementation: { en: [], ru: [] },
      accent: '#e9d9fb',
    });
  }

  return content;
}

const titlePaths: Record<AdminSection, string> = {
  profile: 'name.ru',
  experience: 'company',
  skills: 'label.ru',
  education: 'school.ru',
  languages: 'name.ru',
  projects: 'name',
};

export function entryTitle(section: AdminSection, entry: AdminEntry) {
  const path = titlePaths[section];

  return String(
    readField(entry.content, path) ||
      readField(entry.content, path.replace('.ru', '.en')) ||
      entry.key,
  );
}

export function entryStatus(entry: AdminEntry) {
  if (entry.published) {
    return entry.hasDraft ? 'Опубликовано · есть черновик' : 'Опубликовано';
  }

  return entry.hasDraft ? 'Черновик' : 'Снято с публикации';
}

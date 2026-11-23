<script setup lang="ts">
import { ChevronDown, ChevronUp, Plus, X } from '@lucide/vue';
import type { AdminSection, ContentObject } from '#shared/types/admin';
import type { Locale } from '#shared/types/portfolio';
import {
  editorFields,
  fieldPath,
  isContentObject,
  readField,
  writeField,
} from '~/utils/admin-fields';

const props = defineProps<{ section: AdminSection; disabled: boolean }>();
const content = defineModel<ContentObject>({ required: true });
const emit = defineEmits<{ uploadBusy: [boolean] }>();
const language = ref<Locale>('ru');
const languagePanel = useId();
const commonFields = computed(() =>
  editorFields[props.section].filter(field => !field.path.includes('$')),
);
const translatedFields = computed(() =>
  editorFields[props.section].filter(field => field.path.includes('$')),
);

function entries(path: string) {
  const items = readField(content.value, path);

  return Array.isArray(items) ? items.filter(isContentObject) : [];
}

const implementationPath = computed(() => 'implementation.' + language.value);
const implementation = computed(() => entries(implementationPath.value));
const gallery = computed(() => entries('gallery'));

function replaceCover(image: { src: string; width: number; height: number }) {
  if (props.section === 'profile') {
    writeField(content.value, 'portrait.src', image.src);
    writeField(content.value, 'portrait.width', image.width);
    writeField(content.value, 'portrait.height', image.height);
  } else {
    Object.assign(content.value, {
      image: image.src,
      imageWidth: image.width,
      imageHeight: image.height,
    });
  }
}

function addScreenshot(image: { src: string; width: number; height: number }) {
  writeField(content.value, 'gallery', [
    ...gallery.value,
    {
      ...image,
      caption: { en: '', ru: '' },
    },
  ]);
}

function moveScreenshot(index: number, direction: -1 | 1) {
  const images = [...gallery.value];
  const next = index + direction;
  const image = images[index];

  if (!image || next < 0 || next >= images.length) {
    return;
  }

  images.splice(index, 1);
  images.splice(next, 0, image);
  writeField(content.value, 'gallery', images);
}

function removeEntry(path: string, list: ContentObject[], index: number) {
  writeField(
    content.value,
    path,
    list.filter((_, current) => current !== index),
  );
}
</script>

<template>
  <template v-if="commonFields.length">
    <h3>Общие поля</h3>
    <div class="admin-fields">
      <AdminField
        v-for="field in commonFields"
        :key="field.path"
        :field="field"
        :value="readField(content, field.path)"
        @update="writeField(content, field.path, $event)"
      />
    </div>
  </template>

  <div
    v-if="section === 'profile' || section === 'projects'"
    class="admin-editor-group"
  >
    <h3>{{ section === 'profile' ? 'Портрет' : 'Обложка проекта' }}</h3>
    <AdminImageUpload
      :src="
        String(
          readField(
            content,
            section === 'profile' ? 'portrait.src' : 'image',
          ) || '',
        )
      "
      :label="section === 'profile' ? 'Загрузить портрет' : 'Загрузить обложку'"
      :disabled="disabled"
      @uploaded="replaceCover"
      @busy="emit('uploadBusy', $event)"
    />
  </div>

  <div class="admin-editor-group">
    <div class="admin-row">
      <h3>Текст</h3>
      <div
        class="admin-segmented"
        role="group"
        aria-label="Язык редактирования"
      >
        <UiButton
          v-for="locale in ['ru', 'en'] as const"
          :key="locale"
          :variant="language === locale ? 'primary' : 'ghost'"
          :aria-pressed="language === locale"
          :aria-controls="languagePanel"
          size="small"
          @click="language = locale"
        >
          {{ locale.toUpperCase() }}
        </UiButton>
      </div>
    </div>

    <div :id="languagePanel" class="admin-fields">
      <AdminField
        v-for="field in translatedFields"
        :key="fieldPath(field, language)"
        :field="field"
        :value="readField(content, fieldPath(field, language))"
        @update="writeField(content, fieldPath(field, language), $event)"
      />
    </div>
  </div>

  <div v-if="section === 'projects'" class="admin-editor-group">
    <div class="admin-row">
      <h3>Технические решения · {{ language.toUpperCase() }}</h3>
      <UiButton
        variant="outline"
        size="small"
        @click="
          writeField(content, implementationPath, [
            ...implementation,
            { title: '', body: '' },
          ])
        "
      >
        <Plus :size="16" aria-hidden="true" />
        Добавить решение
      </UiButton>
    </div>
    <div
      v-for="(solution, index) in implementation"
      :key="index"
      class="admin-subcard"
    >
      <div class="admin-row">
        <strong>Решение {{ index + 1 }}</strong>
        <UiButton
          variant="ghost"
          size="small"
          @click="removeEntry(implementationPath, implementation, index)"
        >
          <X :size="16" aria-hidden="true" />
          Убрать
        </UiButton>
      </div>
      <div class="admin-fields">
        <AdminField
          :field="{ label: 'Заголовок', path: 'title' }"
          :value="solution.title"
          @update="writeField(solution, 'title', $event)"
        />
        <AdminField
          :field="{ label: 'Описание', path: 'body', kind: 'textarea' }"
          :value="solution.body"
          @update="writeField(solution, 'body', $event)"
        />
      </div>
    </div>
  </div>

  <div v-if="section === 'projects'" class="admin-editor-group">
    <h3>Галерея</h3>
    <div
      v-for="(image, index) in gallery"
      :key="String(image.src)"
      class="admin-subcard"
    >
      <div class="admin-row">
        <strong>Скриншот {{ index + 1 }}</strong>
        <div class="admin-actions">
          <UiButton
            variant="ghost"
            size="icon"
            :disabled="index === 0"
            :aria-label="`Поднять скриншот ${index + 1}`"
            @click="moveScreenshot(index, -1)"
          >
            <ChevronUp :size="18" aria-hidden="true" />
          </UiButton>
          <UiButton
            variant="ghost"
            size="icon"
            :disabled="index === gallery.length - 1"
            :aria-label="`Опустить скриншот ${index + 1}`"
            @click="moveScreenshot(index, 1)"
          >
            <ChevronDown :size="18" aria-hidden="true" />
          </UiButton>
          <UiButton
            variant="ghost"
            size="small"
            @click="removeEntry('gallery', gallery, index)"
          >
            <X :size="16" aria-hidden="true" />
            Убрать
          </UiButton>
        </div>
      </div>
      <img
        :src="String(image.src)"
        alt=""
        class="admin-gallery-image"
        loading="lazy"
      />
      <div class="admin-fields">
        <AdminField
          v-for="locale in ['ru', 'en'] as const"
          :key="locale"
          :field="{
            label: 'Подпись · ' + locale.toUpperCase(),
            path: 'caption.' + locale,
          }"
          :value="readField(image, 'caption.' + locale)"
          @update="writeField(image, 'caption.' + locale, $event)"
        />
      </div>
    </div>
    <AdminImageUpload
      label="Добавить скриншот"
      :disabled="disabled || gallery.length >= 35"
      @uploaded="addScreenshot"
      @busy="emit('uploadBusy', $event)"
    />
  </div>
</template>

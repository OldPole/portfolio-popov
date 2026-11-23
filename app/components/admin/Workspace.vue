<script setup lang="ts">
import {
  ArrowUpRight,
  BriefcaseBusiness,
  FolderOpen,
  GraduationCap,
  Languages,
  Layers3,
  LogOut,
  Plus,
  UserRound,
} from '@lucide/vue';
import { adminSections } from '#shared/types/admin';
import type {
  AdminEntry,
  AdminSection,
  ContentObject,
  SaveAction,
} from '#shared/types/admin';
import {
  createContent,
  editorFields,
  entryStatus,
  entryTitle,
  sectionLabels,
} from '~/utils/admin-fields';

defineProps<{ user: string }>();
const emit = defineEmits<{ logout: [] }>();

const icons = {
  profile: UserRound,
  experience: BriefcaseBusiness,
  skills: Layers3,
  education: GraduationCap,
  languages: Languages,
  projects: FolderOpen,
};
const section = ref<AdminSection>('profile');
const entries = ref<AdminEntry[]>([]);
const { data: initial, error: initialError } = await useFetch(
  '/api/admin/content/profile',
);
const draft = ref<{
  key: string;
  position: number;
  content: ContentObject;
  revision: number | null;
}>();
const pending = ref(false);
const uploading = ref(false);
const error = ref(initialError.value ? 'Не удалось загрузить профиль.' : '');
const notice = ref('');
const snapshot = ref('');

const current = computed(() => {
  const form = draft.value;

  return form && form.revision !== null
    ? entries.value.find(entry => entry.key === form.key)
    : undefined;
});
const dirty = computed(() =>
  Boolean(draft.value && JSON.stringify(draft.value) !== snapshot.value),
);
const busy = computed(() => pending.value || uploading.value);

function selectEntry(entry?: AdminEntry) {
  draft.value = entry
    ? {
        key: entry.key,
        position: entry.position,
        content: JSON.parse(JSON.stringify(entry.content)),
        revision: entry.revision,
      }
    : undefined;
  snapshot.value = draft.value ? JSON.stringify(draft.value) : '';
}

function confirmLeave() {
  return !dirty.value || window.confirm('Уйти без сохранения изменений?');
}

function openEntry(entry: AdminEntry) {
  if (current.value?.key === entry.key || !confirmLeave()) {
    return;
  }

  error.value = '';
  notice.value = '';
  selectEntry(entry);
}

function createEntry() {
  if (!confirmLeave()) {
    return;
  }

  error.value = '';
  notice.value = '';
  draft.value = {
    key: '',
    position: Math.min(
      1000000,
      Math.max(0, ...entries.value.map(item => item.position)) + 10,
    ),
    content: createContent(section.value),
    revision: null,
  };
  snapshot.value = JSON.stringify(draft.value);
}

async function loadSection(next: AdminSection, reload = false) {
  if ((!reload && next === section.value) || !confirmLeave()) {
    return;
  }

  pending.value = true;
  error.value = '';
  notice.value = '';

  try {
    const list = await $fetch(`/api/admin/content/${next}`);
    const selectedKey = draft.value?.key;

    section.value = next;
    entries.value = list;
    selectEntry(
      list.find(entry => reload && entry.key === selectedKey) || list[0],
    );
  } catch {
    error.value = 'Не удалось загрузить раздел. Попробуй ещё раз.';
  } finally {
    pending.value = false;
  }
}

function explainError(cause: unknown) {
  const response = cause as {
    statusCode?: number;
    data?: { data?: { issues?: { path: string; message: string }[] } };
  };

  if (response.statusCode === 409) {
    return 'Адрес уже занят или запись изменилась. Укажи другой адрес или обнови список.';
  }

  if (response.statusCode === 401) {
    return 'Сессия закончилась. Войди снова в отдельной вкладке, чтобы сохранить эту запись.';
  }

  const issues = response.data?.data?.issues;

  if (issues?.length) {
    const fields = editorFields[section.value];
    const names = issues.slice(0, 6).map(issue => {
      const path = issue.path.replace(/\.(en|ru)(?=\.|$)/, () => '.$');
      const field = fields.find(field => field.path === path);
      const language = issue.path.match(/\.(en|ru)(\.|$)/)?.[1];

      return field
        ? field.label + (language ? ` (${language.toUpperCase()})` : '')
        : issue.path;
    });

    return 'Проверь поля: ' + names.join(', ') + '.';
  }

  return 'Не удалось сохранить запись. Попробуй ещё раз.';
}

async function save(action: SaveAction) {
  const form = draft.value;

  if (!form || busy.value) {
    return;
  }

  if (action === 'unpublish' && !window.confirm('Снять запись с публикации?')) {
    return;
  }

  pending.value = true;
  error.value = '';
  notice.value = '';

  try {
    const result = await $fetch(`/api/admin/content/${section.value}`, {
      method: 'POST',
      body: { ...form, key: form.key.trim().toLowerCase(), action },
    });

    entries.value = result.entries;

    if (action === 'unpublish' && dirty.value) {
      form.revision = result.entry.revision;
      snapshot.value = JSON.stringify({
        key: result.entry.key,
        position: result.entry.position,
        content: result.entry.content,
        revision: result.entry.revision,
      });
    } else {
      selectEntry(result.entry);
    }

    notice.value = {
      draft: 'Черновик сохранён.',
      publish: 'Изменения опубликованы.',
      unpublish: 'Запись скрыта с сайта.',
    }[action];
  } catch (cause) {
    error.value = explainError(cause);
  } finally {
    pending.value = false;
  }
}

function beforeUnload(event: BeforeUnloadEvent) {
  if (dirty.value) {
    event.preventDefault();
    event.returnValue = '';
  }
}

function logout() {
  if (confirmLeave()) {
    emit('logout');
  }
}

onMounted(() => window.addEventListener('beforeunload', beforeUnload));
onBeforeUnmount(() => window.removeEventListener('beforeunload', beforeUnload));

entries.value = initial.value || [];
selectEntry(entries.value[0]);
</script>

<template>
  <div class="admin-shell">
    <header class="admin-topbar">
      <strong>
        Кирилл Попов
        <span>/</span>
        Админка
      </strong>
      <div class="admin-actions">
        <UiButton href="/en" variant="ghost" size="small">
          Сайт
          <ArrowUpRight :size="15" aria-hidden="true" />
        </UiButton>
        <UiButton
          variant="outline"
          size="small"
          :disabled="busy"
          :title="user"
          @click="logout"
        >
          <LogOut :size="16" aria-hidden="true" />
          Выйти
        </UiButton>
      </div>
    </header>

    <div class="admin-layout">
      <aside>
        <nav class="admin-navigation" aria-label="Разделы админки">
          <UiButton
            v-for="item in adminSections"
            :key="item"
            :variant="section === item ? 'primary' : 'ghost'"
            :aria-current="section === item ? 'page' : undefined"
            :disabled="busy"
            @click="loadSection(item)"
          >
            <component :is="icons[item]" :size="19" aria-hidden="true" />
            {{ sectionLabels[item] }}
          </UiButton>
        </nav>
      </aside>

      <main class="admin-main">
        <div class="admin-row admin-section-title">
          <h1>{{ sectionLabels[section] }}</h1>
          <div class="admin-actions">
            <UiButton
              variant="ghost"
              size="small"
              :disabled="busy"
              @click="loadSection(section, true)"
            >
              Обновить
            </UiButton>
            <UiButton
              v-if="section !== 'profile'"
              size="small"
              :disabled="busy"
              @click="createEntry"
            >
              <Plus :size="16" aria-hidden="true" />
              Добавить
            </UiButton>
          </div>
        </div>

        <div v-if="section !== 'profile'" class="admin-list">
          <button
            v-for="entry in entries"
            :key="entry.key"
            type="button"
            :disabled="busy"
            :aria-pressed="current?.key === entry.key"
            @click="openEntry(entry)"
          >
            <span>{{ entryTitle(section, entry) }}</span>
            <small>{{ entryStatus(entry) }} · {{ entry.position }}</small>
          </button>
          <p v-if="!entries.length">В этом разделе пока нет записей.</p>
        </div>

        <p v-if="error" class="admin-error admin-notice" role="alert">
          {{ error }}
        </p>

        <form v-if="draft" class="admin-panel" @submit.prevent>
          <div class="admin-row admin-editor-heading">
            <div>
              <h2>
                {{ current ? entryTitle(section, current) : 'Новая запись' }}
              </h2>
              <p v-if="current">{{ entryStatus(current) }}</p>
            </div>
            <div v-if="current" class="admin-actions" aria-label="Предпросмотр">
              <UiButton
                v-for="locale in ['ru', 'en']"
                :key="locale"
                :href="`/${locale}/admin/preview?section=${section}&key=${current.key}`"
                variant="outline"
                size="small"
                target="_blank"
                rel="noopener noreferrer"
              >
                Предпросмотр {{ locale.toUpperCase() }}
                <ArrowUpRight :size="15" aria-hidden="true" />
              </UiButton>
            </div>
          </div>
          <p v-if="dirty && current" class="admin-hint">
            В предпросмотре видна сохранённая версия.
          </p>

          <fieldset :disabled="busy" class="admin-fieldset">
            <div
              v-if="section !== 'profile'"
              class="admin-fields admin-entry-fields"
            >
              <label class="admin-field">
                {{
                  section === 'projects'
                    ? 'Адрес проекта (slug)'
                    : 'Ключ записи'
                }}
                <input
                  v-model="draft.key"
                  :readonly="draft.revision !== null"
                  placeholder="new-entry"
                  maxlength="100"
                />
                <small v-if="draft.revision === null">
                  Латиница, цифры и дефис.
                </small>
              </label>
              <label class="admin-field">
                Позиция
                <input
                  v-model.number="draft.position"
                  type="number"
                  min="0"
                  max="1000000"
                />
                <small>Меньшее число поднимает запись выше.</small>
              </label>
            </div>
            <AdminEditor
              :key="section + ':' + (current?.key || 'new')"
              v-model="draft.content"
              :section="section"
              :disabled="busy"
              @upload-busy="uploading = $event"
            />
          </fieldset>

          <div class="admin-editor-actions">
            <p class="admin-hint" role="status">
              {{ notice || (dirty ? 'Есть несохранённые изменения' : '') }}
            </p>
            <div class="admin-actions">
              <UiButton
                v-if="current?.published && section !== 'profile'"
                variant="ghost"
                size="small"
                :disabled="busy"
                @click="save('unpublish')"
              >
                Снять с публикации
              </UiButton>
              <UiButton
                variant="outline"
                size="small"
                :disabled="busy"
                @click="save('draft')"
              >
                Сохранить черновик
              </UiButton>
              <UiButton size="small" :disabled="busy" @click="save('publish')">
                Опубликовать
              </UiButton>
            </div>
          </div>
        </form>
      </main>
    </div>
  </div>
</template>

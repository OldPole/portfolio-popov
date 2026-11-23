<script setup lang="ts">
import { ImagePlus } from '@lucide/vue';

const props = defineProps<{
  src?: string;
  label: string;
  disabled?: boolean;
}>();
const emit = defineEmits<{
  uploaded: [image: { src: string; width: number; height: number }];
  busy: [busy: boolean];
}>();

const input = useTemplateRef<HTMLInputElement>('file');
const pending = ref(false);
const error = ref('');

async function upload(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  target.value = '';

  if (!file || props.disabled) {
    return;
  }

  error.value = '';

  if (file.size > 8 * 1024 * 1024) {
    error.value = 'Выбери файл размером до 8 МБ.';

    return;
  }

  pending.value = true;
  emit('busy', true);

  try {
    const image = await $fetch('/api/admin/media', {
      method: 'POST',
      body: file,
    });

    emit('uploaded', image);
  } catch {
    error.value = 'Не удалось загрузить. Проверь файл и подключение.';
  } finally {
    pending.value = false;
    emit('busy', false);
  }
}
</script>

<template>
  <div class="admin-image-field">
    <img v-if="src" :src="src" alt="" loading="lazy" />
    <div>
      <input
        ref="file"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        hidden
        :disabled="disabled || pending"
        @change="upload"
      />
      <UiButton
        variant="outline"
        size="small"
        :disabled="disabled || pending"
        @click="input?.click()"
      >
        <ImagePlus :size="16" aria-hidden="true" />
        {{ pending ? 'Загрузка…' : label }}
      </UiButton>
      <p v-if="error" class="admin-error" role="alert">{{ error }}</p>
    </div>
  </div>
</template>

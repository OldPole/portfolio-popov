<script setup lang="ts">
import type { ContentValue } from '#shared/types/admin';
import type { EditorField } from '~/utils/admin-fields';

const props = defineProps<{ field: EditorField; value?: ContentValue }>();
const emit = defineEmits<{ update: [ContentValue] }>();
const id = useId();
const multiline = computed(
  () => props.field.kind === 'textarea' || props.field.kind === 'lines',
);

// Keep blank lines while the user is typing. The server receives an array of entries.
const displayValue = computed(() =>
  Array.isArray(props.value)
    ? props.value.join('\n')
    : String(props.value ?? ''),
);

function update(event: Event) {
  const value = (event.target as HTMLInputElement | HTMLTextAreaElement).value;

  emit('update', props.field.kind === 'lines' ? value.split('\n') : value);
}
</script>

<template>
  <div class="admin-field" :class="{ 'admin-field-wide': multiline }">
    <label :for="id">{{ field.label }}</label>
    <textarea
      v-if="multiline"
      :id="id"
      :value="displayValue"
      :rows="field.kind === 'lines' ? 5 : 4"
      :aria-describedby="field.kind === 'lines' ? id + '-hint' : undefined"
      @input="update"
    />
    <input
      v-else
      :id="id"
      :type="field.kind || 'text'"
      :value="displayValue"
      @input="update"
    />
    <small v-if="field.kind === 'lines'" :id="id + '-hint'">
      Один пункт на строку.
    </small>
  </div>
</template>

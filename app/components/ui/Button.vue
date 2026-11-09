<script setup lang="ts">
defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    to?: string;
    href?: string;
    variant?: 'primary' | 'outline' | 'ghost' | 'text';
    size?: 'default' | 'small' | 'icon';
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
  }>(),
  {
    to: undefined,
    href: undefined,
    variant: 'primary',
    size: 'default',
    type: 'button',
    disabled: false,
  },
);

const classes = computed(() => [
  'button',
  `button-${props.variant}`,
  `button-${props.size}`,
]);
</script>

<template>
  <NuxtLink v-if="to" :to="to" :class="classes" v-bind="$attrs">
    <slot />
  </NuxtLink>
  <a v-else-if="href" :href="href" :class="classes" v-bind="$attrs">
    <slot />
  </a>
  <button
    v-else
    :type="type"
    :disabled="disabled"
    :class="classes"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>

export function useContactForm() {
  const { t } = useI18n();

  const form = reactive({ name: '', email: '', message: '', website: '' });
  const pending = ref(false);
  const status = ref<'idle' | 'success' | 'error'>('idle');
  const feedbackKey = ref('');

  const feedback = computed(() =>
    feedbackKey.value ? t(feedbackKey.value) : '',
  );

  async function submit() {
    if (pending.value) {
      return;
    }

    status.value = 'idle';
    feedbackKey.value = '';
    pending.value = true;

    try {
      await $fetch('/api/contact', { method: 'POST', body: { ...form } });

      status.value = 'success';
      feedbackKey.value = 'contact.success';

      Object.assign(form, { name: '', email: '', message: '', website: '' });
    } catch (error: unknown) {
      const code = (error as { statusCode?: number }).statusCode;

      status.value = 'error';
      feedbackKey.value =
        code === 503
          ? 'contact.unavailable'
          : code === 429
            ? 'contact.rateLimit'
            : code === 400
              ? 'contact.invalid'
              : 'contact.error';
    } finally {
      pending.value = false;
    }
  }

  return { form, pending, status, feedback, submit };
}

import {
  contactAttachmentMaxBytes,
  contactAttachmentMime,
} from '#shared/utils/contact-attachment';

export function useContactForm() {
  const { t } = useI18n();

  const form = reactive({ name: '', email: '', message: '', website: '' });
  const pending = ref(false);
  const status = ref<'idle' | 'success' | 'error'>('idle');
  const feedbackKey = ref('');
  const attachmentInput = useTemplateRef<HTMLInputElement>('attachmentInput');
  const attachment = shallowRef<File>();

  const feedback = computed(() =>
    feedbackKey.value ? t(feedbackKey.value) : '',
  );

  function chooseAttachment() {
    attachmentInput.value?.click();
  }

  function selectAttachment() {
    attachment.value = attachmentInput.value?.files?.[0];

    if (feedbackKey.value.startsWith('contact.attachment')) {
      feedbackKey.value = '';
      status.value = 'idle';
    }
  }

  function clearAttachment() {
    if (attachmentInput.value) {
      attachmentInput.value.value = '';
    }

    selectAttachment();
  }

  async function submit() {
    if (pending.value) {
      return;
    }

    status.value = 'idle';
    feedbackKey.value = '';

    const file = attachment.value;
    let body: typeof form | FormData = { ...form };

    if (file) {
      const invalid = !file.size || !contactAttachmentMime(file.name);

      if (invalid || file.size > contactAttachmentMaxBytes) {
        status.value = 'error';
        feedbackKey.value = invalid
          ? 'contact.attachmentInvalid'
          : 'contact.attachmentTooLarge';

        return;
      }

      const multipart = new FormData();

      for (const [key, value] of Object.entries(form)) {
        multipart.set(key, value);
      }

      multipart.set('attachment', file);
      body = multipart;
    }

    pending.value = true;

    try {
      await $fetch('/api/contact', { method: 'POST', body });

      status.value = 'success';
      feedbackKey.value = 'contact.success';

      Object.assign(form, { name: '', email: '', message: '', website: '' });
      clearAttachment();
    } catch (error: unknown) {
      const code = (error as { statusCode?: number }).statusCode;

      status.value = 'error';
      feedbackKey.value =
        code === 503
          ? 'contact.unavailable'
          : code === 429
            ? 'contact.rateLimit'
            : code === 413 && file
              ? 'contact.attachmentTooLarge'
              : code === 422
                ? 'contact.attachmentInvalid'
                : code === 400
                  ? 'contact.invalid'
                  : 'contact.error';
    } finally {
      pending.value = false;
    }
  }

  return {
    form,
    pending,
    status,
    feedback,
    attachment,
    chooseAttachment,
    selectAttachment,
    clearAttachment,
    submit,
  };
}
